import { z } from 'zod';

// * Login
export const loginSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }).max(64).email(),
	password: z.string().min(6, { message: 'Password is too short' }).max(32).trim()
});

// * Register
export const registerSchema = z
	.object({
		firstName: z
			.string({ required_error: 'First Name is required' })
			.min(1, { message: 'First Name is required' })
			.max(64, { message: 'First Name must be less than 64 characters' })
			.trim(),
		lastName: z
			.string({ required_error: 'Last Name is required' })
			.min(1, { message: 'Last Name is required' })
			.max(64, { message: 'Last Name must be less than 64 characters' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.min(1, { message: 'Email is required' })
			.max(64, { message: 'Email must be less than 64 characters' })
			.email({ message: 'Email must be valid' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim(),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.trim()
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['passwordConfirm']
			});
		}
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

// * ExerciseTemplate

export const exerciseTemplateSchema = z.object({
	exerciseTemplateTitle: z
		.string({ required_error: 'Exercise title is required' })
		.min(1, { message: 'Exercise title is required' })
		.max(35, { message: 'Exercise title is too long' })
		.trim()
});
