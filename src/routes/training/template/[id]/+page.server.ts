import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../../$types';
import { db } from '$lib/database';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const pathArray = url.pathname.split('/');
	const workoutTemplateId = pathArray[pathArray.length - 1];

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
		workoutTemplate.userId = null;
		return { workout: workoutTemplate };
	}
};
