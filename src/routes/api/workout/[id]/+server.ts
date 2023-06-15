import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import type { Workout, Exercise, Set } from '$lib/customTypes';
import { validateWorkout } from '$lib/services/workoutService';

async function updateWorkout(id: string, workout: Workout) {
	try {
		const updatedWorkout = await db.workout.update({
			where: {
				id
			},
			data: {
				title: workout.title,
				note: workout.note,
				favorite: workout.favorite
			}
		});

		await db.exercise.deleteMany({
			where: {
				workoutId: id
			}
		});

		workout.exercises.forEach(async (exercise: Exercise) => {
			const exerciseEntry = await db.exercise.create({
				data: {
					title: exercise.title,
					note: exercise.note,
					workoutId: id
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

		return { updatedWorkout };
	} catch (err) {
		return { error: err.message };
	}
}

async function deleteWorkout(id: string) {
	try {
		const deletedWorkout = await db.workout.delete({
			where: {
				id
			}
		});

		console.log(deletedWorkout);
		return { deletedWorkout };
	} catch (err) {
		return { error: err.message };
	}
}

// Check if user owns the workout
async function isRequestedUser(userEmail: string, workoutId: string) {
	const user = await db.user.findUnique({
		where: {
			email: userEmail
		}
	});

	if (user) {
		const workout = await db.workout.findFirst({
			where: {
				AND: [{ id: workoutId }, { userId: user.id }]
			}
		});

		if (workout) return true;
	}

	return false;
}

export const PUT: RequestHandler = async ({ url, request, locals }) => {
	const body = await request.json();
	const workout: Workout = body.workout;
	const pathArray = url.pathname.split('/');
	const workoutId = pathArray[pathArray.length - 1];

	// * Request Body Validation
	const validation = validateWorkout(workout);
	if (validation.error) {
		return json({ validationErrors: validation.error });
	}

	// * Authorization
	if (!isRequestedUser(locals.user.email, workoutId)) {
		throw error(401, { message: 'Cannot update workout' });
	}

	// * Action
	const updatedWorkout = await updateWorkout(workoutId, workout);
	if (updatedWorkout.error) {
		throw error(500);
	}

	return json({ success: true }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
	const pathArray = url.pathname.split('/');
	const workoutId = pathArray[pathArray.length - 1];

	// TODO ? Request Body Validation ?

	// * Authorization
	if (!isRequestedUser(locals.user.email, workoutId)) {
		throw error(401, { message: 'Cannot delete workout' });
	}

	// * Action
	const deletedWorkout = await deleteWorkout(workoutId);
	if (deletedWorkout.error) {
		throw error(500);
	}

	return json({ success: true }, { status: 200 });
};
