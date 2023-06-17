<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import { popup, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	import {
		workoutState,
		trainingState,
		SetType,
		exerciseTemplatesDrawerState,
		WorkoutType
	} from '$lib/customTypes';
	import type { State, Workout, Exercise, Set } from '$lib/customTypes';
	import {
		createWorkoutRequest,
		deleteWorkoutRequest,
		editWorkoutRequest
	} from '$lib/services/workoutService';
	import ExerciseHistoryAccordion from './ExerciseHistoryAccordion.svelte';

	// ******************* Variables *******************
	export let state: State;
	export let currentWorkout: Workout;
	export let selectedExercise: Exercise;
	export let activeWorkout: Workout | null;
	export let forceRefresh: () => void;

	// ******************* Popups *******************
	const optionsPopup: PopupSettings = {
		event: 'click',
		target: 'optionsPopup',
		placement: 'bottom'
	};

	const setTypePopup: PopupSettings = {
		event: 'click',
		target: 'fakeTarget',
		placement: 'bottom'
	};

	const exerciseOptionsPopup: PopupSettings = {
		event: 'click',
		target: 'fakeTarget',
		placement: 'bottom'
	};

	// ******************* Toasts *******************
	const validationErrorToastSetting: ToastSettings = {
		message: '',
		background: 'variant-filled-error',
		timeout: 2500
	};

	// eslint-disable-next-line
	function triggerValidationErrorToasts(validationErrors: any[]) {
		validationErrors.forEach(
			(errorObject: {
				workoutTitle: string[];
				exerciseTitle: string[];
				setWeight: string[];
				setReps: string[];
			}) => {
				const { workoutTitle, exerciseTitle, setWeight, setReps } = errorObject;

				if (workoutTitle) {
					toastStore.trigger({
						...validationErrorToastSetting,
						message: `${workoutTitle[0]}`
					});
				}
				if (exerciseTitle) {
					toastStore.trigger({
						...validationErrorToastSetting,
						message: `${exerciseTitle[0]}`
					});
				}
				if (setWeight) {
					toastStore.trigger({
						...validationErrorToastSetting,
						message: `${setWeight[0]}`
					});
				}
				if (setReps) {
					toastStore.trigger({
						...validationErrorToastSetting,
						message: `${setReps[0]}`
					});
				}
			}
		);
	}

	// ******************* Function *******************
	function addExercise(workout: Workout) {
		const exercise = {
			exerciseTemplate: {
				id: null,
				title: '',
				description: '',
				userId: null
			},
			note: '',
			sets: []
		};
		addSet(exercise);

		workout.exercises = [...workout.exercises, exercise];

		forceRefresh();
	}

	function removeExercise(exerciseIndex: number, workout: Workout) {
		workout.exercises.splice(exerciseIndex, 1);

		forceRefresh();
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

		updateSetsOrderNumber(exercise.sets);
		forceRefresh();
	}

	function removeSet(setIndex: number, exercise: Exercise) {
		exercise.sets.splice(setIndex, 1);

		updateSetsOrderNumber(exercise.sets);
		forceRefresh();
	}

	function updateSetsOrderNumber(sets: Set[]) {
		let index = 1;

		sets.forEach((set) => {
			if (set.type != 'W') set.orderNumber = index++;
			else set.orderNumber = 0;
		});

		sets.sort((a, b) => a.orderNumber - b.orderNumber);
	}

	// ******************* Async function -> fetch *******************
	async function createWorkout(workout: Workout) {
		const response = await createWorkoutRequest(workout);

		if (response.success) {
			console.log('Workout: Create workout successfully!');

			state.training = trainingState.VIEW_ALL;
			state.workout = workoutState.VIEW;
			activeWorkout = null;
			invalidateAll();
		} else if (response.validationErrors) {
			triggerValidationErrorToasts(response.validationErrors);

			console.log(
				"Workout: Couldn't create workout. Validation Errors: ",
				response.validationErrors
			);
		} else {
			console.log("Workout: Something went wrong, couldn't create workout. Error: ", response);
		}
	}

	async function updateWorkout(workout: Workout) {
		const response = await editWorkoutRequest(workout);

		if (response.success) {
			console.log(`Workout: Updated workout successfully!`);

			state.workout = workoutState.VIEW;
			invalidateAll();
		} else if (response.validationErrors) {
			triggerValidationErrorToasts(response.validationErrors);

			console.log(
				"Workout: Couldn't update workout. Validation Errors: ",
				response.validationErrors
			);
		} else {
			console.log(`Workout: Something went wrong, couldn't update workout. Response: `, response);
		}
	}

	async function deleteWorkout() {
		if (currentWorkout.id) {
			const response = await deleteWorkoutRequest(currentWorkout.id);

			if (response.success) {
				console.log(`Workout: Deleted workout successfully!`);

				state.training = trainingState.VIEW_ALL;
				invalidateAll();
			} else {
				console.log(`Workout: Something went wrong, couldn't delete workout. Response: `, response);
			}
		}
	}
</script>

<!-- ? Workout Card -->
<div
	class="card py-3 flex w-full flex-col items-center justify-start gap-4 {activeWorkout &&
	state.workout != workoutState.ACTIVE
		? 'mt-10'
		: ''}"
>
	<!-- ? Workout Card Header -->
	<div class="relative w-full flex flex-row justify-between align-center">
		<!-- ? Go Back Button -->
		<button
			on:click={() => {
				if (state.training === trainingState.NEW) {
					state.training = trainingState.VIEW_ALL;
				} else if (state.training === trainingState.VIEW_ONE) {
					if (state.workout === workoutState.VIEW) {
						state.training = trainingState.VIEW_ALL;
					} else if (state.workout === workoutState.EDIT) {
						state.workout = workoutState.VIEW;
					} else if (state.workout === workoutState.ACTIVE) {
						state.workout = workoutState.VIEW;
						state.training = trainingState.VIEW_ALL;
					}
				}

				forceRefresh();
				invalidateAll();
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

		{#if state.workout === workoutState.VIEW}
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
								state.workout = workoutState.EDIT;
								invalidateAll();
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
		{#if state.workout === workoutState.EDIT}
			<input
				bind:value={currentWorkout.title}
				class="h4 input rounded-lg text-center"
				type="text"
				placeholder="Workout Title"
			/>
		{:else if state.workout === workoutState.ACTIVE && activeWorkout}
			<input
				bind:value={activeWorkout.title}
				class="h4 input rounded-lg text-center"
				type="text"
				placeholder="Workout Title"
			/>
		{:else if state.workout === workoutState.VIEW}
			<div class=" h4 rounded-lg text-center {currentWorkout.title ? '' : 'text-red-400'}">
				{currentWorkout.title ? currentWorkout.title : 'Missing title!'}
			</div>
		{/if}
	</div>

	<!-- ? Workout Note -->
	<div class="w-[90%]">
		{#if state.workout === workoutState.EDIT}
			<textarea
				bind:value={currentWorkout.note}
				class="textarea rounded-lg"
				rows="2"
				placeholder="Workout notes."
			/>
		{:else if state.workout === workoutState.ACTIVE && activeWorkout}
			<textarea
				bind:value={activeWorkout.note}
				class="textarea rounded-lg"
				rows="2"
				placeholder="Workout notes."
			/>
		{:else if state.workout === workoutState.VIEW}
			<div class=" textarea h-16 overflow-hidden overflow-y-scroll break-words rounded-lg p-2">
				{currentWorkout.note}
			</div>
		{/if}
	</div>

	<!-- ? Exercises -->
	{#if state.workout !== workoutState.ACTIVE}
		{#each currentWorkout.exercises as exercise, exerciseIndex}
			<!-- ? Exercise container -->
			<div class="flex w-full flex-col items-center justify-start">
				<!-- ? Exercise Title -->
				<div>
					{#if state.workout === workoutState.EDIT}
						<div class="w-full relative">
							<button
								on:click={() => {
									selectedExercise = exercise;

									state.exerciseTemplatesDrawer = exerciseTemplatesDrawerState.OPEN;
									invalidateAll();
								}}
								class="h6 input btn min-w-[200px] max-w-[325px] active:filter-none hover:filter-none h-10 mb-2 rounded-lg text-center"
							>
								<div
									class="w-full h-full break-all text-ellipsis overflow-hidden {exercise.exerciseTemplate
										? exercise.exerciseTemplate.title
											? ''
											: 'text-orange-400'
										: 'text-orange-400'}"
								>
									{exercise.exerciseTemplate
										? exercise.exerciseTemplate.title
											? exercise.exerciseTemplate.title
											: 'Select Exercise'
										: 'Select Exercise'}
								</div>
							</button>

							<!-- ? Exercise Options Popup Button -->
							<div
								use:popup={{
									...exerciseOptionsPopup,
									target: `exerciseOptionsPopup-${exerciseIndex}`
								}}
								class="btn-icon w-8 h-9 absolute right-[-35px] top-0"
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
										d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
									/>
								</svg>
							</div>

							<!-- ? Exercise Options Popup -->
							<div data-popup={`exerciseOptionsPopup-${exerciseIndex}`}>
								<div
									class=" card rounded-md align-center gap-3 justify-center flex flex-col py-2 px-5"
								>
									<div class=" text-center w-full">Options</div>
									<button
										on:click={() => {
											removeExercise(exerciseIndex, currentWorkout);
										}}
										class="variant-ghost-error w-28 h-8 btn m-0 p-0.5 text-center uppercase"
										>Delete</button
									>
								</div>
							</div>
						</div>
					{:else if state.workout === workoutState.VIEW}
						<div
							class="h6 mb-2 rounded-lg text-center {exercise.exerciseTemplate
								? exercise.exerciseTemplate.title
									? ''
									: 'text-red-400'
								: 'text-red-400'}"
						>
							{exercise.exerciseTemplate
								? exercise.exerciseTemplate.title
									? exercise.exerciseTemplate.title
									: 'ERROR'
								: 'ERROR'}
						</div>
					{/if}
				</div>

				<!-- ? Exercise Note -->
				<div class="w-full">
					{#if state.workout === workoutState.EDIT}
						<textarea
							bind:value={exercise.note}
							class="textarea active:filter-none hover:filter-none variant-filled-surface w-full rounded-lg p-1.5 text-center"
							rows="1"
							placeholder="SET X REPS @ LSRPE | REST"
						/>
					{:else if state.workout === workoutState.VIEW}
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
					<div
						class="mb-1.5 grid w-full grid-cols-[80px_repeat(2,1fr)_48px] content-center justify-items-center text-center"
					>
						<div>Set</div>
						<div>Weight</div>
						<div>Reps</div>
					</div>

					<!-- ? Sets Rows -->
					{#each exercise.sets as set, setIndex}
						<!-- ? Set container -->
						<div
							class="grid w-full grid-cols-[80px_repeat(2,1fr)_48px] content-center justify-items-center text-center"
						>
							<!-- ? Set Options Column -->
							{#if state.workout === workoutState.EDIT}
								<div
									use:popup={{
										...setTypePopup,
										target: `setTypePopup-${exerciseIndex}-${setIndex}`
									}}
									class="cursor-pointer btn-icon {set.type === 'W'
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
									class="rounded-lg card p-4 z-[888]"
								>
									<ul class="list flex flex-col gap-3 font-semibold tracking-wider">
										<li class="flex flex-col xs:flex-row align-center justify-center">
											<div class="w-14 text-sm text-center">Type</div>

											<button
												on:click={() => {
													set.type = SetType.N;
													updateSetsOrderNumber(exercise.sets);
													forceRefresh();
												}}
												class=" variant-soft-secondary !m-1 btn btn-sm text-center uppercase w-22 h-7"
												>Normal</button
											>

											<button
												on:click={() => {
													set.type = SetType.W;
													updateSetsOrderNumber(exercise.sets);
													forceRefresh();
												}}
												class="variant-soft-warning btn !m-1 btn-sm text-center uppercase w-22 h-7"
												>Warmup</button
											>

											<button
												on:click={() => {
													set.type = SetType.D;
													updateSetsOrderNumber(exercise.sets);
													forceRefresh();
												}}
												class="variant-soft-error btn !m-1 btn-sm text-center uppercase w-22 h-7"
												>DropSet</button
											>
										</li>
										<li class="flex flex-row mr-auto">
											<div class="w-14 text-sm text-start">Options</div>
											<button
												on:click={() => {
													removeSet(setIndex, exercise);
												}}
												class="variant-ghost-error w-28 h-8 btn m-0 p-0.5 text-center uppercase"
												>Delete Set</button
											>
										</li>
										<li />
									</ul>
								</div>
							{:else if state.workout === workoutState.VIEW}
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
								{#if state.workout === workoutState.EDIT}
									<input
										bind:value={set.weight}
										type="text"
										class="input active:filter-none hover:filter-none my-auto h-[80%] w-[80%] rounded-2xl text-center"
									/>
								{:else if state.workout === workoutState.VIEW}
									<div
										class="input m-auto flex h-[80%] w-[80%] items-center justify-center rounded-2xl"
									>
										{set.weight ? set.weight : 0}
									</div>
								{/if}
							</div>

							<!-- ? Set Reps Column -->
							<div class="w-full">
								{#if state.workout === workoutState.EDIT}
									<input
										bind:value={set.reps}
										type="text"
										name="setReps"
										class="input active:filter-none hover:filter-none my-auto h-[80%] w-[80%] rounded-2xl text-center"
									/>
								{:else if state.workout === workoutState.VIEW}
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
					{#if state.workout === workoutState.EDIT}
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
	{:else if state.workout === workoutState.ACTIVE && activeWorkout}
		{#each activeWorkout.exercises as exercise, exerciseIndex}
			<!-- ? Exercise + Accordion container -->
			<div class="w-full relative">
				<!-- ? Exercise container -->
				<div class="flex w-full flex-col items-center justify-start">
					<!-- ? Exercise Title -->
					<div>
						<div class="w-full relative">
							<button
								on:click={() => {
									selectedExercise = exercise;

									state.exerciseTemplatesDrawer = exerciseTemplatesDrawerState.OPEN;
									invalidateAll();
								}}
								class="h6 input btn min-w-[200px] max-w-[325px] active:filter-none hover:filter-none h-10 mb-2 rounded-lg text-center"
							>
								<div
									class="w-full h-full break-all text-ellipsis overflow-hidden {exercise.exerciseTemplate
										? exercise.exerciseTemplate.title
											? ''
											: 'text-orange-400'
										: 'text-orange-400'}"
								>
									{exercise.exerciseTemplate
										? exercise.exerciseTemplate.title
											? exercise.exerciseTemplate.title
											: 'Select Exercise'
										: 'Select Exercise'}
								</div>
							</button>

							<!-- ? Exercise Options Popup Button -->
							<div
								use:popup={{
									...exerciseOptionsPopup,
									target: `exerciseOptionsPopup-${exerciseIndex}`
								}}
								class="btn-icon w-8 h-9 absolute right-[-35px] top-0"
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
										d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
									/>
								</svg>
							</div>

							<!-- ? Exercise Options Popup -->
							<div data-popup={`exerciseOptionsPopup-${exerciseIndex}`}>
								<div
									class=" card rounded-md align-center gap-3 justify-center flex flex-col py-2 px-5"
								>
									<div class=" text-center w-full">Options</div>
									<button
										on:click={() => {
											if (activeWorkout) removeExercise(exerciseIndex, activeWorkout);
										}}
										class="variant-ghost-error w-28 h-8 btn m-0 p-0.5 text-center uppercase"
										>Delete</button
									>
								</div>
							</div>
						</div>
					</div>

					<!-- ? Exercise Note -->
					<div class="w-full">
						<textarea
							bind:value={exercise.note}
							class="textarea active:filter-none hover:filter-none variant-filled-surface w-full rounded-lg p-1.5 text-center"
							rows="1"
							placeholder="SET X REPS @ LSRPE | REST"
						/>
					</div>

					<!-- ? Sets container -->
					<div class="flex flex-col w-full items-center">
						<!-- ? Sets Header -->
						<div
							class="mb-1.5 grid w-full grid-cols-[80px_repeat(2,1fr)_48px] content-center justify-items-center text-center"
						>
							<div>Set</div>
							<div>Weight</div>
							<div>Reps</div>
						</div>

						<!-- ? Sets Rows -->
						{#each exercise.sets as set, setIndex}
							<!-- ? Set container -->
							<div
								class="grid w-full grid-cols-[80px_repeat(2,1fr)_48px] content-center justify-items-center text-center"
							>
								<!-- ? Set Options Column -->

								<div
									use:popup={{
										...setTypePopup,
										target: `setTypePopup-${exerciseIndex}-${setIndex}`
									}}
									class="cursor-pointer btn-icon {set.type === 'W'
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
									class="rounded-lg card p-4 z-[888]"
								>
									<ul class="list flex flex-col gap-3 font-semibold tracking-wider">
										<li class="flex flex-col xs:flex-row align-center justify-center">
											<div class="w-14 text-sm text-center">Type</div>

											<button
												on:click={() => {
													set.type = SetType.N;
													updateSetsOrderNumber(exercise.sets);
													forceRefresh();
												}}
												class=" variant-soft-secondary !m-1 btn btn-sm text-center uppercase w-22 h-7"
												>Normal</button
											>

											<button
												on:click={() => {
													set.type = SetType.W;
													updateSetsOrderNumber(exercise.sets);
													forceRefresh();
												}}
												class="variant-soft-warning btn !m-1 btn-sm text-center uppercase w-22 h-7"
												>Warmup</button
											>

											<button
												on:click={() => {
													set.type = SetType.D;
													updateSetsOrderNumber(exercise.sets);
													forceRefresh();
												}}
												class="variant-soft-error btn !m-1 btn-sm text-center uppercase w-22 h-7"
												>DropSet</button
											>
										</li>
										<li class="flex flex-row mr-auto">
											<div class="w-14 text-sm text-start">Options</div>
											<button
												on:click={() => {
													removeSet(setIndex, exercise);
												}}
												class="variant-ghost-error w-28 h-8 btn m-0 p-0.5 text-center uppercase"
												>Delete Set</button
											>
										</li>
										<li />
									</ul>
								</div>

								<!-- ? Set Weight Column -->
								<div class="w-full">
									<input
										bind:value={set.weight}
										type="text"
										class="input active:filter-none hover:filter-none my-auto h-[80%] w-[80%] rounded-2xl text-center"
									/>
								</div>

								<!-- ? Set Reps Column -->
								<div class="w-full">
									<input
										bind:value={set.reps}
										type="text"
										name="setReps"
										class="input active:filter-none hover:filter-none my-auto h-[80%] w-[80%] rounded-2xl text-center"
									/>
								</div>
							</div>
						{/each}

						<!-- ? Add Set Button -->

						<button
							on:click={() => {
								addSet(exercise);
							}}
							type="button"
							class="variant-ghost-primary btn mx-6 my-3 h-8 rounded-lg uppercase tracking-wide"
							>add set</button
						>
					</div>
				</div>
				<!-- ? Exercise History Accordion -->
				<ExerciseHistoryAccordion exerciseTemplateId={exercise.exerciseTemplate.id} />
			</div>
		{/each}
	{/if}

	<!-- ? Add Exercise Button -->
	{#if state.workout === workoutState.EDIT || state.workout === workoutState.ACTIVE}
		<button
			on:click={() => {
				if (state.workout === workoutState.EDIT) {
					addExercise(currentWorkout);
				} else if (state.workout === workoutState.ACTIVE) {
					if (activeWorkout) addExercise(activeWorkout);
				}
			}}
			type="button"
			class="variant-ghost-primary btn mx-6 h-8 rounded-lg uppercase tracking-wide"
			>add exercise</button
		>
	{/if}

	<!-- ? Create/Update Workout Template Button -->
	{#if state.workout === workoutState.EDIT}
		<button
			on:click={() => {
				if (currentWorkout.id === null) {
					createWorkout(currentWorkout);
				} else {
					updateWorkout(currentWorkout);
				}
			}}
			class="btn variant-filled-tertiary mx-6 h-8 rounded-lg font-semibold uppercase tracking-wide"
			>save workout template</button
		>

		<!-- ? Start Workout Template -->
	{:else if state.workout === workoutState.VIEW}
		<button
			on:click={() => {
				activeWorkout = { ...currentWorkout, type: WorkoutType.ENTRY };

				state.workout = workoutState.ACTIVE;
				invalidateAll();
			}}
			class="btn variant-filled-secondary mx-6 h-12 rounded-lg font-semibold uppercase tracking-wide"
			>Start New Workout</button
		>
	{:else if state.workout === workoutState.ACTIVE}
		<div class="flex flex-row mt-8 justify-between h-30 w-52">
			<div>
				<button
					on:click={() => {
						if (activeWorkout) createWorkout(activeWorkout);
					}}
					class="btn variant-filled-secondary w-24 h-15 rounded-lg font-semibold uppercase tracking-wide"
					>Log
				</button>
			</div>
			<div>
				<button
					on:click={() => {
						activeWorkout = null;
						state.training = trainingState.VIEW_ALL;

						invalidateAll();
					}}
					class="btn variant-ghost-error w-24 h-15 rounded-lg font-semibold uppercase tracking-wide"
					>Cancel
				</button>
			</div>
		</div>
	{/if}
</div>
