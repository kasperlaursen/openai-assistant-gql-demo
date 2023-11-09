<script lang="ts">
	export let owner: 'assistant' | 'user' = 'assistant';
	export let message: string = '';
</script>

{#if owner === 'assistant'}
	<div class="rounded-lg p-4 bg-blue-50 whitespace-pre-wrap">
		<p class="text-blue-700">{message}</p>
	</div>
{:else if owner === 'user'}
	<div class="rounded-lg p-4 bg-green-50 whitespace-pre-wrap">
		<p class="text-green-700">{message}</p>
	</div>
{/if}
