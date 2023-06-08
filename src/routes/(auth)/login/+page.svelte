<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<div class="container mx-auto mb-20 flex h-full flex-col items-center justify-start">
	<h2 class="h2 my-10">Login</h2>

	<form action="?/login" method="POST" class="flex flex-col gap-3" use:enhance>
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

		{#if form?.credentials}
			<p class="text-error-400">You have entered the wrong credentials.</p>
		{/if}

		<button type="submit" class="btn variant-filled-primary my-6 rounded-full">Sign in</button>

		<div class="mx-auto">
			Not a memeber yet? <a class="variant-ghost-primary btn-sm ml-2" href="/register">Sign up</a>
		</div>
	</form>
</div>
