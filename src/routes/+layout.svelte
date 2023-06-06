<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Avatar,
		popup,
		Drawer,
		drawerStore,
		storePopup
	} from '@skeletonlabs/skeleton';
	import type { PopupSettings, DrawerSettings } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import Navigation from '../components/navigation.svelte';

	const accountPopup: PopupSettings = {
		event: 'focus-click',
		target: 'accountPopup',
		placement: 'bottom',
		closeQuery: '.account-list-item'
	};

	const drawerSettings: DrawerSettings = {
		id: 'drawer',
		width: 'w-[65%]'
	};

	function openDrawer() {
		drawerStore.open(drawerSettings);
	}
</script>

<!-- Mobile Drawer -->
<Drawer>
	<h3 class="h3 text-center w-auto mt-8 mb-4">Menu</h3>
	<hr class="!border-t-2" />
	<Navigation />
</Drawer>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar
			gridColumns="grid-cols-[auto_1fr_auto]"
			slotLead="place-content-start"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
			padding="py-0 px-1 md:px-4"
		>
			<!-- Lead fragment -->
			<svelte:fragment slot="lead">
				<button class="btn-icon md:hidden" on:click={openDrawer}>
					<svg
						class="w-10"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
						/>
					</svg>
				</button>
				<a
					class="text-2xl font-semibold tracking-tighter text-primary-50 hover:text-primary-200"
					href="/">MyFitnessLog</a
				>
			</svelte:fragment>

			<!-- Default fragment -->
			<div class="hidden md:block">
				<Navigation />
			</div>

			<!-- Trail fragment -->
			<svelte:fragment slot="trail">
				<button class="btn-icon w-14 m-3" use:popup={accountPopup}>
					<Avatar
						class="w-14"
						cursor="cursor-pointer"
						initials="AM"
						background="variant-glass-primary"
					/>
				</button>

				<div class="card w-32 shadow-xl py-2" data-popup="accountPopup">
					<ul class="list-nav">
						<li class="account-list-item">
							<a class="btn btn-sm" href="/"> Account </a>
						</li>
						<li class="account-list-item">
							<a class="btn btn-sm" href="/"> Settings </a>
						</li>
						<li class="account-list-item">
							<a class="btn btn-sm" href="/"> Logout </a>
						</li>
					</ul>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
