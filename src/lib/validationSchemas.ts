import { z } from 'zod';

// * Login
export const loginSchema = z.object({
	email: z.string().min(1).max(64).email(),
	password: z.string().min(6).max(32).trim()
});

// * Workout
export const workoutTemplateSchema = z.object({
	workoutTitle: z
		.string({ required_error: 'Workout title is required' })
		.min(1, { message: 'Workout title is required' })
		.max(30, { message: 'Workout title is too long' })
		.trim(),
	workoutNote: z.string().trim()
});

// * Exercise
export const exerciseSchema = z.object({
	exerciseTitle: z
		.string({ required_error: 'Exercise title is required' })
		.min(1, { message: 'Exercise title is required' })
		.max(30, { message: 'Exercise title is too long' })
		.trim(),
	exerciseNote: z.string().trim()
});

// * Set
export const setSchema = z.object({
	setWeight: z.number({
		required_error: 'Weight must be specified',
		invalid_type_error: 'Weight must be a number'
	}),
	setReps: z.number({
		required_error: 'Number of reps must be specified',
		invalid_type_error: 'Number of reps must be a number'
	})
});
