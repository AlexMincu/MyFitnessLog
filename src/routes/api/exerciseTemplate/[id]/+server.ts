import { error, json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import type { ExerciseTemplate } from '$lib/customTypes';
import { validateExerciseTemplate } from '$lib/services/exerciseTemplateService';

async function updateExerciseTemplate(id: string, exercise: ExerciseTemplate) {
	try {
		const updatedExercise = await db.exerciseTemplate.update({
			where: {
				id
			},
			data: {
				title: exercise.title,
				description: exercise.description
			}
		});

		return { updatedExercise };
	} catch (err) {
		return { error: err.message };
	}
}

async function deleteExerciseTemplate(id: string) {
	try {
		const deletedExercise = await db.exerciseTemplate.delete({
			where: { id }
		});

		return { deletedExercise };
	} catch (err) {
		return { error: err.message };
	}
}

async function isRequestedUser(userEmail: string, exerciseTemplateId: string) {
	const user = await db.user.findUnique({
		where: {
			email: userEmail
		}
	});

	if (user) {
		const exerciseTemplate = await db.exerciseTemplate.findFirst({
			where: {
				AND: [{ id: exerciseTemplateId }, { userId: user.id }]
			}
		});

		if (exerciseTemplate) return true;
	}

	return false;
}

export const PUT: RequestHandler = async ({ request, locals, url }) => {
	const body = await request.json();
	const exercise: ExerciseTemplate = body.exerciseTemplate;
	const pathArray = url.pathname.split('/');
	const exerciseId = pathArray[pathArray.length - 1];

	// * Request Body Validation
	const validation = validateExerciseTemplate(exercise);
	if (validation && validation.error) {
		return json({ validationErrors: validation.error });
	}

	// * Authorization
	if (!isRequestedUser(locals.user.email, exerciseId)) {
		throw error(401, { message: 'Cannot update exercise template' });
	}

	// * Action
	const updatedExercise = await updateExerciseTemplate(exerciseId, exercise);

	if (updatedExercise.error) {
		throw error(500);
	}

	return json({ success: true }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
	const pathArray = url.pathname.split('/');
	const exerciseId = pathArray[pathArray.length - 1];

	// TODO ? Request Body Validation

	// * Authorization
	if (!isRequestedUser(locals.user.email, exerciseId)) {
		throw error(401, { message: 'Cannot update exercise template' });
	}

	// * Action
	const deletedExercise = await deleteExerciseTemplate(exerciseId);
	if (deletedExercise.error) {
		throw error(500);
	}

	return json({ success: true }, { status: 200 });
};
