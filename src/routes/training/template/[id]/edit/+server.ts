import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';

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

export const PUT: RequestHandler = async ({ url, request, locals }) => {
	const workout: Workout = await request.json();
	const pathArray = url.pathname.split('/');
	const workoutTemplateId = pathArray[pathArray.length - 2];

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
		return json(errors);
	}

	const user = await db.user.findUnique({
		where: {
			email: locals.user.email
		}
	});

	if (user) {
		// Check if user owns this workout template
		const tempWorkout = await db.workout.findUnique({
			where: {
				id: workoutTemplateId
			}
		});
		if (tempWorkout && tempWorkout.userId !== user.id) {
			throw error(401, { message: 'Not allowed' });
		}

		try {
			const workoutEntry = await db.workout.update({
				where: {
					id: workoutTemplateId
				},
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
				console.log('prisma erorr catched: ', e.message);
			}
			throw error(409);
		}
	} else {
		return json({ unauthorized: true });
	}

	return json({ success: true });
};
