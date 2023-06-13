export type Workout = {
	id: string | null;
	title: string;
	type: string;
	favorite: boolean;
	note: string;
	exercises: Exercise[];
};

export type Exercise = {
	title: string;
	note: string;
	sets: Set[];
};

export type Set = {
	orderNumber: number;
	type: string;
	weight: number | null;
	reps: number | null;
};

export enum SetType {
	N = 'N',
	W = 'W',
	D = 'D'
}
