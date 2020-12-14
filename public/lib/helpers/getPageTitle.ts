import { PresetDetailModel } from '@redactie/content-types-module';

import { PageType } from '../customCC.types';

export const getPageTitle = (pageType: PageType) => (
	preset: PresetDetailModel,
	field: any,
	dynamicField: any
) => {
	switch (pageType) {
		case PageType.DynamicField:
			return `${dynamicField?.label || 'Vrije paragraaf'} bewerken`;
		case PageType.Field:
			return `${field?.label || 'Content component'} bewerken`;
		case PageType.Preset:
		default:
			return `${preset?.data?.label || 'Content component'} bewerken`;
	}
};
