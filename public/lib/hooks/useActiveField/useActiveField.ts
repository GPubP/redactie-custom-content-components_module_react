import { useObservable } from '@redactie/utils';

import { PresetField } from '../../customCC.types';
import { uiFacade } from '../../store/ui';

const useActiveField = (): PresetField | null | undefined => {
	const activeField = useObservable(uiFacade.activeField$, uiFacade.getActiveField());

	return activeField;
};

export default useActiveField;
