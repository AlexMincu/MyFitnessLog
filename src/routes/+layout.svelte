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
		storePopup,
		LightSwitch
	} from '@skeletonlabs/skeleton';
	import type { PopupSettings, DrawerSettings } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import Navigation from '../components/navigation.svelte';
	import { page } from '$app/stores';

	const accountPopup: PopupSettings = {
		event: 'click',
		target: 'accountPopup',
		placement: 'bottom',
		closeQuery: '.account-list-item',
		middleware: {
			shift: {
				// https://floating-ui.com/docs/detectoverflow#padding
				// detect overflow - fixes placement on mobile
				padding: {
					right: 20 // 0 by default
				}
			}
		}
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
	<h3 class="h3 mb-4 mt-8 w-auto text-center">Menu</h3>
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
					class="text-variant-primary-50 hover:text-variant-primary-200 text-2xl font-semibold tracking-tighter"
					href="/">MyFitnessLog</a
				>
			</svelte:fragment>

			<!-- Default fragment -->
			<div class="hidden md:block">
				<Navigation />
			</div>

			<!-- Trail fragment -->
			<svelte:fragment slot="trail">
				{#if $page.data.user}
					<button class="btn-icon m-3 w-14" use:popup={accountPopup}>
						<Avatar
							class="w-14"
							cursor="cursor-pointer"
							initials={$page.data.user.firstName[0] + $page.data.user.lastName[0]}
							background="variant-glass-primary"
						/>
					</button>

					<div class="card w-32 py-2 shadow-xl" data-popup="accountPopup">
						<ul class="list-nav">
							<li class="my-3 flex items-center justify-center">
								<LightSwitch rounded="rounded-lg" />
							</li>

							<li class="account-list-item">
								<a class="btn btn-sm" href="/"> Account </a>
							</li>
							<li class="account-list-item">
								<a class="btn btn-sm" href="/"> Settings </a>
							</li>

							<li class="account-list-item">
								<form action="/logout" method="POST">
									<button type="submit" class="btn btn-sm w-full"> Log out </button>
								</form>
							</li>
						</ul>
					</div>
				{:else}
					<div class="flex h-14 items-center justify-center gap-6">
						<LightSwitch rounded="rounded-lg" />
						<a href="/login" class="variant-ghost-primary btn h-10 rounded-lg">Sign in</a>
					</div>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
