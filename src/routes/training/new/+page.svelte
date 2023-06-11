<script lang="ts">
	import { goto } from '$app/navigation';

	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	import type { Workout, Exercise, Set } from '$lib/services/customTypes';
	import { SetType } from '$lib/services/customTypes';

	let workout: Workout = {
		title: '',
		favorite: false,
		note: '',
		exercises: []
	};

	const setTypePopup: PopupSettings = {
		event: 'click',
		target: 'fakeTarget',
		placement: 'bottom'
	};

	let createError = '';

	async function createWorkoutTemplate() {
		const response = await fetch('/training/new', {
			method: 'POST',
			body: JSON.stringify(workout),
			headers: { 'content-type': 'application/json' }
		});

		const responseJSON = await response.json();

		console.log(workout);

		if (responseJSON.success) {
			goto('/training');
		} else {
			createError = responseJSON;
			// !
			console.log(createError);
		}
	}

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
</script>

<div class="container mx-auto h-full w-[95%]">
	<!-- ! Workout Template Component -->
	<div class="card my-6 rounded-lg py-3">
		<div class="my-4 flex w-full flex-col items-center justify-start gap-4">
			<!-- ! Workout Title -->
			<div>
				<label class="label flex flex-row">
					<input
						bind:value={workout.title}
						class="h4 input rounded-lg text-center"
						name="workoutTitle"
						type="text"
						placeholder="Workout Title"
					/>
				</label>
			</div>
			<!-- ! Workout Note -->
			<div class="w-[90%]">
				<textarea
					bind:value={workout.note}
					class="textarea rounded-lg"
					name="workoutNote"
					rows="2"
					placeholder="Workout notes."
				/>
			</div>

			<!-- ! Exercise -->
			{#each workout.exercises as exercise, exerciseIndex}
				<div class="flex w-full flex-col items-center justify-start">
					<!-- ! Exercise Title -->
					<div>
						<!-- TODO - Exercise database select popup/modal -->
						<label class="label flex flex-row">
							<input
								bind:value={exercise.title}
								class="h6 input mb-2 rounded-lg text-center"
								name="exerciseTitle"
								type="text"
								placeholder="Exercise"
							/>
						</label>
					</div>

					<!-- ! Exercise Note -->
					<div class="w-full">
						<textarea
							bind:value={exercise.note}
							class="textarea variant-filled-surface w-full rounded-lg p-1.5 text-center"
							name="exerciseNote"
							rows="1"
							placeholder="SET X REPS @ LSRPE | REST"
						/>
					</div>

					<!-- ! Sets -->
					<div class="flex flex-col items-center">
						<!-- ! Set Header -->
						<div
							class="mb-1.5 grid w-full grid-cols-3 content-center justify-items-center text-center"
						>
							<div>Set</div>
							<div>Weight</div>
							<div>Reps</div>
						</div>

						<!-- ! Set Rows -->
						{#each exercise.sets as set, setIndex}
							<div class="grid w-full grid-cols-3 content-center justify-items-center text-center">
								<!-- ! Set Order Number -->

								<button
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
								</button>

								<!-- ! Set Popup -->
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

								<input
									bind:value={set.weight}
									type="text"
									name="setWeight"
									class="input my-auto h-[80%] w-[80%] rounded-2xl text-center"
								/>
								<input
									bind:value={set.reps}
									type="text"
									name="setReps"
									class="input my-auto h-[80%] w-[80%] rounded-2xl text-center"
								/>
							</div>
						{/each}

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
			{/each}

			<button
				on:click={addExercise}
				type="button"
				class="variant-ghost-primary btn mx-6 h-8 rounded-lg uppercase tracking-wide"
				>add exercise</button
			>

			<button
				on:click={createWorkoutTemplate}
				type="submit"
				class="btn variant-filled-primary mx-6 h-8 rounded-lg uppercase tracking-wide"
				>save workout template</button
			>
		</div>
	</div>
</div>
