import { EntityState } from '@datorama/akita';
import { FieldTypeDetailModel } from '@redactie/content-types-module';
import { DynamicCompartmentModel } from '@redactie/utils';

export enum CompartmentType {
	'INTERNAL',
	'MODULE',
}

export interface CompartmentRegisterOptions {
	replace?: true;
}

export interface CompartmentModel extends DynamicCompartmentModel {
	label: string;
	filter?: (meta: FieldTypeDetailModel) => boolean;
	type: CompartmentType;
}

export type CompartmentsState = EntityState<CompartmentModel, string>;
