import { FieldType } from '@redactie/content-types-module/dist/lib/services/fieldTypes';
import { Preset } from '@redactie/content-types-module/dist/lib/services/presets';

export const sortFieldTypes = (a: Preset | FieldType, b: Preset | FieldType): number => {
	const nameA = a.data?.label?.toUpperCase();
	const nameB = b.data?.label?.toUpperCase();

	if (nameA < nameB) {
		return -1;
	}

	if (nameA > nameB) {
		return 1;
	}

	return 0;
};
