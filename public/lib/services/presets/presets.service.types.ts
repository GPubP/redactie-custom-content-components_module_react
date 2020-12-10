/**
 * =========================
 * Base types
 * =========================
 */
export interface Compartment {
	uuid: string;
	label: string;
	removable: boolean;
}

export interface FieldCompartment {
	uuid: string;
	position: number;
}

export interface ValidationCheck {
	key: string;
	val: unknown;
	err: string;
}

export interface ValicationCheckWithFields {
	type: string;
	fields: ValidationCheckField[];
}

export interface ValidationCheckField {
	name: string;
	type: string;
	checks: ValidationCheck[];
}

export interface ValicationCheckWithAllowedFields {
	id?: string;
	type: string;
	allowedFields: ValidationCheckAllowedField[];
}

export interface ValidationCheckAllowedField {
	type: string;
	fieldType: string;
	checks: ValidationCheck[];
}

export interface Validation {
	type: string;
	checks: (ValidationCheck | ValicationCheckWithFields | ValicationCheckWithAllowedFields)[];
}

export interface Operator {
	label: string;
	value: string;
}

export interface DataType {
	_id: string;
	meta: {
		createdAt: string;
		deleted: boolean;
		lastModified: string;
		created: string;
	};
	data: {
		label: string;
		type: string;
		semanticType: string;
	};
	uuid: string;
}

export interface FieldTypeData {
	label: string;
	name: string;
	componentName: string;
	validators: any[];
	defaultValidatorValues: Validation;
	defaultConfig: any;
	fieldType?: string;
	formSchema: {
		fields: Field[];
	};
	dataType: DataType;
	generalConfig: {
		isQueryable: boolean;
		isTranslate: boolean;
		isMultiple: boolean;
		defaultLabel?: string;
		defaultGuideline?: string;
		hasPlaceholder?: boolean;
	};
	operators: Operator[];
	module: string;
}

export interface FieldTypeMeta {
	created: string;
	lastModified: string;
	lastEditor: string;
	deleted: boolean;
}

export interface FieldType {
	_id: string;
	uuid: string;
	data: FieldTypeData;
	meta: FieldTypeMeta;
	validateSchema: {
		configuration: object;
		validation: {
			formSchema: object;
			dataSchema: object;
		};
	};
	errorMessages: {
		configuration: Record<string, string>;
		validation: {
			formSchema: Record<string, string>;
			dataSchema: Record<string, string>;
		};
	};
}

export interface Field<D = DataType, F = FieldType, P = Preset | PresetDetailResponse> {
	uuid: string;
	label: string;
	module: string;
	name: string;
	config: {
		fields?: Field[];
		[key: string]: any;
	};
	defaultValue?: any;
	validators: Validator[];
	operators: Operator[];
	validation?: Validation;
	generalConfig: {
		guideline: string;
		multiLanguage?: boolean;
		required?: boolean;
		hidden?: boolean;
		disabled?: boolean;
		min?: number;
		max?: number;
		combinedOutput?: boolean;
		placeholder?: string;
	};
	dataType: D;
	fieldType: F;
	preset?: P;
	compartment: FieldCompartment;
}

export interface Validator {
	uuid: string;
	data: {
		name: string;
		label: string;
		description: string;
		dataTypes: string[];
		defaultValue: Record<string, any>;
		formSchema: {
			fields: Field[];
		};
	};
	meta: {
		created: string;
		lastModified: string;
		lastEditor: string;
		deleted: string;
	};
}

export interface BasePreset<T, F> {
	_id: string;
	uuid: string;
	data: {
		name: string;
		label: string;
		defaultConfig: Record<string, any>;
		fieldType: F;
		generalConfig: {
			isQueryable: boolean;
			isTranslate: boolean;
			isMultiple: boolean;
		};
		fields: {
			field: any;
			formSchema: {
				fields: Field[];
			};
			validators: T[];
		}[];
		validators: T[];
		meta: {
			created: string;
			lastModified: string;
			deleted: boolean;
		};
	};
	validateSchema: {
		configuration: object;
		validation: {
			formSchema: object;
			dataSchema: object;
		};
	};
	errorMessages: {
		configuration: Record<string, string>;
		validation: {
			formSchema: Record<string, string>;
			dataSchema: Record<string, string>;
		};
	};
}

export type Preset = BasePreset<string, string>;
export interface PresetsPaging {
	total: number;
	skip: number;
	limit: number;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface PresetsResponse {
	data: Preset[];
	paging: PresetsPaging;
}

export type PresetDetailResponse = BasePreset<Validator, FieldType>;

/**
 * =========================
 * Request types
 * - Define all request interfaces that are send to the server
 * =========================
 */

export interface PresetCreateRequest {
	data: {
		name: string;
		label: string;
		fields: PresetDetailResponse['data']['fields'];
		validators: PresetDetailResponse['data']['validators'];
	};
}
