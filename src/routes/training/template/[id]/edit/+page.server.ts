import { db } from '$lib/database';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const user = await db.user.findUnique({
		where: { email: locals.user.email }
	});

	if (!user) {
		return;
	}

	const pathArray = url.pathname.split('/');
	const workoutTemplateId = pathArray[pathArray.length - 2];

	const workoutTemplate = await db.workout.findUnique({
		where: {
			id: workoutTemplateId
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

	if (workoutTemplate) {
		if (workoutTemplate.userId !== user.id) {
			throw error(401, { message: 'Not allowed' });
		}

		workoutTemplate.userId = null;
		return { workout: workoutTemplate };
	}
};
