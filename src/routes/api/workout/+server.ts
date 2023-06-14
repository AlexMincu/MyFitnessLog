import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import type { Workout, Exercise, Set } from '$lib/services/customTypes';
import { validateWorkout } from '$lib/services/workoutService';

async function createWorkout(email: string, workout: Workout) {
	try {
		const createdWorkout = await db.workout.create({
			data: {
				title: workout.title,
				note: workout.note,
				favorite: workout.favorite,
				user: {
					connect: {
						email
					}
				}
			}
		});

		workout.exercises.forEach(async (exercise: Exercise) => {
			const exerciseEntry = await db.exercise.create({
				data: {
					title: exercise.title,
					note: exercise.note,
					workoutId: createdWorkout.id
				}
			});

			exercise.sets.forEach(async (set: Set) => {
				await db.set.create({
					data: {
						exerciseId: exerciseEntry.id,
						orderNumber: Number(set.orderNumber),
						type: set.type,
						weight: Number(set.weight),
						reps: Number(set.reps)
					}
				});
			});
		});

		return { createdWorkout };
	} catch (err) {
		return { error: err.message };
	}
}

// Create Workout Handler
export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const workout: Workout = body.workout;

	// Request Body Validation
	const validation = validateWorkout(workout);
	if (validation.error) {
		return json({ validationErrors: validation.error });
	}

	// Action
	const createdWorkout = await createWorkout(locals.user.email, workout);

	if (createdWorkout.error) {
		throw error(500);
	}

	return json({ success: true }, { status: 200 });
};
