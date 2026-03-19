<script lang="ts">
	import type { ActionData, PageData } from './$types.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 py-16">
		<a href="/categories/{data.category.id}" class="text-sm text-blue-600 hover:underline mb-6 inline-block">&larr; Back to {data.category.name}</a>

		<div class="flex items-center gap-3 mb-10">
			<span
				class="w-6 h-6 rounded-full flex-shrink-0 border border-gray-200"
				style="background-color: {data.category.color};"
			></span>
			<h1 class="text-4xl font-bold text-gray-900">Edit service</h1>
		</div>

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
					placeholder="e.g. Netflix"
					value={form?.name ?? data.service.name}
					class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
				/>
				{#if form?.errors?.name}
					<p class="text-red-600 text-sm">{form.errors.name}</p>
				{/if}
			</div>

			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex flex-col gap-1 flex-1">
					<label for="amount" class="text-sm font-medium text-gray-700">Amount ({data.service.currency})</label>
					<input
						id="amount"
						type="number"
						name="amount"
						placeholder="0.00"
						min="0.01"
						step="0.01"
						value={form?.amount ?? data.service.amount}
						class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					/>
					{#if form?.errors?.amount}
						<p class="text-red-600 text-sm">{form.errors.amount}</p>
					{/if}
				</div>

				<div class="flex flex-col gap-1 flex-1">
					<label for="frequency" class="text-sm font-medium text-gray-700">Frequency</label>
					<select
						id="frequency"
						name="frequency"
						class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					>
						<option value="monthly" selected={( form?.frequency ?? data.service.frequency) === 'monthly'}>Monthly</option>
						<option value="quarterly" selected={(form?.frequency ?? data.service.frequency) === 'quarterly'}>Quarterly</option>
						<option value="yearly" selected={(form?.frequency ?? data.service.frequency) === 'yearly'}>Yearly</option>
					</select>
					{#if form?.errors?.frequency}
						<p class="text-red-600 text-sm">{form.errors.frequency}</p>
					{/if}
				</div>
			</div>

			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex flex-col gap-1 flex-1">
					<label for="billingMonth" class="text-sm font-medium text-gray-700">Billing month</label>
					<select
						id="billingMonth"
						name="billingMonth"
						class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					>
						{#each months as month, i}
							<option value={i + 1} selected={(form?.billingMonth ?? String(data.service.billingMonth)) === String(i + 1)}>{month}</option>
						{/each}
					</select>
					{#if form?.errors?.billingMonth}
						<p class="text-red-600 text-sm">{form.errors.billingMonth}</p>
					{/if}
				</div>

				<div class="flex flex-col gap-1 flex-1">
					<label for="activeFrom" class="text-sm font-medium text-gray-700">Active from</label>
					<input
						id="activeFrom"
						type="date"
						name="activeFrom"
						value={form?.activeFrom ?? data.service.activeFrom}
						class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					/>
					{#if form?.errors?.activeFrom}
						<p class="text-red-600 text-sm">{form.errors.activeFrom}</p>
					{/if}
				</div>
			</div>

			<div class="flex gap-3">
				<button
					type="submit"
					class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					Save changes
				</button>
				<a
					href="/categories/{data.category.id}"
					class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>
