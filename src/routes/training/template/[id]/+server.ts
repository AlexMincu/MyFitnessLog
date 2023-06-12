import { json, type RequestHandler } from '@sveltejs/kit';

import { db } from '$lib/database';
import { Prisma } from '@prisma/client';

export const DELETE: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		await db.workout.delete({
			where: {
				id: body.workoutId
			}
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2025') return json({ notFound: true });
		}
	}

	return json({ success: true });
};
