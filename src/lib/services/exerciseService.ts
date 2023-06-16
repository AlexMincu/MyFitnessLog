export async function getExerciseHistoryRequest(exerciseTemplateId: string) {
	const response = await fetch(`/api/exercise/${exerciseTemplateId}`, {
		method: 'GET'
	});

	return await response.json();
}
