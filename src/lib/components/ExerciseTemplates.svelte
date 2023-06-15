<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { exerciseTemplatesStateType, type ExerciseTemplate } from '$lib/customTypes';
	import {
		createExerciseTemplateRequest,
		deleteExerciseTemplateRequest,
		updateExerciseTemplateRequest
	} from '$lib/services/exerciseTemplateService';
	import type { exerciseTemplate } from '@prisma/client';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let exerciseTemplates: exerciseTemplate[];
	export let setExerciseTemplatesState: Function;

	enum State {
		VIEW,
		EDIT
	}
	let state: State = State.VIEW;

	let currentExercise: ExerciseTemplate = {
		id: null,
		title: '',
		description: '',
		userId: null
	};

	let enableInputs: boolean;

	// if userId = null => update standalone exercise => enableInputs false
	// if id = null => create exercise => enableInputs = true
	$: if (currentExercise.userId) {
		enableInputs = false;
	} else {
		if (currentExercise.id) enableInputs = true;
		else enableInputs = false;
	}

	function setState(newState: State) {
		state = newState;

		// Update UI
		invalidateAll();
	}

	async function saveExerciseTemplate() {
		// Create new exercise template
		if (currentExercise.id === null) {
			const response = await createExerciseTemplateRequest(currentExercise);

			if (response.success) {
				console.log('ExerciseTemplates: Created exercise template successfully');

				setState(State.VIEW);
			} else if (response.validationErrors) {
				triggerValidationErrorToasts(response.validationErrors);

				console.log(
					"ExerciseTemplates: Couldn't create exercise template. Validation Errors: ",
					response.validationErrors
				);
			} else {
				console.log(
					"ExerciseTemplates: Something went wrong, couldn't create exercise. Error: ",
					response
				);
			}
		}

		// Update existing exercise template
		else {
			const response = await updateExerciseTemplateRequest(currentExercise);

			if (response.success) {
				console.log('ExerciseTemplates: Updated exercise template successfully');

				setState(State.VIEW);
			} else if (response.validationErrors) {
				triggerValidationErrorToasts(response.validationErrors);

				console.log(
					"ExerciseTemplates: Couldn't update exercise template. Validation Errors: ",
					response.validationErrors
				);
			} else {
				console.log(
					"ExerciseTemplates: Something went wrong, couldn't update exercise. Error: ",
					response
				);
			}
		}
	}

	async function deleteExerciseTemplate() {
		if (currentExercise.id) {
			const response = await deleteExerciseTemplateRequest(currentExercise.id);

			if (response.success) {
				console.log(`ExerciseTemplates: Deleted exercise successfully!`);

				setState(State.VIEW);
			} else {
				console.log(
					`ExerciseTemplates: Something went wrong, couldn't delete exercise. Response: `,
					response
				);
			}
		}
	}

	// ******************* Toasts *******************
	const validationErrorToastSetting: ToastSettings = {
		message: '',
		background: 'variant-filled-error',
		timeout: 2500
	};

	function triggerValidationErrorToasts(validationErrors: { exerciseTemplateTitle: any[] }) {
		if (validationErrors.exerciseTemplateTitle) {
			toastStore.trigger({
				...validationErrorToastSetting,
				message: `${validationErrors.exerciseTemplateTitle[0]}`
			});
		}
	}
</script>

<div class="w-[90%] h-fit py-8 mx-auto">
	<!-- ? Header -->
	<div class="h-10 w-full relative">
		<button
			on:click={() => {
				if (state === State.EDIT) setState(State.VIEW);
				else setExerciseTemplatesState(exerciseTemplatesStateType.CLOSE);
			}}
			class="btn-icon absolute left-0 top-[-20px] w-10 h-10"
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
					d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
				/>
			</svg></button
		>

		{#if state === State.VIEW}
			<h3 class="h3 text-center">Exercises</h3>
		{/if}
	</div>

	<!-- ? Content -->
	<div class="flex flex-col">
		{#if state === State.VIEW}
			<!-- ? Create Exercise Template Button -->
			<button
				on:click={() => {
					setState(State.EDIT);
					currentExercise = {
						id: null,
						title: '',
						description: '',
						userId: null
					};
				}}
				class="variant-ghost-primary btn btn-sm w-60 mx-auto my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
				>create exercise template</button
			>

			<!-- ? Exercise Cards Container -->
			<div class="flex flex-col w-full h-full items-center justify-start py-3 gap-3">
				{#each exerciseTemplates as exercise}
					<button
						on:click={() => {
							setState(State.EDIT);
							currentExercise = {
								id: exercise.id,
								title: exercise.title,
								description: exercise.description ? exercise.description : '',
								userId: exercise.userId
							};
						}}
						class="card card-hover w-full max-w-md h-auto rounded-lg py-3 px-6 flex flex-col text-center"
					>
						<div class="w-full font-bold text-surface-800-100-token">{exercise.title}</div>

						{#if exercise.description}
							<div class="w-full h-auto break-all">{exercise.description}</div>
						{/if}
					</button>
				{/each}
			</div>
		{:else if state === State.EDIT}
			<div class="card w-full max-w-md rounded-lg py-10 px-6 flex flex-col text-center">
				<div class="w-full">
					<input
						bind:value={currentExercise.title}
						class="h6 font-bold input h-9 mb-2 rounded-lg text-center variant-filled-surface"
						type="text"
						disabled={enableInputs}
						placeholder="Exercise Title"
					/>
				</div>
				<div>
					<textarea
						bind:value={currentExercise.description}
						class="py-2 px-3 textarea break-all variant-filled-surface w-full rounded-lg text-start"
						disabled={enableInputs}
						rows={Math.ceil(currentExercise.description.length / 30)}
						placeholder="Description."
					/>
				</div>

				{#if currentExercise.userId || currentExercise.id === null}
					<!-- ? Save Button -->
					<button
						on:click={saveExerciseTemplate}
						class="variant-ghost-primary btn btn-sm mx-auto my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
						>save</button
					>
					{#if currentExercise.id !== null}
						<!-- ? Delete Button -->
						<button
							on:click={deleteExerciseTemplate}
							class="variant-ghost-error btn btn-sm mx-auto my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
							>delete</button
						>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</div>
