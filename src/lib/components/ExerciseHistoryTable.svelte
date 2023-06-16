<script lang="ts">
	import type { set } from '@prisma/client';

	export let sets: set[];
</script>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<th class="text-center">Set</th>
				<th class="text-center">Weight</th>
				<th class="text-center">Reps</th>
			</tr>
		</thead>
		<tbody>
			{#each sets as set}
				<tr>
					<td
						class="text-center {set.type === 'W' ? 'text-orange-400' : ''} {set.type === 'D'
							? 'text-red-400'
							: ''}"
					>
						{#if set.type === 'W'}
							W
						{:else if set.type === 'D'}
							D
						{:else}
							{set.orderNumber}
						{/if}</td
					>
					<td class="text-center">{set.weight}</td>
					<td class="text-center">{set.reps}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
