import type { Workout } from '$lib/services/customTypes';
import { exerciseSchema, setSchema, workoutTemplateSchema } from '$lib/validationSchemas';

export function validateWorkout(workout: Workout) {
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
		return { error: errors };
	}

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
