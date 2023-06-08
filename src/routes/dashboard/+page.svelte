<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container mx-auto my-6 flex h-full flex-col items-center justify-start">
	<h2 class="h2">Dashboard</h2>
	<h3 class="h3">Welcome {$page.data.user.firstName} {$page.data.user.lastName}</h3>
</div>
