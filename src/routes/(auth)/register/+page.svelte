<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="container mx-auto mb-20 flex h-full flex-col items-center justify-start">
	<h2 class="h2 my-10">Register</h2>

	<form action="?/register" method="POST" class="flex w-[80%] flex-col gap-3 sm:w-96" use:enhance>
		<label class="label">
			<span>First Name</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="firstName"
				type="text"
				value={form?.data?.firstName ?? ''}
			/>
			{#if form?.errors?.firstName}
				<span class="text-error-500"> {form?.errors?.firstName[0]} </span>
			{/if}
		</label>

		<label class="label">
			<span>Last Name</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="lastName"
				type="text"
				value={form?.data?.lastName ?? ''}
			/>
			{#if form?.errors?.lastName}
				<span class="text-error-500"> {form?.errors?.lastName[0]} </span>
			{/if}
		</label>

		<label class="label">
			<span>Email</span>
			<input
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				name="email"
				type="email"
				autocomplete="email"
				value={form?.data?.email ?? ''}
			/>
			{#if form?.errors?.email}
				<span class="text-error-500"> {form?.errors?.email[0]} </span>
			{/if}
		</label>

		<label class="label">
			<span>Password</span>
			<input
				name="password"
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				type="password"
			/>
			{#if form?.errors?.password}
				<span class="text-error-500"> {form?.errors?.password[0]} </span>
			{/if}
		</label>

		<label class="label">
			<span>Confirm Password</span>
			<input
				name="passwordConfirm"
				class="input rounded-lg shadow-sm focus:border-b-2 focus:border-primary-600-300-token"
				type="password"
			/>
			{#if form?.errors?.passwordConfirm}
				<span class="text-error-500"> {form?.errors?.passwordConfirm[0]} </span>
			{/if}
		</label>

		<button type="submit" class="btn variant-filled-primary my-6 rounded-full">Sign up</button>

		<div class="mx-auto">
			Have an account? <a class="variant-ghost-primary btn-sm ml-2" href="/login">Sign in</a>
		</div>
	</form>
</div>
