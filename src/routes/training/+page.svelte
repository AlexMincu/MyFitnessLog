<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	import ExerciseTemplates from '$lib/components/ExerciseTemplates.svelte';
	import Workout from '$lib/components/Workout.svelte';

	import {
		exerciseTemplatesDrawerState,
		trainingState,
		workoutState,
		exerciseTemplateState
	} from '$lib/customTypes';
	import type { State, Workout as WorkoutType, Exercise } from '$lib/customTypes';

	// ******************* Variables *******************

	let state: State = {
		training: trainingState.VIEW_ALL,
		workout: workoutState.VIEW,
		exerciseTemplatesDrawer: exerciseTemplatesDrawerState.CLOSE,
		exerciseTemplate: exerciseTemplateState.VIEW
	};

	$: workoutTemplates = $page.data.workoutTemplates;
	$: exerciseTemplates = $page.data.exerciseTemplates;

	let currentWorkout: WorkoutType;
	let selectedExercise: Exercise;

	// ******************* Functions *******************
	function forceRefresh() {
		currentWorkout = currentWorkout;
	}

	$: console.log(workoutTemplates);
</script>

<!-- ! Exercise Templates 'Drawer' -->
<div class="w-full h-full relative">
	<div
		class="transition-all bg-surface-100-800-token w-full h-full overflow-y-scroll overflow-x-hidden absolute left-0 top-0 {state.exerciseTemplatesDrawer ===
		exerciseTemplatesDrawerState.CLOSE
			? '-translate-x-full'
			: ''}"
	>
		<ExerciseTemplates bind:state {exerciseTemplates} bind:selectedExercise {forceRefresh} />
	</div>

	<!-- ! VIEW_ALL STATE -->
	{#if state.training === trainingState.VIEW_ALL}
		<div
			class="container mx-auto flex h-full w-[95%] py-6 flex-col items-center justify-start gap-5"
		>
			<button
				on:click={() => {
					state = { ...state, training: trainingState.NEW, workout: workoutState.EDIT };

					currentWorkout = {
						id: null,
						title: '',
						type: 'TEMPLATE',
						favorite: false,
						note: '',
						exercises: []
					};
					invalidateAll();
				}}
				class="variant-ghost-primary btn mx-6 my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>create workout template</button
			>

			<button
				on:click={() => {
					state.exerciseTemplatesDrawer = exerciseTemplatesDrawerState.OPEN;
				}}
				class="variant-ghost-secondary px-4 btn active:filter-none hover:filter-none duration-75 mx-12 mb-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>Exercise Templates</button
			>

			{#if workoutTemplates}
				{#each workoutTemplates as workout}
					<button
						on:click={() => {
							currentWorkout = workout;

							state = { ...state, training: trainingState.VIEW_ONE, workout: workoutState.VIEW };
							invalidateAll();
						}}
						class="card card-hover flex w-full cursor-pointer flex-col items-center justify-start rounded-lg py-3"
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
			{/if}
		</div>

		<!-- ! Workout Component -->
	{:else}
		<!-- TODO - hide inputs when drawer open -->
		<div
			class={state.exerciseTemplatesDrawer === exerciseTemplatesDrawerState.OPEN ? 'hidden' : ''}
		>
			<Workout bind:state bind:workout={currentWorkout} bind:selectedExercise />
		</div>
	{/if}
</div>
