export type Workout = {
	id: string | null;
	title: string;
	type: string;
	favorite: boolean;
	note: string;
	exercises: Exercise[];
};

export type Exercise = {
	exerciseTemplate: ExerciseTemplate;
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

export enum trainingState {
	VIEW_ONE = 'VIEW_ONE',
	VIEW_ALL = 'VIEW_ALL',
	NEW = 'NEW'
}

export enum workoutState {
	VIEW = 'VIEW',
	EDIT = 'EDIT'
}

export type ExerciseTemplate = {
	id: string | null;
	title: string;
	description: string;
	userId: string | null;
};

export enum exerciseTemplatesDrawerState {
	OPEN,
	CLOSE
}

export enum exerciseTemplateState {
	VIEW,
	EDIT
}

export interface State {
	training: trainingState;
	workout: workoutState;
	exerciseTemplatesDrawer: exerciseTemplatesDrawerState;
	exerciseTemplate: exerciseTemplateState;
}
