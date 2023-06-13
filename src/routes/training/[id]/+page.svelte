<script lang="ts">
	import { page } from '$app/stores';

	import Workout from '$lib/components/Workout.svelte';

	const workout = $page.data.workout;
</script>

<Workout state="VIEW" {workout} />
