import { dynamicCompartmentsFactory } from '@redactie/utils';

import { CompartmentsState } from './compartments.model';

export const {
	store: compartmentsStore,
	facade: compartmentsFacade,
	query: compartmentsQuery,
} = dynamicCompartmentsFactory.createStore<CompartmentsState>('CCC');
export * from './compartments.model';
