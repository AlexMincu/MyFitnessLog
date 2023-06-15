<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import ExerciseTemplates from '$lib/components/ExerciseTemplates.svelte';

	import Workout from '$lib/components/Workout.svelte';
	import {
		exerciseTemplatesStateType,
		trainingStateType,
		workoutStateType,
		type Workout as WorkoutType
	} from '$lib/customTypes';

	// ******************* Variables *******************
	$: workoutTemplates = $page.data.workoutTemplates;
	let currentWorkout: WorkoutType;
	let trainingState: trainingStateType = trainingStateType.VIEW_ALL;
	$: exerciseTemplates = $page.data.exerciseTemplates;
	let exerciseTemplatesState = exerciseTemplatesStateType.CLOSE;

	// ******************* Functions *******************

	function setTrainingState(state: trainingStateType): void {
		trainingState = state;
		// When state changes - refresh UI
		invalidateAll();
	}

	function setExerciseTemplatesState(state: exerciseTemplatesStateType) {
		exerciseTemplatesState = state;
		// When state changes - refresh UI
		invalidateAll();
	}
</script>

<!-- ! Exercise Templates 'Drawer' -->
<div class="w-full h-full relative">
	<div
		class="transition-all bg-surface-100-800-token w-full h-full overflow-y-scroll overflow-x-hidden absolute left-0 top-0 {exerciseTemplatesState ===
		exerciseTemplatesStateType.CLOSE
			? '-translate-x-full'
			: ''}"
	>
		<ExerciseTemplates {exerciseTemplates} {setExerciseTemplatesState} />
	</div>

	<!-- ! VIEW_ALL STATE -->
	{#if trainingState === trainingStateType.VIEW_ALL}
		<div
			class="container mx-auto flex h-full w-[95%] py-6 flex-col items-center justify-start gap-5"
		>
			<button
				on:click={() => {
					setTrainingState(trainingStateType.NEW);
				}}
				class="variant-ghost-primary btn mx-6 my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>create workout template</button
			>

			<button
				on:click={() => {
					exerciseTemplatesState = exerciseTemplatesStateType.OPEN;
				}}
				class="variant-ghost-secondary btn mx-12 mb-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>Exercise Templates</button
			>

			{#if workoutTemplates}
				{#each workoutTemplates as workout}
					<button
						on:click={() => {
							setTrainingState(trainingStateType.VIEW_ONE);
							currentWorkout = workout;
						}}
						class="card card-hover flex w-full cursor-pointer flex-col items-center justify-start rounded-lg py-3"
					>
						<h2 class="h2 text-surface-800-100-token">{workout.title}</h2>
						<ul class="list">
							{#each workout.exercises as exercise}
								<li class="list-item">
									{exercise.sets.length ? exercise.sets.length + ' x ' : ''}
									{exercise.title}
								</li>
							{/each}
						</ul>
					</button>
				{/each}
			{/if}
		</div>

		<!-- ! NEW STATE -->
	{:else if trainingState === trainingStateType.NEW}
		<Workout
			workoutState={workoutStateType.EDIT}
			workout={{
				id: null,
				title: '',
				type: 'TEMPLATE',
				favorite: false,
				note: '',
				exercises: []
			}}
			{setTrainingState}
		/>

		<!-- ! VIEW_ONE STATE -->
	{:else if trainingState === trainingStateType.VIEW_ONE}
		<Workout workoutState={workoutStateType.VIEW} workout={currentWorkout} {setTrainingState} />
	{/if}
</div>
