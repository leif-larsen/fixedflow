<script lang="ts">
	import type { ActionData, PageData } from './$types.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 py-16">
		<h1 class="text-4xl font-bold text-gray-900 mb-2">FixedFlow</h1>
		<p class="text-lg text-gray-600 mb-10">Track your recurring costs, effortlessly.</p>

		<section class="mb-12">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Categories</h2>

			{#if data.categories.length === 0}
				<p class="text-gray-500 italic">No categories yet — add one below to get started.</p>
			{:else}
				<ul class="space-y-2">
					{#each data.categories as category (category.id)}
						<li class="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
							<span
								class="w-5 h-5 rounded-full flex-shrink-0 border border-gray-200"
								style="background-color: {category.color};"
							></span>
							<span class="text-gray-900 font-medium flex-1">{category.name}</span>
							<form method="POST" action="?/delete">
								<input type="hidden" name="id" value={category.id} />
								<button
									type="submit"
									class="text-gray-400 hover:text-red-600 transition-colors text-lg leading-none"
									aria-label="Delete {category.name}"
								>&#x2715;</button>
							</form>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section>
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Add a category</h2>

			<form method="POST" action="?/create" class="flex flex-col sm:flex-row gap-3 items-start">
				<div class="flex flex-col gap-1 flex-1">
					<input
						type="text"
						name="name"
						placeholder="Category name"
						value={form?.name ?? ''}
						maxlength="50"
						class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					/>
					{#if form?.errors?.name}
						<p class="text-red-600 text-sm">{form.errors.name}</p>
					{/if}
				</div>

				<div class="flex flex-col gap-1">
					<input
						type="color"
						name="color"
						value={form?.color ?? '#6366f1'}
						class="h-10 w-14 cursor-pointer rounded-md border border-gray-300 p-1"
					/>
					{#if form?.errors?.color}
						<p class="text-red-600 text-sm">{form.errors.color}</p>
					{/if}
				</div>

				<button
					type="submit"
					class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					Add
				</button>
			</form>
		</section>
	</div>
</div>
