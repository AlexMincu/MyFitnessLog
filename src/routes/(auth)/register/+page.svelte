<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="container mx-auto mb-20 flex h-full flex-col items-center justify-start">
	<h2 class="h2 my-10">Register</h2>

	<form action="?/register" method="POST" class="flex flex-col gap-3" use:enhance>
		<label class="label">
			<span>First Name</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="firstName"
				title="first-name"
				type="text"
				placeholder="First Name"
			/>
		</label>

		<label class="label">
			<span>Last Name</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="lastName"
				title="last-name"
				type="text"
				placeholder="Last Name"
			/>
		</label>

		<label class="label">
			<span>Email</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="email"
				title="email"
				type="email"
				placeholder="Email"
				autocomplete="email"
			/>
		</label>

		{#if form?.invalid}
			<p class="text-error-400">Username is taken.</p>
		{/if}

		<label class="label">
			<span>Password</span>
			<input
				name="password"
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				title="password"
				type="password"
				placeholder="Password"
			/>
		</label>

		<label class="label">
			<span>Confirm Password</span>
			<input
				name="confirmPassword"
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				title="confirm-password"
				type="password"
				placeholder="Confirm Password"
			/>
		</label>

		<button type="submit" class="btn variant-filled-primary my-6 rounded-full">Sign up</button>

		<div class="mx-auto">
			Have an account? <a class="variant-ghost-primary btn-sm ml-2" href="/login">Sign in</a>
		</div>
	</form>
</div>
