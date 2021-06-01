import {
	CreatePresetPayload,
	FieldTypeListModel,
	PresetDetailModel,
	PresetListModel,
} from '@redactie/content-types-module';
import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { ContextHeaderTab, FilterItem } from '@redactie/utils';

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
	onReset: () => void;
	onDelete: (data: CreatePresetPayload['data'] | PresetDetailModel) => void;
	onSubmit: (data: CreatePresetPayload['data'] | PresetDetailModel, tab: Tab) => void;
}

export enum PageType {
	Preset,
	Field,
	DynamicField,
}

export interface Tab extends ContextHeaderTab {
	containerId: string;
}

export interface OverviewFilterItem extends FilterItem {
	filterKey: string;
}
