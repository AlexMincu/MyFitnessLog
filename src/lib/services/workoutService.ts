import type { Workout } from '$lib/customTypes';
import { exerciseSchema, setSchema, workoutTemplateSchema } from '$lib/validationSchemas';

export function validateWorkout(workout: Workout) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let validationErrors: any[] = [];

	try {
		workoutTemplateSchema.parse({
			workoutTitle: workout.title,
			workoutNote: workout.note
		});
	} catch (err) {
		const { fieldErrors: errors } = err.flatten();
		validationErrors = [...validationErrors, errors];
	}

	workout.exercises.forEach((exercise) => {
		try {
			exerciseSchema.parse({
				exerciseTitle: exercise.title,
				exerciseNote: exercise.note
			});
		} catch (err) {
			const { fieldErrors: errors } = err.flatten();
			validationErrors = [...validationErrors, errors];
		}

		exercise.sets.forEach((set) => {
			try {
				setSchema.parse({
					setWeight: Number(set.weight),
					setReps: Number(set.reps)
				});
			} catch (err) {
				const { fieldErrors: errors } = err.flatten();
				validationErrors = [...validationErrors, errors];
			}
		});
	});
	if (validationErrors.length) return { error: [...validationErrors] };

	return { success: true };
}

export async function createWorkoutRequest(workout: Workout) {
	const response = await fetch('/api/workout', {
		method: 'POST',
		body: JSON.stringify({ workout }),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}

export async function deleteWorkoutRequest(id: string) {
	const response = await fetch(`/api/workout/${id}`, {
		method: 'DELETE'
	});

	return await response.json();
}

export async function editWorkoutRequest(workout: Workout) {
	const response = await fetch(`/api/workout/${workout.id}`, {
		method: 'PUT',
		body: JSON.stringify({ workout }),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}
