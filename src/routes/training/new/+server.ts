import { json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import type { Workout, Exercise, Set } from '$lib/services/customTypes';
import { Prisma } from '@prisma/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	const workout: Workout = await request.json();

	const user = await db.user.findUnique({
		where: {
			email: locals.user.email
		}
	});

	if (user) {
		try {
			const workoutEntry = await db.workout.create({
				data: {
					userId: user.id,
					title: workout.title,
					note: workout.note,
					favorite: workout.favorite
				}
			});

			workout.exercises.forEach(async (exercise: Exercise) => {
				const exerciseEntry = await db.exercise.create({
					data: {
						title: exercise.title,
						note: exercise.note,
						workoutId: workoutEntry.id
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
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				// console.log(e.message);
			}
			return json({ dbError: true });
		}
	} else {
		return json({ unauthorized: true });
	}

	return json({ success: true });
};
