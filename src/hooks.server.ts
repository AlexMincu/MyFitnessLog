import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/database';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	// if there is no session load page as normal
	if (!session) {
		return await resolve(event);
	}

	const user = await db.user.findUnique({
		where: { userAuthToken: session },
		select: { email: true, role: true }
	});

	if (user) {
		event.locals.user = {
			email: user.email,
			role: user.role
		};
	}

	return await resolve(event);
};
