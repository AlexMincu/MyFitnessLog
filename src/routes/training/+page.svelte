<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	import Workout from '$lib/components/Workout.svelte';
	import {
		trainingStateType,
		workoutStateType,
		type Workout as WorkoutType
	} from '$lib/services/customTypes';

	// ******************* Variables *******************
	$: workoutTemplates = $page.data.workoutTemplates;
	let currentWorkout: WorkoutType;
	let trainingState: trainingStateType = trainingStateType.VIEW_ALL;

	// ******************* Functions *******************

	function setTrainingState(state: trainingStateType): void {
		trainingState = state;
		// When state changes - refresh UI
		invalidateAll();
	}
</script>

<!-- ! VIEW_ALL STATE -->
{#if trainingState === trainingStateType.VIEW_ALL}
	<div class="container mx-auto my-6 flex h-full w-[95%] flex-col items-center justify-start gap-5">
		<button
			on:click={() => {
				setTrainingState(trainingStateType.NEW);
			}}
			class="variant-ghost-primary btn mx-6 my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
			>create workout template</button
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
