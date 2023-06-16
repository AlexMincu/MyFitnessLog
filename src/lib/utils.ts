export function formatDate(date: string) {
	const formatter = new Intl.DateTimeFormat('en-UK', {
		weekday: 'long',
		day: 'numeric',
		month: '2-digit',
		year: 'numeric',

		hour: 'numeric',
		minute: 'numeric',
		hour12: false
	});

	return formatter.format(new Date(date));
}
