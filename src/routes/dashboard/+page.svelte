<script lang="ts">
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(amount);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-6xl mx-auto px-4 py-16">
		<a href="/" class="text-sm text-blue-600 hover:underline mb-6 inline-block">&larr; Back to home</a>

		<h1 class="text-4xl font-bold text-gray-900 mb-2">Monthly Cost Dashboard</h1>
		<p class="text-lg text-gray-600 mb-10">Recurring costs broken down by month and category.</p>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.months as monthData (monthData.month)}
				<div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
					<div class="px-4 py-3 bg-gray-800 text-white">
						<h2 class="text-base font-semibold">{monthData.monthName}</h2>
					</div>

					<div class="px-4 py-3">
						{#if monthData.byCategory.length === 0}
							<p class="text-sm text-gray-400 italic">No charges</p>
						{:else}
							<ul class="space-y-2 mb-3">
								{#each monthData.byCategory as cat (cat.categoryId)}
									<li class="flex items-center gap-2 text-sm">
										<span
											class="w-3 h-3 rounded-full flex-shrink-0"
											style="background-color: {cat.categoryColor};"
										></span>
										<span class="flex-1 text-gray-700 truncate">{cat.categoryName}</span>
										<span class="font-mono text-gray-900 tabular-nums">{formatCurrency(cat.total)}</span>
									</li>
								{/each}
							</ul>

							<div class="border-t border-gray-100 pt-2 flex justify-between items-center">
								<span class="text-sm font-semibold text-gray-700">Total</span>
								<span class="font-mono font-bold text-gray-900 tabular-nums">{formatCurrency(monthData.total)}</span>
							</div>

							{#if data.hasPeople && monthData.byPerson.length > 0}
								<div class="mt-3 pt-3 border-t border-gray-100">
									<p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Per person</p>
									<ul class="space-y-1.5">
										{#each monthData.byPerson as person (person.personId)}
											<li class="flex items-center gap-2 text-sm">
												<span
													class="w-3 h-3 rounded-full flex-shrink-0"
													style="background-color: {person.personColor};"
												></span>
												<span class="flex-1 text-gray-700 truncate">{person.personName}</span>
												<span class="font-mono text-gray-900 tabular-nums">{formatCurrency(person.total)}</span>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
