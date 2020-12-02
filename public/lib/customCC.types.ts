import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';

export interface CustomCCModuleProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}
