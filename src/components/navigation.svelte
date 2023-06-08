<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.data.user}
	<nav class="">
		<ul class="md:flex md:flex-row">
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/dashboard"> <span>Dashboard</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/"> <span>Training</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/"> <span>Habits</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/"> <span>Measurements</span> </a>
			</li>
			<li class="hover:variant-soft-primary">
				<a class="btn" href="/"> <span>Statistics</span> </a>
			</li>
		</ul>
	</nav>
{/if}
