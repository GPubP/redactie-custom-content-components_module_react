import {
	CreatePresetPayload,
	FieldTypeListModel,
	PresetDetailModel,
	PresetListModel,
} from '@redactie/content-types-module';
import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode } from 'react';

export interface ModuleProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface RouteParams {
	presetUuid: string;
}

export interface RouteProps<Params = RouteParams> extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface CustomCCDetailRouteParams {
	presetUuid: string;
	contentComponentUuid: string;
	dynamicContentComponentUuid: string;
}

export interface DetailRouteProps<Params = CustomCCDetailRouteParams>
	extends RouteConfigComponentProps<Params> {
	readonly allowedPaths?: string[];
	readonly fieldsHaveChanged: boolean;
	readonly fieldTypes: FieldTypeListModel[];
	readonly preset: PresetDetailModel;
	readonly presets: PresetListModel[];
	readonly create: boolean;
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
	containerId: string;
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

export interface ContextHeaderBadge {
	name: string;
	type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}
