<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import {
		exerciseTemplateState,
		trainingState,
		workoutsHistoryDrawerState,
		workoutState
	} from '$lib/customTypes';
	import type { Workout, State } from '$lib/customTypes';

	// ******************* Variables *******************

	export let state: State;

	export let workoutEntries: Workout[];
	export let currentWorkout: Workout;
</script>

<div class="w-[90%] max-w-[550px] h-fit py-3 pb-8 mx-auto">
	<!-- ? Header -->
	<div class="h-10 mb-4 w-full relative">
		<button
			on:click={() => {
				if (state.workoutsHistoryDrawer === workoutsHistoryDrawerState.OPEN) {
					state.workoutsHistoryDrawer = workoutsHistoryDrawerState.CLOSE;
					invalidateAll();
				}
			}}
			class="btn-icon absolute right-0 top-[-3px] w-10 h-10"
			><svg
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
				/>
			</svg></button
		>

		{#if state.exerciseTemplate === exerciseTemplateState.VIEW}
			<h3 class="h3 text-center">Workouts History</h3>
		{/if}
	</div>

	<!-- ? Content -->
	<div class="flex flex-col gap-5 items-center">
		{#if workoutEntries.length}
			{#each workoutEntries as workout}
				<button
					on:click={() => {
						currentWorkout = workout;

						state.training = trainingState.VIEW_ONE;
						state.workout = workoutState.VIEW;
						state.workoutsHistoryDrawer = workoutsHistoryDrawerState.CLOSE;
						invalidateAll();
					}}
					class="card card-hover max-w-md flex w-full cursor-pointer flex-col items-center justify-start rounded-lg py-3"
				>
					<h2 class="h2 text-surface-800-100-token">{workout.title}</h2>
					<ul class="list">
						{#each workout.exercises as exercise}
							<li class="list-item">
								{exercise.sets.length ? exercise.sets.length + ' x ' : ''}
								{exercise.exerciseTemplate ? exercise.exerciseTemplate.title : 'ERROR'}
							</li>
						{/each}
					</ul>
				</button>
			{/each}
		{:else}
			<div class="h5 text-center">No Workouts Available</div>
		{/if}
	</div>
</div>
