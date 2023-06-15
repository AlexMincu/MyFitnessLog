<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	import {
		exerciseTemplatesDrawerState,
		exerciseTemplateState,
		trainingState
	} from '$lib/customTypes';
	import type { Exercise, ExerciseTemplate, State } from '$lib/customTypes';
	import type { exerciseTemplate } from '@prisma/client';

	import {
		createExerciseTemplateRequest,
		deleteExerciseTemplateRequest,
		updateExerciseTemplateRequest
	} from '$lib/services/exerciseTemplateService';

	// ******************* Variables *******************

	export let exerciseTemplates: exerciseTemplate[];

	export let state: State;
	export let selectedExercise: Exercise;

	export let forceRefresh: Function;

	let currentExerciseTemplate: ExerciseTemplate = {
		id: null,
		title: '',
		description: '',
		userId: null
	};

	// ******************* Enable Inputs Utility *******************
	let enableInputs: boolean;

	// if userId = null => update standalone exercise => enableInputs false
	// if id = null => create exercise => enableInputs = true
	$: if (currentExerciseTemplate.userId) {
		enableInputs = false;
	} else {
		if (currentExerciseTemplate.id) enableInputs = true;
		else enableInputs = false;
	}

	// ******************* API Calls *******************

	async function saveExerciseTemplate() {
		// Create new exercise template
		if (currentExerciseTemplate.id === null) {
			const response = await createExerciseTemplateRequest(currentExerciseTemplate);

			if (response.success) {
				console.log('ExerciseTemplates: Created exercise template successfully');

				state = { ...state, exerciseTemplate: exerciseTemplateState.VIEW };
				invalidateAll();
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
			const response = await updateExerciseTemplateRequest(currentExerciseTemplate);

			if (response.success) {
				console.log('ExerciseTemplates: Updated exercise template successfully');

				state = { ...state, exerciseTemplate: exerciseTemplateState.VIEW };
				invalidateAll();
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
		if (currentExerciseTemplate.id) {
			const response = await deleteExerciseTemplateRequest(currentExerciseTemplate.id);

			if (response.success) {
				console.log(`ExerciseTemplates: Deleted exercise successfully!`);

				state = { ...state, exerciseTemplate: exerciseTemplateState.VIEW };
				invalidateAll();
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
				if (state.exerciseTemplate === exerciseTemplateState.EDIT) {
					state = { ...state, exerciseTemplate: exerciseTemplateState.VIEW };
					invalidateAll();
				} else {
					state = { ...state, exerciseTemplatesDrawer: exerciseTemplatesDrawerState.CLOSE };
					invalidateAll();
				}
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

		{#if state.exerciseTemplate === exerciseTemplateState.VIEW}
			<h3 class="h3 text-center">Exercises</h3>
		{/if}
	</div>

	<!-- ? Content -->
	<div class="flex flex-col">
		{#if state.exerciseTemplate === exerciseTemplateState.VIEW}
			<!-- ? Create Exercise Template Button -->
			<button
				on:click={() => {
					state = { ...state, exerciseTemplate: exerciseTemplateState.EDIT };
					invalidateAll();

					currentExerciseTemplate = {
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
							currentExerciseTemplate = {
								id: exercise.id,
								title: exercise.title,
								description: exercise.description ? exercise.description : '',
								userId: exercise.userId
							};

							if (state.training === trainingState.VIEW_ALL) {
								state = { ...state, exerciseTemplate: exerciseTemplateState.EDIT };
								invalidateAll();
							} else {
								selectedExercise.exerciseTemplate = currentExerciseTemplate;

								state = { ...state, exerciseTemplatesDrawer: exerciseTemplatesDrawerState.CLOSE };
								invalidateAll();
								forceRefresh();
							}
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
		{:else if state.exerciseTemplate === exerciseTemplateState.EDIT}
			<div class="card w-full max-w-md rounded-lg py-10 px-6 flex flex-col text-center">
				<div class="w-full">
					<input
						bind:value={currentExerciseTemplate.title}
						class="h6 font-bold input h-9 mb-2 rounded-lg text-center variant-filled-surface"
						type="text"
						disabled={enableInputs}
						placeholder="Exercise Title"
					/>
				</div>
				<div>
					<textarea
						bind:value={currentExerciseTemplate.description}
						class="py-2 px-3 textarea break-all variant-filled-surface w-full rounded-lg text-start"
						disabled={enableInputs}
						rows={Math.ceil(currentExerciseTemplate.description.length / 30)}
						placeholder="Description."
					/>
				</div>

				{#if currentExerciseTemplate.userId || currentExerciseTemplate.id === null}
					<!-- ? Save Button -->
					<button
						on:click={saveExerciseTemplate}
						class="variant-ghost-primary btn btn-sm mx-auto my-2 rounded-lg py-2 font-semibold uppercase tracking-wide"
						>save</button
					>
					{#if currentExerciseTemplate.id !== null}
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
