import type { PageServerLoad } from '../$types';
import { db } from '$lib/database';

async function getUserId(email: string) {
	const user = await db.user.findUnique({
		where: {
			email
		}
	});

	if (user) return user.id;

	return null;
}

async function getExerciseTemplates(userId: string) {
	const exerciseTemplates = await db.exerciseTemplate.findMany({
		where: {
			OR: [{ userId }, { userId: null }]
		}
	});

	if (exerciseTemplates) return exerciseTemplates;

	return null;
}

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
	const userId = await getUserId(locals.user.email);

	if (cookies.get('newGuest') === 'true') {
		const workouts = [
			{
				id: null,
				title: 'Full Body Workout 1',
				type: 'TEMPLATE',
				favorite: false,
				note: 'Day 1 of the Full Body Workout',
				exercises: [
					{
						exerciseTemplate: {
							id: '6284ab8e-197b-11ee-be56-0242ac120002',
							title: 'Deadlift',
							description:
								'A compound exercise that targets the entire posterior chain, including the glutes, hamstrings, and lower back',
							userId: null
						},
						note: '3-5 reps',
						sets: [
							{ orderNumber: 0, type: 'W', weight: null, reps: null },
							{ orderNumber: 0, type: 'W', weight: null, reps: null },
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '6284b016-197b-11ee-be56-0242ac120002',
							title: 'Barbell Row',
							description: 'A pulling exercise that targets the lats, rhomboids, and biceps',
							userId: null
						},
						note: '5-8 reps',
						sets: [
							{ orderNumber: 0, type: 'W', weight: null, reps: null },
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '6284ae40-197b-11ee-be56-0242ac120002',
							title: 'Dumbbell Overhead Press',
							description: 'A pushing exercise that targets the shoulders and triceps',
							userId: null
						},
						note: '6-10 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '6284acce-197b-11ee-be56-0242ac120002',
							title: 'Lat Pulldown',
							description: 'A pulling exercise that targets the lats',
							userId: null
						},
						note: '6-10 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					}
				]
			},

			{
				id: null,
				title: 'Full Body Workout 2',
				type: 'TEMPLATE',
				favorite: false,
				note: 'Day 2 of the Full Body Workout',
				exercises: [
					{
						exerciseTemplate: {
							id: 'c93d4874-438c-4b0c-bf04-607dfab90442',
							title: 'Front Squat',
							description: 'A compound exercise that targets the quads, hamstrings, and core',
							userId: null
						},
						note: '3-5 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '500cc023-b0b0-49f4-85fd-1dab244ecef1',
							title: 'Romanian Deadlift',
							description:
								'A compound exercise that targets the hamstrings, glutes, and lower back',
							userId: null
						},
						note: '6-10 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '0c83cd57-175b-4c4f-a526-0f78c13b3fae',
							title: 'Dumbbell Row',
							description: 'A pulling exercise that targets the lats, rhomboids, and biceps',
							userId: null
						},
						note: '10-15 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '25e67b67-f0ac-4910-b3f7-200b63f96359',
							title: 'Incline Dumbbell Bench Press',
							description: 'A pushing exercise that targets the upper chest',
							userId: null
						},
						note: '8-12 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: 'c65473bc-b02a-4724-b2a7-3dac322d462d',
							title: 'Calf Raise',
							description: 'An isolating exercise that targets the calves',
							userId: null
						},
						note: '15-20 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					}
				]
			},

			{
				id: null,
				title: 'Full Body Workout 3',
				type: 'TEMPLATE',
				favorite: false,
				note: 'Day 3 of the Full Body Workout',
				exercises: [
					{
						exerciseTemplate: {
							id: '2af7ce52-68de-468b-9b9d-0ac0c30b30d5',
							title: 'Bench Press',
							description: 'The bench press is a compound exercise that targets the chest',
							userId: null
						},
						note: '3-5 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '6284b958-197b-11ee-be56-0242ac120002',
							title: 'Leg Press',
							description: 'An isolating exercise that targets the quads and glutes',
							userId: null
						},
						note: '6-10 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '2ca12cce-2078-4d59-9fb1-1440e0782853',
							title: 'Leg Curl',
							description: 'An isolating exercise that targets the hamstrings',
							userId: null
						},
						note: '8-12 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '6284b214-197b-11ee-be56-0242ac120002',
							title: 'Dumbbell Lateral Raise',
							description: 'An isolating exercise that targets the side deltoids',
							userId: null
						},
						note: '10-15 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'N', weight: null, reps: null }
						]
					},
					{
						exerciseTemplate: {
							id: '8db231f0-ad8c-417c-ab3c-6b4b87381147',
							title: 'EZ Bar Curl',
							description: 'An isolating exercise that targets the biceps',
							userId: null
						},
						note: '10-12 reps',
						sets: [
							{ orderNumber: 1, type: 'N', weight: null, reps: null },
							{ orderNumber: 2, type: 'N', weight: null, reps: null },
							{ orderNumber: 3, type: 'D', weight: null, reps: null }
						]
					}
				]
			}
		];

		workouts.forEach(async (workout) => {
			const response = await fetch('/api/workout', {
				method: 'POST',
				body: JSON.stringify({ workout }),
				headers: { 'content-type': 'application/json' }
			});

			const responseJSON = await response.json();

			if (responseJSON.success) {
				console.log('Guest Workout: Create workout successfully!');
			} else if (responseJSON.validationErrors) {
				console.log(
					"Guest Workout: Couldn't create workout. Validation Errors: ",
					responseJSON.validationErrors
				);
			} else {
				console.log(
					"Guest Workout: Something went wrong, couldn't create workout. Error: ",
					responseJSON
				);
			}
		});

		cookies.set('newGuest', 'false');
	}

	if (userId) {
		// * Workout Templates & Entries
		const response = await fetch('/api/workout');
		const responseJSON = await response.json();

		const workoutTemplates = responseJSON.workoutTemplates;
		const workoutEntries = responseJSON.workoutEntries;

		// * Exercise Templates
		const exerciseTemplates = await getExerciseTemplates(userId);

		return { workoutTemplates, workoutEntries, exerciseTemplates };
	}
};
