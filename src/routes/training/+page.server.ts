import type { PageServerLoad } from '../$types';
import { db } from '$lib/database';
import { WorkoutType } from '@prisma/client';

async function getUserId(email: string) {
	const user = await db.user.findUnique({
		where: {
			email
		}
	});

	if (user) return user.id;

	return null;
}

async function getWorkouts(userId: string, workoutsType: WorkoutType) {
	const workouts = await db.workout.findMany({
		where: {
			AND: [{ userId }, { type: workoutsType }]
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: {
				include: {
					exerciseTemplate: true,
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

	if (userId) {
		// * Workout Templates
		const workoutTemplates = await getWorkouts(userId, WorkoutType.TEMPLATE);

		// * Workout Entries
		const workoutEntries = await getWorkouts(userId, WorkoutType.ENTRY);

		// * Exercise Templates
		const exerciseTemplates = await getExerciseTemplates(userId);

		return { workoutTemplates, workoutEntries, exerciseTemplates };
	}
};
