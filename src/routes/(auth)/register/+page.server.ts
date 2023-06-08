import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import { z } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
};

const registerSchema = z
	.object({
		firstName: z
			.string({ required_error: 'First Name is required' })
			.min(1, { message: 'First Name is required' })
			.max(64, { message: 'First Name must be less than 64 characters' })
			.trim(),
		lastName: z
			.string({ required_error: 'Last Name is required' })
			.min(1, { message: 'Last Name is required' })
			.max(64, { message: 'Last Name must be less than 64 characters' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.min(1, { message: 'Email is required' })
			.max(64, { message: 'Email must be less than 64 characters' })
			.email({ message: 'Email must be valid' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim(),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim()
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['passwordConfirm']
			});
		}
	});

export const actions: Actions = {
	register: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { password, passwordConfirm, ...restData } = formData;

		// Validation
		try {
			const result = registerSchema.parse(formData);
		} catch (err) {
			const { fieldErrors: errors } = err.flatten();

			return fail(400, { data: restData, errors });
		}

		const user = await db.user.findUnique({
			where: { email: String(formData.email) }
		});
		if (user) {
			const errors = { email: ['Email already used'] };
			return fail(400, { data: restData, errors });
		}

		await db.user.create({
			data: {
				firstName: String(formData.firstName),
				lastName: String(formData.lastName),
				email: String(formData.email),
				passwordHash: await bcrypt.hash(String(formData.password), 10),
				userAuthToken: crypto.randomUUID(),
				role: Role.USER
			}
		});

		throw redirect(303, '/login');
	}
};
