import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/database';

import { z } from 'zod';

const loginSchema = z.object({
	email: z.string().min(1).max(64).email(),
	password: z.string().min(6).max(32).trim()
});

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const email = String(formData.email);

		// Validation
		try {
			const result = loginSchema.parse(formData);
		} catch (err) {
			return fail(400, { data: { email: email }, credentials: true });
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

		throw redirect(302, '/dashboard');
	}
};
