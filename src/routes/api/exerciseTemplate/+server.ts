import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import type { ExerciseTemplate } from '$lib/customTypes';
import { validateExerciseTemplate } from '$lib/services/exerciseTemplateService';

async function createExerciseTemplate(email: string, exercise: ExerciseTemplate) {
	try {
		const createdExercise = await db.exerciseTemplate.create({
			data: {
				title: exercise.title,
				description: exercise.description,
				user: {
					connect: {
						email
					}
				}
			}
		});

		return { createdExercise };
	} catch (err) {
		return { error: err.message };
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const exercise: ExerciseTemplate = body.exerciseTemplate;

	// * Request Body Validation
	const validation = validateExerciseTemplate(exercise);
	if (validation && validation.error) {
		return json({ validationErrors: validation.error });
	}

	// * Action
	const createdExercise = await createExerciseTemplate(locals.user.email, exercise);

	if (createdExercise.error) {
		throw error(500);
	}

	return json({ success: true }, { status: 200 });
};
