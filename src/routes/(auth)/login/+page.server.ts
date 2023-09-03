import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Actions } from './$types';

import { db } from '$lib/database';

import { loginSchema } from '$lib/validationSchemas';
import { Role } from '@prisma/client';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const email = String(formData.email);

		// Validation
		try {
			loginSchema.parse(formData);
		} catch (err) {
			const { fieldErrors: errors } = err.flatten();
			return fail(400, { data: { email: email }, validationErrors: errors });
		}

		// user doesn't exist
		const user = await db.user.findUnique({ where: { email } });
		if (!user) {
			return fail(400, { data: { email: email }, credentials: true });
		}

		// incorrect password
		const userPassword = await bcrypt.compare(String(formData.password), user.passwordHash);
		if (!userPassword) {
			return fail(400, { data: { email: email }, credentials: true });
		}

		// generate new auth token each time
		const authenticatedUser = await db.user.update({
			where: { email: user.email },
			data: { userAuthToken: crypto.randomUUID() }
		});

		cookies.set('session', authenticatedUser.userAuthToken, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(302, '/training');
	},

	guest: async ({ cookies }) => {
		const range_min = 10000;
		const range_max = 99999;
		let random = '';
		let user;

		// Create unique guest user
		do {
			random = String(Math.floor(Math.random() * (range_max + 1 - range_min)) + range_min);
			user = await db.user.findUnique({ where: { email: `guest${random}@example.com` } });
		} while (user);

		user = await db.user.create({
			data: {
				firstName: 'guest',
				lastName: random,
				email: `guest${random}@example.com`,
				passwordHash: await bcrypt.hash(`guest${random}`, 10),
				userAuthToken: crypto.randomUUID(),
				role: Role.USER
			}
		});

		// generate new auth token each time
		const authenticatedUser = await db.user.update({
			where: { email: user.email },
			data: { userAuthToken: crypto.randomUUID() }
		});

		cookies.set('session', authenticatedUser.userAuthToken, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		});

		cookies.set('newGuest', 'true', {
			path: '/'
		});

		if (authenticatedUser) {
			throw redirect(302, '/training');
		} else {
			console.log('Guest Account: Couldn`t create session cookie');
		}
	}
};
