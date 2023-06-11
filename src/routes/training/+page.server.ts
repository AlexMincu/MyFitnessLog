import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { db } from '$lib/database';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const user = await db.user.findUnique({
		where: {
			email: locals.user.email
		}
	});

	if (user) {
		const workoutTemplates = await db.workout.findMany({
			where: {
				userId: user.id
			},
			include: {
				exercises: {
					include: {
						sets: {
							orderBy: {
								orderNumber: 'asc'
							}
						}
					}
				}
			}
		});

		return { workoutTemplates };
	}
};
