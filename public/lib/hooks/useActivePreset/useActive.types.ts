import { PresetDetailModel, PresetDetailUIModel } from '../../store/presets';

export type UseActivePreset = (
	presetId: string
) => [PresetDetailModel | undefined, PresetDetailUIModel | undefined];
