<script lang="ts">
	import { getExerciseHistoryRequest } from '$lib/services/exerciseService';
	import { formatDate } from '$lib/utils';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import ExerciseHistoryTable from './ExerciseHistoryTable.svelte';

	export let exerciseTemplateId: string | null;
	let expanded = false;
	let exerciseHistory: any | null = null;
	let historyTab: number = 0;
	let spinner: boolean = false;

	async function getExerciseHistory() {
		if (exerciseTemplateId) {
			const response = await getExerciseHistoryRequest(exerciseTemplateId);

			if (response.success) {
				exerciseHistory = response.exerciseHistory;
				if (exerciseHistory.length > 0) spinner = false;
			} else {
				console.log('Something went wrong fetching exercise history');
			}
		}
	}
</script>

<div class="px-4 py-2">
	<button
		on:click={() => {
			if (!exerciseHistory) {
				spinner = true;
				getExerciseHistory();
			}
			expanded = !expanded;
		}}
		disabled={spinner}
		class="btn bg-surface-100-800-token w-full h-8 rounded-b-lg"
	>
		<svg
			class="h-8"
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
				d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
			/>
		</svg>
	</button>

	{#if exerciseHistory && exerciseHistory.length}
		<div class="bg-surface-200-700-token rounded-lg" hidden={!expanded}>
			<div class="py-2">
				<!-- ? Header -->
				<div class="flex flex-row w-full justify-between align-center">
					<button
						on:click={() => {
							if (historyTab > 0) {
								--historyTab;
							}
						}}
						class="btn-icon w-8"
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
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>

					<div class="my-auto font-semibold">{exerciseHistory[historyTab].workout.title}</div>

					<button
						on:click={() => {
							if (historyTab < exerciseHistory.length - 1) {
								++historyTab;
							}
						}}
						class="btn-icon w-8"
					>
						<svg
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
						</svg>
					</button>
				</div>

				<div class="text-center">{formatDate(exerciseHistory[historyTab].workout.createdAt)}</div>

				<!-- ? Sets Table -->
				<ExerciseHistoryTable sets={exerciseHistory[historyTab].sets} />

				<div>
					<ProgressBar label="Progress Bar" value={historyTab + 1} max={exerciseHistory.length} />
					<div class="text-center">
						{historyTab + 1} of {exerciseHistory.length}
					</div>
				</div>

				<div class="text-left mx-4 p-2">
					{#if exerciseHistory[historyTab].note}
						<span class="font-semibold">Notes: </span>
					{/if}
					{exerciseHistory[historyTab].note}
				</div>
			</div>
		</div>
	{/if}
</div>
