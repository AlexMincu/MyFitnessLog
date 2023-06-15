import type { ExerciseTemplate } from '$lib/customTypes';
import { exerciseTemplateSchema } from '$lib/validationSchemas';

export async function createExerciseTemplateRequest(exerciseTemplate: ExerciseTemplate) {
	const response = await fetch('/api/exerciseTemplate', {
		method: 'POST',
		body: JSON.stringify({ exerciseTemplate }),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}

export async function updateExerciseTemplateRequest(exerciseTemplate: ExerciseTemplate) {
	const response = await fetch(`/api/exerciseTemplate/${exerciseTemplate.id}`, {
		method: 'PUT',
		body: JSON.stringify({ exerciseTemplate }),
		headers: { 'content-type': 'application/json' }
	});

	return await response.json();
}

export async function deleteExerciseTemplateRequest(id: string) {
	const response = await fetch(`/api/exerciseTemplate/${id}`, {
		method: 'DELETE'
	});

	return await response.json();
}

export function validateExerciseTemplate(exercise: ExerciseTemplate) {
	try {
		exerciseTemplateSchema.parse({
			exerciseTemplateTitle: exercise.title
		});
	} catch (err) {
		const { fieldErrors: errors } = err.flatten();

		return { error: errors };
	}

	return null;
}
