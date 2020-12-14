import { CreatePresetPayload, PresetDetailModel } from '@redactie/content-types-module';
import { FieldType } from '@redactie/content-types-module/dist/lib/services/fieldTypes';
import { Preset } from '@redactie/content-types-module/dist/lib/services/presets';
import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode } from 'react';

export interface CustomCCModuleProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface CustomCCRouteParams {
	presetUuid: string;
}

export interface CustomCCRouteProps<Params = CustomCCRouteParams>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface CustomCCDetailRouteParams {
	presetUuid: string;
	contentComponentUuid: string;
}

export interface CustomCCDetailRouteProps<Params = CustomCCDetailRouteParams>
	extends RouteConfigComponentProps<Params> {
	readonly allowedPaths?: string[];
	readonly fieldsHaveChanged: boolean;
	readonly fieldTypes: FieldType[];
	readonly preset: PresetDetailModel;
	readonly presets: Preset[];
	onCancel: () => void;
	onSubmit: (data: CreatePresetPayload['data'] | PresetDetailModel, tab: Tab) => void;
}

export enum PageType {
	Preset,
	Field,
	DynamicField,
}

// TODO: move to utils types

export interface TableColumn<RowData = unknown> {
	label: string;
	value?: string;
	component?: (value: any, rowData: RowData, rowIndex: number) => ReactNode;
	headerComponent?: (value: any) => ReactNode;
	format?: (value: any, col: TableColumn<RowData>, rowData: RowData, rowIndex: number) => string;
	hidden?: boolean;
	disabled?: boolean;
	disableSorting?: boolean;
	classList?: string[];
	fallback?: string;
}

export interface FilterItem {
	key: string;
	valuePrefix: string;
	value: string;
}

export interface Tab {
	id?: string;
	name: string;
	target: string;
	active: boolean;
	disabled?: boolean;
}

export type FormikChildrenFn<Values = FormikValues> = (
	formikProps: FormikProps<Values>
) => ReactNode;

export interface SelectOption {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface TabsLinkProps {
	href: string;
}
