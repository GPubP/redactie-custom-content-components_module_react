import { useObservable } from '@redactie/utils';

import { dynamicFieldFacade } from '../../store/dynamicField/dynamicField.facade';
import { DynamicFieldDetailModel } from '../../store/dynamicField/dynamicField.model';

const useDynamicField = (): DynamicFieldDetailModel | null | undefined => {
	const dynamicField = useObservable(
		dynamicFieldFacade.dynamicField$,
		dynamicFieldFacade.getDynamicFieldValue()
	);

	return dynamicField;
};

export default useDynamicField;
