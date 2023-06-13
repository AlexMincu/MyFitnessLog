<script lang="ts">
	import Workout from '$lib/components/Workout.svelte';

	const workout = {
		id: null,
		title: '',
		type: 'TEMPLATE',
		favorite: false,
		note: '',
		exercises: []
	};
</script>

<Workout state="EDIT" {workout} />
