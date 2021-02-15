import { Field } from '@redactie/content-types-module';
import { ContextHeaderBadge } from '@redactie/utils';

import { CONTEXT_HEADER_ROUTE_BAGES } from '../customCC.const';
import { PageType } from '../customCC.types';

export const getPageBadges = (
	pageType: PageType,
	defaultBadges: ContextHeaderBadge[] = CONTEXT_HEADER_ROUTE_BAGES.detailCC
) => (activeField: Field, activeDynamicField: Field): ContextHeaderBadge[] => {
	switch (pageType) {
		case PageType.DynamicField: {
			const dynamicFieldTypeLabel = activeDynamicField?.fieldType?.data?.label;

			return dynamicFieldTypeLabel
				? [
						...defaultBadges,
						{
							name: activeDynamicField?.fieldType?.data?.label,
							type: 'primary',
						},
				  ]
				: [];
		}
		case PageType.Field: {
			const fieldTypeLabel = activeField?.preset
				? activeField?.preset.data.label
				: activeField?.fieldType?.data.label;

			return fieldTypeLabel
				? [
						...defaultBadges,
						{
							name: fieldTypeLabel,
							type: 'primary',
						},
				  ]
				: defaultBadges;
		}
		case PageType.Preset:
		default:
			return defaultBadges;
	}
};
