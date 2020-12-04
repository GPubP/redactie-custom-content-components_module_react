import { PresetDetailUIModel, PresetUIModel } from '../../store/presets';

export type UsePresetsUIStates = () => [PresetUIModel | undefined, PresetDetailUIModel];
