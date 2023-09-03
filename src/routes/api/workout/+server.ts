import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import { type Workout, type Exercise, type Set, WorkoutType } from '$lib/customTypes';
import { validateWorkout } from '$lib/services/workoutService';

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

async function createWorkout(email: string, workout: Workout) {
	try {
		const createdWorkout = await db.workout.create({
			data: {
				title: workout.title,
				type: workout.type,
				note: workout.note,
				favorite: workout.favorite,
				user: {
					connect: {
						email
					}
				}
			}
		});

		for (const exercise of workout.exercises) {
			if (exercise.exerciseTemplate.id) {
				const exerciseTemplate = await db.exerciseTemplate.findUnique({
					where: {
						id: exercise.exerciseTemplate.id
					}
				});

				if (exerciseTemplate) {
					const exerciseEntry = await db.exercise.create({
						data: {
							note: exercise.note,
							workoutId: createdWorkout.id
						}
					});

					await db.exercise.update({
						where: {
							id: exerciseEntry.id
						},
						data: {
							exerciseTemplate: {
								connect: {
									id: exerciseTemplate.id
								}
							}
						}
					});

					for (const set of exercise.sets) {
						await db.set.create({
							data: {
								exerciseId: exerciseEntry.id,
								orderNumber: Number(set.orderNumber),
								type: set.type,
								weight: Number(set.weight),
								reps: Number(set.reps)
							}
						});
					}
				}
			}
		}

		return { createdWorkout };
	} catch (err) {
		return { error: err.message };
	}
}

export const GET: RequestHandler = async ({ locals }) => {
	const user = await db.user.findUnique({
		where: {
			email: locals.user.email
		}
	});

	let workoutTemplates;
	let workoutEntries;

	if (user) {
		workoutTemplates = await getWorkouts(user.id, WorkoutType.TEMPLATE);
		workoutEntries = await getWorkouts(user.id, WorkoutType.ENTRY);
	}

	if (workoutTemplates === null || workoutEntries === null) throw error(500);

	return json({ success: true, workoutTemplates, workoutEntries }, { status: 200 });
};

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
