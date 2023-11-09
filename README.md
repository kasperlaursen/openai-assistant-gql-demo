![Kasper's AI Extension Banner](https://raw.githubusercontent.com/kasperlaursen/openai-assistant-gql-demo/main/banner.png)

# GraphQL and OpenAI Assistant Experiment

This repository contains a SvelteKit application that integrates OpenAI's GPT with GraphQL to provide an interactive assistant experience. Users can ask questions about a GraphQL schema, and the assistant will provide responses.

## Features

- **GraphQL Integration**: Communicates with a GraphQL API to fetch and display data based on user queries.
- **OpenAI Assistant**: Leverages OpenAI's API to understand and respond to user queries.
- **Interactive UI**: Provides a chat-like interface for users to interact with the GraphQL assistant.

## Example

![Example](https://raw.githubusercontent.com/kasperlaursen/openai-assistant-gql-demo/main/example.png)

## Getting Started

### Prerequisites

- Node.js and npm installed.
- An OpenAI API key.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kasperlaursen/openai-assistant-gql-demo.git
```

2. Navigate to the project directory:

```bash
cd openai-assistant-gql-demo
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file at the root of your project and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
```

### Setup the Assistant and Update the ID

To configure your assistant with the specific capabilities required for interacting with the Star Wars GraphQL API, follow these steps:

1. **Download the GraphQL Schema**:
   Download the full GraphQL schema from the following Apollo Studio link: [Star Wars SWAPI GraphQL Schema](https://studio.apollographql.com/public/star-wars-swapi/variant/current/schema/sdl).

2. **Configure the Assistant**:
   Set up your assistant with the instructions provided.

```
You are an helpful assistant with knowledge about the Star Wars GraphQL api and its full schema.
You will help the user gain information about the schema, as well as generating queries for the graphql endpoint based on the schema.
The full GraphQL schema is star-wars-swapi.graphql.
```

3. **Update the Assistant ID**:
   In your code, ensure you have the correct `ASSISTANT_ID` set to link to your configured OpenAI assistant. This ID connects your code with the specific assistant instance trained for this task.

4. **Upload the GraphQL Schema**:
   Upload the `star-wars-swapi.graphql` schema file to your application's environment where the assistant can access it.

5. **Configure Tool Functions**:
   Utilize the `callWithQuery` function as a bridge between your assistant and the GraphQL API. This function should be defined to accept a `query` parameter, representing the GraphQL query to be executed against the Star Wars API.

Here's the JSON schema for the `callWithQuery` function for your reference:

```json
{
	"name": "callWithQuery",
	"description": "Sends a GraphQL Query request to the api, and returns the result.",
	"parameters": {
		"type": "object",
		"properties": {
			"query": {
				"type": "string",
				"description": "The graphql query to execute"
			}
		},
		"required": ["query"]
	}
}
```

6. **Integrate with Code Interpreter and Retrieval Tools**:
   Make sure your setup includes a code interpreter for the dynamic execution of the code snippets and a retrieval mechanism to fetch information based on user requests.

After completing these steps, your assistant should be ready to help users explore the Star Wars GraphQL schema efficiently.

### Running the Application

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to view the application.

## Usage

- Type your questions about the GraphQL schema into the input field.
- Press 'Send' to submit your question.
- View the assistant's response in the chat interface.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## Attribution

Ui by: [v0.dev](https://v0.dev/t/wUdz4ISUZZp)
