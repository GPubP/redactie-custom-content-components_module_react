import { PresetDetailFieldModel } from '@redactie/content-types-module';
import { useObservable } from '@redactie/utils';

import { uiFacade } from '../../store/ui';
const useActiveField = (): PresetDetailFieldModel | null | undefined => {
	const activeField = useObservable(uiFacade.activeField$, uiFacade.getActiveField());

	return activeField;
};

export default useActiveField;
