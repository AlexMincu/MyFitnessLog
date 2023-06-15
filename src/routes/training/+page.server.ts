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

async function getExerciseTemplates(userId: string) {
	const exerciseTemplates = await db.exerciseTemplate.findMany({
		where: {
			OR: [{ userId }, { userId: null }]
		}
	});

	if (exerciseTemplates) return exerciseTemplates;

	return null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const userId = await getUserId(locals.user.email);
	const returnArray = [];

	if (userId) {
		// * Workout Templates
		const workouts = await getWorkouts(userId);

		if (workouts) {
			workouts.forEach((workout) => {
				workout.userId = null;
			});
			returnArray.push();
		}

		// * Exercise Templates
		const exerciseTemplates = await getExerciseTemplates(userId);

		// TODO
		// if (exerciseTemplates) {
		// 	exerciseTemplates.forEach((exercise) => {
		// 		exercise.userId = null;
		// 	});
		// }

		return { workoutTemplates: workouts, exerciseTemplates };
	}
};
