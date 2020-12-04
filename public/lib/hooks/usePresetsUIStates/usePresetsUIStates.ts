import { useObservable } from '@redactie/utils';

import { presetsFacade } from '../../store/presets';

import { UsePresetsUIStates } from './usePresetsUIStates.types';

const usePresetsUIStates: UsePresetsUIStates = (presetId = '') => {
	const presetUIState = useObservable(presetsFacade.selectUIState(), {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const presetDetailUIState = useObservable(presetsFacade.selectDetailUIState(presetId), {
		isDeleting: false,
		isFetching: false,
		isUpdating: false,
		error: null,
	});

	return [presetUIState, presetDetailUIState];
};

export default usePresetsUIStates;
