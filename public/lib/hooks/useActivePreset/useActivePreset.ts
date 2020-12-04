import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { presetsFacade } from '../../store/presets';

import { UseActivePreset } from './useActive.types';

const useActivePreset: UseActivePreset = (presetId: string) => {
	useEffect(() => {
		if (!presetsFacade.hasActiveDetail(presetId) && presetId) {
			presetsFacade.setActiveDetail(presetId);
			presetsFacade.getPreset(presetId);
		}
	}, [presetId]);

	const preset = useObservable(presetsFacade.activePreset$);
	const presetUI = useObservable(presetsFacade.activePresetUI$);

	return [preset, presetUI];
};

export default useActivePreset;
