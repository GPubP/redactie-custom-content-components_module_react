import { useObservable } from '@redactie/utils';

import { dynamicFieldFacade } from '../../store/dynamicField/dynamicField.facade';
import { DynamicFieldDetailModel } from '../../store/dynamicField/dynamicField.model';

const useDynamicActiveField = (): DynamicFieldDetailModel | null | undefined => {
	const activeField = useObservable(dynamicFieldFacade.activeField$, null);

	return activeField;
};

export default useDynamicActiveField;
