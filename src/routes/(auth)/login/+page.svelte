<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	export let form: ActionData;

	let loading = false;
</script>

<div class="container mx-auto mb-20 flex h-full flex-col items-center justify-start">
	<h2 class="h2 my-10">Login</h2>

	<form action="?/login" method="POST" class="flex w-[80%] flex-col gap-3 sm:w-96" use:enhance>
		<label class="label">
			<span>Email</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="email"
				type="email"
				autocomplete="email"
				value={form?.data?.email ?? ''}
			/>
		</label>

		<label class="label">
			<span>Password</span>
			<input
				name="password"
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				type="password"
			/>
		</label>

		{#if form?.validationErrors}
			{#if form?.validationErrors.email}
				<p class="text-error-500">{form?.validationErrors.email[0]}</p>
			{:else if form?.validationErrors.password}
				<p class="text-error-500">{form?.validationErrors.password[0]}</p>
			{/if}
		{:else if form?.credentials}
			<p class="text-error-500">You have entered the wrong credentials.</p>
		{/if}

		<button formaction="?/login" class="btn variant-filled-primary my-6 rounded-full"
			>Sign in</button
		>

		<div class="mx-auto">
			Not a member yet? <a class="variant-ghost-primary btn-sm ml-2" href="/register">Sign up</a>
		</div>

		<div class="mx-auto">
			Try the app as guest! <button
				formaction="?/guest"
				on:click={() => {
					loading = !loading;
				}}
				disabled={loading}
				class="variant-ghost-secondary btn-sm ml-2">Guest Mode</button
			>
		</div>
	</form>

	{#if loading}
		<div
			transition:fade={{ duration: 500 }}
			class="flex justify-center items-center w-64 h-64 rounded-md border-surface-300-600-token border shadow-lg absolute top-[50%] left-[50%] bg-surface-100-800-token -translate-x-[50%] -translate-y-[50%]"
		>
			<ProgressRadial
				value={undefined}
				stroke={75}
				width="w-52"
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
			/>

			<div
				class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center font-semibold text-lg"
			>
				Creating Guest Account...
			</div>
		</div>
	{/if}
</div>
