import { PresetDetailFieldModel } from '@redactie/content-types-module';

export type DynamicFieldDetailModel = PresetDetailFieldModel;

export interface DynamicFieldState {
	dynamicField?: DynamicFieldDetailModel;
	activeField?: DynamicFieldDetailModel;
}
