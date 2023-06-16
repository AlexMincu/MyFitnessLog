import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import { registerSchema } from '$lib/validationSchemas';

export const actions: Actions = {
	register: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, passwordConfirm, ...restData } = formData;

		// Validation
		try {
			registerSchema.parse(formData);
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
