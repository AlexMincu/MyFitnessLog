<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	// import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	import '../theme.postcss';
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
		LightSwitch,
		Toast,
		Modal
	} from '@skeletonlabs/skeleton';
	import type { PopupSettings, DrawerSettings } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	import Navigation from '$lib/components/Navigation.svelte';
	import { page } from '$app/stores';

	const accountPopup: PopupSettings = {
		event: 'click',
		target: 'accountPopup',
		placement: 'bottom',
		closeQuery: '.account-list-item',
		middleware: {
			offset: 5
		}
	};

	const navigationDrawerSettings: DrawerSettings = {
		id: 'navigation',
		width: 'w-[65%]'
	};

	export function openDrawer() {
		drawerStore.open(navigationDrawerSettings);
	}

	export function closeDrawer() {
		drawerStore.close();
	}
</script>

<!-- ! Modal Component -->
<Modal />

<!-- ! Drawer Component -->
<Drawer class="z-[100]">
	{#if $drawerStore.id === 'navigation'}
		<h3 class="h3 mb-4 mt-8 w-auto text-center">Menu</h3>
		<hr class="!border-t-2" />
		<Navigation />
	{/if}
</Drawer>

<!-- ! Toast Component -->
<Toast max={5} />

<!-- ! App Shell -->
<AppShell regionPage="hide-scrollbar" slotHeader="z-50">
	<svelte:fragment slot="header">
		<!-- ! App Bar Component -->
		<AppBar
			gridColumns="grid-cols-[auto_1fr_auto]"
			slotLead="place-content-start"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
			padding="py-0 px-1 md:px-4"
		>
			<!-- Lead fragment -->
			<svelte:fragment slot="lead">
				{#if $page.data.user}
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
				{/if}

				<div class="flex h-16 items-center justify-center md:h-20">
					<a
						class="text-variant-primary-50 hover:text-variant-primary-200 text-2xl font-semibold tracking-tighter"
						href="/">MyFitnessLog</a
					>
				</div>
			</svelte:fragment>

			<!-- Default fragment -->
			<div class="hidden md:block">
				<Navigation />
			</div>

			<!-- Trail fragment -->
			<svelte:fragment slot="trail">
				{#if $page.data.user}
					<div class="mr-4 flex w-full">
						<button class="btn-icon my-auto w-14" use:popup={accountPopup}>
							<Avatar
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
