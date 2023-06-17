<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
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

		<button type="submit" class="btn variant-filled-primary my-6 rounded-full">Sign in</button>

		<div class="mx-auto">
			Not a member yet? <a class="variant-ghost-primary btn-sm ml-2" href="/register">Sign up</a>
		</div>
	</form>
</div>
