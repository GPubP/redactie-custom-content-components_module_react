import { dynamicCompartmentsFactory } from '@redactie/utils';

import { compartmentsFacade, CompartmentsState } from '../../store/compartments';

const [useCompartments] = dynamicCompartmentsFactory.createHooks<CompartmentsState>(
	compartmentsFacade
);

export default useCompartments;
