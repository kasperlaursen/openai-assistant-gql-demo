import OpenAI from 'openai';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const ASSISTANT_ID = 'asst_EgCjsjt9ZKWlQZisZd5k3ueN';
const RETRY_DELAY = 1000;
const TIMEOUT = 60 * 1000;

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY
});

const callWithQuery = async (query: string) => {
	console.log('callWithQuery');
	let body: unknown = {
		query
	};

	if (!query.includes('query {')) {
		body = {
			query: `query ${query}`
		};
	}

	console.log('requesting with', body);
	try {
		const request = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
			headers: {
				accept: '*/*',
				'content-type': 'application/json',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site'
			},
			body: JSON.stringify(body),
			method: 'POST',
			mode: 'cors',
			credentials: 'omit'
		});
		const response = await request.json();
		console.log('response', response);
		return response;
	} catch (error) {
		console.log('error', error);
		return { failed: true, error };
	}
};

export interface MessageProps {
	owner: 'assistant' | 'user';
	message: string;
}

export const load = (async ({ cookies }) => {
	let threadId = cookies.get('threadid');

	let messages: MessageProps[] = [];

	if (!threadId) {
		const thread = await openai.beta.threads.create({});
		threadId = thread.id;
		cookies.set('threadid', threadId);
	} else {
		const openAiMessages = await openai.beta.threads.messages.list(threadId);
		messages = openAiMessages.data?.map((data) => {
			const messageContent = data?.content?.[0];
			return {
				owner: data.role,
				message: messageContent?.type === 'text' ? messageContent.text.value : '🤷‍♂️'
			};
		});
	}

	return {
		thread: threadId,
		messages
	};
}) satisfies PageServerLoad;

export const actions = {
	enter: async ({ request, cookies }) => {
		const data = await request.formData();
		const messageData = data.get('message');
		const threadData = cookies.get('threadid');

		if (!messageData || !threadData) {
			return { success: false, error: 'No missing or thread id...' };
		}
		const message = messageData.toString();
		const thread = threadData.toString();

		await openai.beta.threads.messages.create(thread, {
			role: 'user',
			content: message
		});

		const run = await openai.beta.threads.runs.create(thread, {
			assistant_id: ASSISTANT_ID,
			instructions: ''
		});

		let counter = 0;
		let runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);

		// Polling mechanism to see if runStatus is completed
		while (runStatus.status !== 'completed' && counter <= TIMEOUT) {
			console.log(`Waiting for OpenAI ${new Array(counter / 500).join('.')}`);
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
			runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);

			if (
				runStatus.status === 'requires_action' &&
				runStatus.required_action?.type === 'submit_tool_outputs'
			) {
				console.log('REQUIRES ACTION');
				const tool_outputsPromise = runStatus.required_action.submit_tool_outputs.tool_calls.map(
					async (action) => {
						console.log('ACTION', action);
						if (action.function.name === 'callWithQuery') {
							const query = JSON.parse(action.function.arguments).query!;
							const gqlResponse = await callWithQuery(query);
							return {
								tool_call_id: action.id,
								output: JSON.stringify(gqlResponse)
							};
						} else {
							return {
								tool_call_id: action.id,
								output: 'Failed'
							};
						}
					}
				);
				const tool_outputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[] =
					await Promise.all(tool_outputsPromise);

				console.log('ACTION SUBMITTING');

				if (
					(tool_outputs && tool_outputs.length > 0) ||
					tool_outputs.some(({ output }) => output === 'Failed')
				) {
					counter = 0;
					console.log('Submit', tool_outputs);
					await openai.beta.threads.runs.submitToolOutputs(thread, run.id, {
						tool_outputs
					});
				} else {
					console.log('Cancel', tool_outputs);
					await openai.beta.threads.runs.cancel(thread, run.id);
				}
			}

			if (counter >= TIMEOUT) {
				console.log('TIMEOUT');
				return null;
			}
			counter += RETRY_DELAY;
		}

		// Get the last assistant message from the messages array
		const openAiMessages = await openai.beta.threads.messages.list(thread);

		const messages: MessageProps[] = openAiMessages.data?.map((data) => {
			const messageContent = data?.content?.[0];
			return {
				owner: data.role,
				message: messageContent?.type === 'text' ? messageContent.text.value : '🤷‍♂️'
			};
		});
		return {
			messages
		};
	}
} satisfies Actions;
