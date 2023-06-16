<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	import ExerciseTemplates from '$lib/components/ExerciseTemplates.svelte';
	import WorkoutComponent from '$lib/components/WorkoutComponent.svelte';

	import {
		exerciseTemplatesDrawerState,
		trainingState,
		workoutState,
		exerciseTemplateState
	} from '$lib/customTypes';
	import type { State, Workout, Exercise } from '$lib/customTypes';
	import { WorkoutType } from '@prisma/client';

	// ******************* Variables *******************

	let state: State = {
		training: trainingState.VIEW_ALL,
		workout: workoutState.VIEW,
		exerciseTemplatesDrawer: exerciseTemplatesDrawerState.CLOSE,
		exerciseTemplate: exerciseTemplateState.VIEW
	};

	$: workoutTemplates = $page.data.workoutTemplates;
	$: workoutEntries = $page.data.workoutEntries;
	$: exerciseTemplates = $page.data.exerciseTemplates;

	let currentWorkout: Workout;
	let selectedExercise: Exercise;
	let activeWorkout: Workout | null = null;

	// ******************* Functions *******************
	function forceRefresh() {
		currentWorkout = currentWorkout;
		activeWorkout = activeWorkout;
	}
</script>

<!-- ! Active Workout -->
{#if activeWorkout && state.workout !== workoutState.ACTIVE}
	<div class="w-full h-10 mt-16 fixed top-0 left-0 z-[500]">
		<button
			on:click={() => {
				state.training = trainingState.VIEW_ONE;
				state.workout = workoutState.ACTIVE;
			}}
			class="variant-filled-success w-full h-full btn active:scale-100 font-semibold"
		>
			In Progress: {activeWorkout.title}
		</button>
	</div>
{/if}

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
			class="container mx-auto flex h-full w-[95%] py-6 flex-col items-center justify-start gap-5 {activeWorkout
				? 'mt-8'
				: ''}"
		>
			<button
				on:click={() => {
					state.exerciseTemplatesDrawer = exerciseTemplatesDrawerState.OPEN;
				}}
				class="variant-ghost-secondary px-4 btn active:filter-none hover:filter-none duration-75 mx-12 w-32 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>Exercises</button
			>

			<h3 class="h3 -mb-4">Workout Templates</h3>

			<button
				on:click={() => {
					state.training = trainingState.NEW;
					state.workout = workoutState.EDIT;

					currentWorkout = {
						id: null,
						title: '',
						type: WorkoutType.TEMPLATE,
						favorite: false,
						note: '',
						exercises: []
					};
					invalidateAll();
				}}
				class="variant-ghost-primary btn mx-6 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>create workout template</button
			>

			{#if workoutTemplates}
				{#each workoutTemplates as workout}
					<button
						on:click={() => {
							currentWorkout = workout;

							state.training = trainingState.VIEW_ONE;
							state.workout = workoutState.VIEW;
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
			<WorkoutComponent
				bind:state
				bind:currentWorkout
				bind:selectedExercise
				bind:activeWorkout
				{forceRefresh}
			/>
		</div>
	{/if}
</div>
