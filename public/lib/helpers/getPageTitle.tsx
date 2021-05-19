import { Field, PresetDetailModel } from '@redactie/content-types-module';

import { CORE_TRANSLATIONS } from '../connectors';
import { PageType } from '../customCC.types';

export const getPageTitle = (pageType: PageType) => (
	preset: PresetDetailModel,
	activeField: Field,
	activeDynamicField: Field,
	t: (keys: string | string[]) => string
) => {
	const getTitleElement = (label?: string): string =>
		`${label ? `'${label}'` : 'Content component'} ${t(CORE_TRANSLATIONS.ROUTING_UPDATE)}`;

	switch (pageType) {
		case PageType.DynamicField:
			return getTitleElement(activeDynamicField?.label);
		case PageType.Field:
			return getTitleElement(activeField?.label);
		case PageType.Preset:
		default:
			return getTitleElement(preset?.data?.label);
	}
};
