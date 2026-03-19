<script lang="ts">
	import type { ActionData, PageData } from './$types.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 py-16">
		<a href="/" class="text-sm text-blue-600 hover:underline mb-6 inline-block">&larr; Back to home</a>

		<h1 class="text-4xl font-bold text-gray-900 mb-10">Edit category</h1>

		{#if form?.errors && Object.keys(form.errors).length > 0}
			<div class="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
				<p class="text-red-700 text-sm font-medium">Please fix the following errors:</p>
				<ul class="mt-1 list-disc list-inside text-red-600 text-sm">
					{#each Object.values(form.errors) as err}
						<li>{err}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<form method="POST" action="?/update" class="flex flex-col gap-4">
			<div class="flex flex-col gap-1">
				<label for="name" class="text-sm font-medium text-gray-700">Name</label>
				<input
					id="name"
					type="text"
					name="name"
					placeholder="Category name"
					value={form?.name ?? data.category.name}
					maxlength="50"
					class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
				/>
				{#if form?.errors?.name}
					<p class="text-red-600 text-sm">{form.errors.name}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-1">
				<label for="color" class="text-sm font-medium text-gray-700">Colour</label>
				<input
					id="color"
					type="color"
					name="color"
					value={form?.color ?? data.category.color}
					class="h-10 w-14 cursor-pointer rounded-md border border-gray-300 p-1"
				/>
				{#if form?.errors?.color}
					<p class="text-red-600 text-sm">{form.errors.color}</p>
				{/if}
			</div>

			<div class="flex gap-3">
				<button
					type="submit"
					class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					Save changes
				</button>
				<a
					href="/"
					class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>
