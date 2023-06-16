import { db } from '$lib/database';
import { WorkoutType } from '@prisma/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';

async function getExerciseHistory(exerciseTemplateId: string) {
	try {
		const exerciseHistory = await db.exercise.findMany({
			where: {
				AND: [
					{ exerciseTemplateId },
					{
						workout: {
							type: WorkoutType.ENTRY
						}
					}
				]
			},

			orderBy: {
				workout: {
					createdAt: 'desc'
				}
			},

			include: {
				sets: {
					orderBy: {
						orderNumber: 'asc'
					}
				},
				workout: {
					select: { title: true, createdAt: true }
				}
			}
		});

		if (exerciseHistory) return { exerciseHistory };
	} catch (err) {
		return { error: err.message };
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const pathArray = url.pathname.split('/');
	const exerciseTemplateId = pathArray[pathArray.length - 1];

	const exerciseHistory = await getExerciseHistory(exerciseTemplateId);

	if (exerciseHistory && exerciseHistory.error) {
		throw error(500);
	}

	return json(
		{ success: true, exerciseHistory: exerciseHistory?.exerciseHistory },
		{ status: 200 }
	);
};
