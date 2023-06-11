import { json, type RequestHandler } from '@sveltejs/kit';

import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { db } from '$lib/database';
import type { Workout, Exercise, Set } from '$lib/services/customTypes';

const workoutTemplateSchema = z.object({
	workoutTitle: z
		.string({ required_error: 'Workout title is required' })
		.min(1, { message: 'Workout title is required' })
		.max(30, { message: 'Workout title is too long' })
		.trim(),
	workoutNote: z.string().trim()
});

const exerciseSchema = z.object({
	exerciseTitle: z
		.string({ required_error: 'Exercise title is required' })
		.min(1, { message: 'Exercise title is required' })
		.max(30, { message: 'Exercise title is too long' })
		.trim(),
	exerciseNote: z.string().trim()
});

const setSchema = z.object({
	setWeight: z.number({
		required_error: 'Weight must be specified',
		invalid_type_error: 'Weight must be a number'
	}),
	setReps: z.number({
		required_error: 'Number of reps must be specified',
		invalid_type_error: 'Number of reps must be a number'
	})
});

export const POST: RequestHandler = async ({ request, locals }) => {
	const workout: Workout = await request.json();

	// Validation
	try {
		workoutTemplateSchema.parse({
			workoutTitle: workout.title,
			workoutNote: workout.note
		});

		workout.exercises.forEach((exercise) => {
			exerciseSchema.parse({
				exerciseTitle: exercise.title,
				exerciseNote: exercise.note
			});
			exercise.sets.forEach((set) => {
				setSchema.parse({
					setWeight: Number(set.weight),
					setReps: Number(set.reps)
				});
			});
		});
	} catch (err) {
		const { fieldErrors: errors } = err.flatten();
		console.log('server error log', errors);
		return json(errors);
	}

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
