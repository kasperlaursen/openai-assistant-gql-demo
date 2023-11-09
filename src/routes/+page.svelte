<script>
	import { enhance } from '$app/forms';
	import Message from './Message.svelte';
	import Spinner from './Spinner.svelte';
	export let data;

	export let form;
	let formIsLoading = false;
</script>

<svelte:head>
	<title>Graphql bot</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="h-screen w-full flex flex-col bg-gray-100">
	<main class="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
		{#if formIsLoading}
			<Spinner />
		{/if}
		{#if form?.messages}
			{#each form.messages as message}
				<Message {...message} />
			{/each}
		{:else if data.messages}
			{#each data.messages as message}
				<Message {...message} />
			{/each}
		{/if}
		<Message
			{...{
				owner: 'assistant',
				message: `Hello 👋
I am your GraphQL assistant.
Ask me any questions you might have about the graph!`
			}}
		/>
	</main>
	<footer class="p-4 bg-white shadow-md">
		<form
			method="POST"
			action="?/enter"
			use:enhance={() => {
				formIsLoading = true;
				return async ({ update }) => {
					formIsLoading = false;
					update();
				};
			}}
			class="flex items-center space-x-4"
		>
			<input
				disabled={formIsLoading}
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				id="message"
				name="message"
				placeholder="Type your message here..."
			/>
			<input type="hidden" name="thread" id="thread" value={data.thread} disabled={formIsLoading} />
			<button
				disabled={formIsLoading}
				id="submit"
				type="submit"
				name="submit"
				value="Send"
				class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-700 text-white hover:bg-purple-700/90 h-10 px-4 py-2"
			>
				Send
			</button>
		</form>
	</footer>
</section>
