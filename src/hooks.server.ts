import { redirect, type Handle } from '@sveltejs/kit';
import { db } from '$lib/database';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	// ! If no session
	if (!session) {
		// protected routes - user not authenticated
		if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/training')) {
			throw redirect(303, '/login');
		}

		return await resolve(event);
	}

	// ! If session
	// Authenticate user
	const user = await db.user.findUnique({
		where: { userAuthToken: session },
		select: { firstName: true, lastName: true, email: true, role: true }
	});

	if (user) {
		// save user in locals
		event.locals.user = {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role
		};

		if (event.url.pathname === '/') {
			throw redirect(303, '/training');
		}
	} else {
		// no user with this session
		event.cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});

		throw redirect(302, '/login');
	}

	return await resolve(event);
};
