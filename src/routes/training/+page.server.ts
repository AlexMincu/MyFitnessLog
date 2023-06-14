import type { PageServerLoad } from '../$types';
import { db } from '$lib/database';

async function getUserId(email: string) {
	const user = await db.user.findUnique({
		where: {
			email
		}
	});

	if (user) return user.id;

	return null;
}

async function getWorkouts(userId: string) {
	const workouts = await db.workout.findMany({
		where: {
			userId
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

	if (workouts) return workouts;

	return null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const userId = await getUserId(locals.user.email);

	if (userId) {
		const workouts = await getWorkouts(userId);

		if (workouts) {
			workouts.forEach((workout) => {
				workout.userId = null;
			});
			return { workoutTemplates: workouts };
		}
	}
};
