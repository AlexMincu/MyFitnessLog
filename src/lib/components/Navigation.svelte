<script lang="ts">
	import { page } from '$app/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';

	function closeDrawer() {
		drawerStore.close();
	}
</script>

{#if $page.data.user}
	<nav class="">
		<ul class="md:flex md:flex-row">
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/dashboard" on:click={closeDrawer}> <span>Dashboard</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/training" on:click={closeDrawer}> <span>Training</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/" on:click={closeDrawer}> <span>Habits</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/" on:click={closeDrawer}> <span>Measurements</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/" on:click={closeDrawer}> <span>Statistics</span> </a>
			</li>
		</ul>
	</nav>
{/if}
