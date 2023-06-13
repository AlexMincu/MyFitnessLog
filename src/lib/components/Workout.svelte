<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	import {
		type Workout,
		type Exercise,
		type Set,
		workoutStateType,
		trainingStateType
	} from '$lib/services/customTypes';
	import { SetType } from '$lib/services/customTypes';
	import {
		createWorkoutRequest,
		deleteWorkoutRequest,
		editWorkoutRequest
	} from '$lib/services/workoutService';

	// ******************* Variables *******************
	export let workoutState: string;
	export let workout: Workout;
	export let setTrainingState: Function;

	// ******************* Popups *******************
	const setTypePopup: PopupSettings = {
		event: 'click',
		target: 'fakeTarget',
		placement: 'bottom'
	};

	const optionsPopup: PopupSettings = {
		event: 'click',
		target: 'optionsPopup',
		placement: 'bottom'
	};

	// ******************* Function *******************
	function addExercise() {
		const exercise = {
			title: '',
			note: '',
			sets: []
		};
		addSet(exercise);

		workout.exercises = [...workout.exercises, exercise];
	}

	function addSet(exercise: Exercise) {
		exercise.sets = [
			...exercise.sets,
			{
				orderNumber: 1,
				type: SetType.N,
				weight: null,
				reps: null
			}
		];

		updateExerciseUI(exercise);
	}

	function updateSetsOrderNumber(sets: Set[]) {
		let index = 1;

		sets.forEach((set) => {
			if (set.type != 'W') set.orderNumber = index++;
			else set.orderNumber = 0;
		});

		sets.sort((a, b) => a.orderNumber - b.orderNumber);
	}

	function updateExerciseUI(exercise: Exercise) {
		updateSetsOrderNumber(exercise.sets);
		workout = workout;
	}

	function setWorkoutState(state: workoutStateType) {
		workoutState = state;
	}

	// ******************* Async function -> fetch *******************
	async function saveWorkout() {
		if (workout.id) {
			// Update existing template
			const response = await editWorkoutRequest(workout);

			if (response.success) {
				console.log(`Workout: Updated ${workout.id} workout successfully!`);
				setWorkoutState(workoutStateType.VIEW);
			} else {
				console.log(
					`Workout: Something went wrong, couldn't update workout ${workout.id}. Response: `,
					response
				);
			}
		} else {
			// Create new template
			const response = await createWorkoutRequest(workout);

			if (response.success) {
				console.log('Workout: Create workout successfully!');

				setTrainingState(trainingStateType.VIEW_ALL);
			} else {
				console.log("Workout: Something went wrong, couldn't create workout. Response: ", response);
			}
		}
	}

	async function deleteWorkout() {
		if (workout.id) {
			const response = await deleteWorkoutRequest(workout.id);
			if (response.success) {
				console.log(`Workout: Deleted workout ${workout.id} successfully!`);

				setTrainingState(trainingStateType.VIEW_ALL);
			} else if (response.notFound) {
				console.log(`Workout: Couldn't delete workout ${workout.id} - Not found`);
			} else {
				console.log(
					`Workout: Something went wrong, couldn't delete workout ${workout.id}. Response: `,
					response
				);
			}
		}
	}
</script>

<!-- ? Workout Card -->
<div class="card py-3 flex w-full flex-col items-center justify-start gap-4">
	<!-- ? Workout Card Header -->
	<div class="relative w-full flex flex-row justify-between align-center">
		<button
			on:click={() => {
				setTrainingState(trainingStateType.VIEW_ALL);
			}}
			class="btn-icon w-8 mx-3"
		>
			<svg
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
					d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
				/>
			</svg>
		</button>

		{#if workoutState === workoutStateType.VIEW}
			<!-- ? Options button -->
			<div use:popup={optionsPopup} class="btn-icon w-8 mx-1">
				<svg
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
						d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
					/>
				</svg>
			</div>

			<!-- ? Options pop-up -->
			<div class="card z-[999] w-32 rounded-md" data-popup="optionsPopup">
				<ul>
					<li class="my-3 flex items-center justify-center">
						<button
							on:click={() => {
								setWorkoutState(workoutStateType.EDIT);
							}}
							class="btn variant-filled-secondary mx-2 w-full !rounded-lg"
							type="button">Edit</button
						>
					</li>
					<li class="my-3 flex items-center justify-center">
						<button
							on:click={deleteWorkout}
							class="variant-filled-error btn mx-2 w-full !rounded-lg">Delete</button
						>
					</li>
				</ul>
			</div>
		{/if}
	</div>

	<!-- ? Workout Title -->
	<div>
		{#if workoutState === workoutStateType.EDIT}
			<input
				bind:value={workout.title}
				class="h4 input rounded-lg text-center"
				type="text"
				placeholder="Workout Title"
			/>
		{:else if workoutState === workoutStateType.VIEW}
			<div class=" h4 rounded-lg text-center {workout.title ? '' : 'text-red-400'}">
				{workout.title ? workout.title : 'Missing title!'}
			</div>
		{/if}
	</div>

	<!-- ? Workout Note -->
	<div class="w-[90%]">
		{#if workoutState === workoutStateType.EDIT}
			<textarea
				bind:value={workout.note}
				class="textarea rounded-lg"
				rows="2"
				placeholder="Workout notes."
			/>
		{:else if workoutState === workoutStateType.VIEW}
			<div class=" textarea h-16 overflow-hidden overflow-y-scroll break-words rounded-lg p-2">
				{workout.note}
			</div>
		{/if}
	</div>

	<!-- ? Exercises -->
	{#each workout.exercises as exercise, exerciseIndex}
		<!-- ? Exercise container -->
		<div class="flex w-full flex-col items-center justify-start">
			<!-- ? Exercise Title -->
			<!-- TODO - Exercise database select popup/modal -->
			<div>
				{#if workoutState === workoutStateType.EDIT}
					<input
						bind:value={exercise.title}
						class="h6 input mb-2 rounded-lg text-center"
						type="text"
						placeholder="Exercise"
					/>
				{:else if workoutState === workoutStateType.VIEW}
					<div class="h6 mb-2 rounded-lg text-center {exercise.title ? '' : 'text-red-400'}">
						{exercise.title ? exercise.title : 'Missing title!'}
					</div>
				{/if}
			</div>

			<!-- ? Exercise Note -->
			<div class="w-full">
				{#if workoutState === workoutStateType.EDIT}
					<textarea
						bind:value={exercise.note}
						class="textarea variant-filled-surface w-full rounded-lg p-1.5 text-center"
						rows="1"
						placeholder="SET X REPS @ LSRPE | REST"
					/>
				{:else if workoutState === workoutStateType.VIEW}
					<div
						class="textarea line mb-3 h-10 w-full overflow-hidden break-words rounded-lg p-2 text-center leading-6"
					>
						{exercise.note}
					</div>
				{/if}
			</div>

			<!-- ? Sets container -->
			<div class="flex flex-col w-full items-center">
				<!-- ? Sets Header -->
				<div class="mb-1.5 grid w-full grid-cols-3 content-center justify-items-center text-center">
					<div>Set</div>
					<div>Weight</div>
					<div>Reps</div>
				</div>

				<!-- ? Sets Rows -->
				{#each exercise.sets as set, setIndex}
					<!-- ? Set container -->
					<div class="grid w-full grid-cols-3 content-center justify-items-center text-center">
						<!-- ? Set Order Number Column -->
						{#if workoutState === workoutStateType.EDIT}
							<div
								use:popup={{
									...setTypePopup,
									target: `setTypePopup-${exerciseIndex}-${setIndex}`
								}}
								class="btn-icon !bg-transparent {set.type === 'W'
									? 'text-orange-400'
									: ''} {set.type === 'D' ? 'text-red-400' : ''}"
							>
								{#if set.type === 'W'}
									W
								{:else if set.type === 'D'}
									D
								{:else}
									{set.orderNumber}
								{/if}
							</div>

							<!-- ? Set Popup -->
							<div
								data-popup={`setTypePopup-${exerciseIndex}-${setIndex}`}
								class="card align-center p-4"
							>
								<ul
									class="list flex flex-col justify-center text-center text-sm font-semibold tracking-wider"
								>
									<li>
										<button
											on:click={() => {
												set.type = SetType.N;
												updateExerciseUI(exercise);
											}}
											class="btn m-0 w-full p-0.5 text-center uppercase">Normal</button
										>
									</li>
									<li>
										<button
											on:click={() => {
												set.type = SetType.W;
												updateExerciseUI(exercise);
											}}
											class="btn m-0 w-full p-0.5 text-center uppercase text-orange-400"
											>Warmup</button
										>
									</li>
									<li>
										<button
											on:click={() => {
												set.type = SetType.D;
												updateExerciseUI(exercise);
											}}
											class="btn m-0 w-full p-0.5 text-center uppercase text-red-400"
											>DropSet</button
										>
									</li>
								</ul>
							</div>
						{:else if workoutState === workoutStateType.VIEW}
							<div
								class="btn-icon cursor-default !bg-transparent {set.type === 'W'
									? 'text-orange-400'
									: ''} {set.type === 'D' ? 'text-red-400' : ''}"
							>
								{#if set.type === 'W'}
									W
								{:else if set.type === 'D'}
									D
								{:else}
									{set.orderNumber}
								{/if}
							</div>
						{/if}

						<!-- ? Set Weight Column -->
						<div class="w-full">
							{#if workoutState === workoutStateType.EDIT}
								<input
									bind:value={set.weight}
									type="text"
									class="input my-auto h-[80%] w-[80%] rounded-2xl text-center"
								/>
							{:else if workoutState === workoutStateType.VIEW}
								<div
									class="input m-auto flex h-[80%] w-[80%] items-center justify-center rounded-2xl"
								>
									{set.weight ? set.weight : 0}
								</div>
							{/if}
						</div>

						<!-- ? Set Reps Column -->
						<div class="w-full">
							{#if workoutState === workoutStateType.EDIT}
								<input
									bind:value={set.reps}
									type="text"
									name="setReps"
									class="input my-auto h-[80%] w-[80%] rounded-2xl text-center"
								/>
							{:else if workoutState === workoutStateType.VIEW}
								<div
									class="input m-auto flex h-[80%] w-[80%] items-center justify-center rounded-2xl"
								>
									{set.reps ? set.reps : 0}
								</div>
							{/if}
						</div>
					</div>
				{/each}

				<!-- ? Add Set Button -->
				{#if workoutState === workoutStateType.EDIT}
					<button
						on:click={() => {
							addSet(exercise);
						}}
						type="button"
						class="variant-ghost-primary btn mx-6 my-3 h-8 rounded-lg uppercase tracking-wide"
						>add set</button
					>
				{/if}
			</div>
		</div>
	{/each}

	<!-- ? Add Exercise Button -->
	{#if workoutState === workoutStateType.EDIT}
		<button
			on:click={addExercise}
			type="button"
			class="variant-ghost-primary btn mx-6 h-8 rounded-lg uppercase tracking-wide"
			>add exercise</button
		>
	{/if}

	{#if workoutState === workoutStateType.EDIT}
		<!-- ? Create/Update Workout Template Button -->
		<button
			on:click={saveWorkout}
			type="submit"
			class="btn variant-filled-success mx-6 h-8 rounded-lg font-semibold uppercase tracking-wide"
			>save workout template</button
		>
	{:else if workoutState === workoutStateType.VIEW}
		<!-- ? Start Workout Template -->
		<button
			on:click={() => {
				alert('TODO');
			}}
			class="btn variant-filled-secondary mx-6 h-12 rounded-lg font-semibold uppercase tracking-wide"
			>Start Workout</button
		>
	{/if}
</div>
