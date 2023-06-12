<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	const workout = $page.data.workout;

	const optionsPopup: PopupSettings = {
		event: 'click',
		target: 'optionsPopup',
		placement: 'bottom'
	};

	async function deleteWorkoutTemplate() {
		const response = await fetch(`/training/template/[id]`, {
			method: 'DELETE',
			body: JSON.stringify({ workoutId: workout.id }),
			headers: { 'content-type': 'application/json' }
		});

		const responseJSON = await response.json();

		if (responseJSON.success || responseJSON.notFound) {
			goto('/training');
		}
	}
</script>

<!-- ! Workout Template Component -->
<div class="card relative py-3">
	<button use:popup={optionsPopup} class="btn-icon absolute right-0 top-0 my-2 w-8"
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
				d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
			/>
		</svg></button
	>

	<!-- ? Options pop-up -->
	<div class="card z-[999] w-32 rounded-md" data-popup="optionsPopup">
		<ul class="">
			<li class="my-3 flex items-center justify-center">
				<a
					href="/training/template/{workout.id}/edit"
					class="btn variant-filled-secondary mx-2 w-full !rounded-lg">Edit</a
				>
			</li>
			<li class="my-3 flex items-center justify-center">
				<button
					on:click={deleteWorkoutTemplate}
					class="variant-filled-error btn mx-2 w-full !rounded-lg">Delete</button
				>
			</li>
		</ul>
	</div>

	<div class="my-4 flex w-full flex-col items-center justify-start gap-4">
		<!-- ! Workout Title -->
		<h4 class="h4 rounded-lg text-center">{workout.title}</h4>

		<!-- ! Workout Note -->

		<div
			class=" textarea h-16 w-[90%] overflow-hidden overflow-y-scroll break-words rounded-lg p-2"
		>
			{workout.note}
		</div>

		<!-- ! Exercise -->
		{#each workout.exercises as exercise, exerciseIndex}
			<div class="flex w-full flex-col items-center justify-start">
				<!-- ! Exercise Title -->
				<h6 class="h6 mb-2 rounded-lg text-center">{exercise.title}</h6>

				<!-- ! Exercise Note -->
				<div
					class=" textarea line mb-6 h-8 w-full overflow-hidden break-words rounded-lg p-2 text-center leading-4"
				>
					{exercise.note}
				</div>

				<!-- ! Sets -->
				<div class="flex w-full flex-col items-center">
					<!-- ! Set Header -->
					<div
						class="mb-1.5 grid w-full grid-cols-3 content-center justify-items-center text-center"
					>
						<div>Set</div>
						<div>Weight</div>
						<div>Reps</div>
					</div>

					<!-- ! Set Rows -->
					{#each exercise.sets as set}
						<div class="grid w-full grid-cols-3 content-center justify-items-center text-center">
							<!-- ! Set Order Number -->

							<div
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

							<div
								class="input my-auto flex h-[80%] w-[80%] items-center justify-center rounded-2xl"
							>
								{set.weight}
							</div>

							<div
								class="input my-auto flex h-[80%] w-[80%] items-center justify-center rounded-2xl"
							>
								{set.reps}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<button
			class="btn variant-filled-primary mx-6 h-12 rounded-lg font-semibold uppercase tracking-wide"
			>Start Workout</button
		>
	</div>
</div>
