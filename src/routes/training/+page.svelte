<script lang="ts">
	import { page } from '$app/stores';

	const workoutTemplates = $page.data.workoutTemplates;
</script>

<div class="container mx-auto my-6 flex h-full w-[95%] flex-col items-center justify-start gap-5">
	<a
		href="/training/template/new"
		class="variant-ghost-primary btn mx-6 my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
		>create workout template</a
	>

	{#if workoutTemplates}
		{#each workoutTemplates as workout}
			<a
				href="/training/template/{workout.id}"
				class="card card-hover flex w-full cursor-pointer flex-col items-center justify-start rounded-lg py-3"
			>
				<h2 class="h2 text-surface-800-100-token">{workout.title}</h2>
				<ul class="list">
					{#each workout.exercises as exercise}
						<li class="list-item">{exercise.sets.length} x {exercise.title}</li>
					{/each}
				</ul>
			</a>
		{/each}
	{/if}
</div>
