import type { Workout } from '$lib/services/customTypes';

export async function createWorkoutRequest(workout: Workout) {
	const response = await fetch('/api/workout', {
		method: 'POST',
		body: JSON.stringify(workout),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}

export async function deleteWorkoutRequest(id: string) {
	const response = await fetch(`/api/workout/${id}`, {
		method: 'DELETE',
		body: JSON.stringify({ workoutId: id }),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}

export async function editWorkoutRequest(workout: Workout) {
	const response = await fetch(`/api/workout/${workout.id}`, {
		method: 'PUT',
		body: JSON.stringify(workout),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}
