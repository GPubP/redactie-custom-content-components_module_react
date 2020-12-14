import { ChildModuleRouteConfig, Location, ModuleRouteConfig } from '@redactie/redactie-core';
import { useMemo } from 'react';
import { matchPath } from 'react-router-dom';

const searchActiveRouteInChildren = (
	routes: ChildModuleRouteConfig[],
	pathToMatch: string
): ChildModuleRouteConfig | null => {
	return routes.reduce((acc, route): ChildModuleRouteConfig | null => {
		if (acc) {
			return acc;
		}

		const matchRoute = matchPath(pathToMatch, {
			path: route.path,
			exact: true,
		});

		if (matchRoute) {
			return route;
		}

		if (route.routes) {
			const childRoute = searchActiveRouteInChildren(route.routes, pathToMatch);

			if (childRoute) {
				return childRoute;
			}
		}

		return acc;
	}, null as ChildModuleRouteConfig | null);
};

const useActiveRouteConfig = (
	location: Location,
	route: ModuleRouteConfig
): ModuleRouteConfig | ChildModuleRouteConfig | null => {
	return useMemo(() => {
		const match = matchPath(location.pathname, {
			path: route.path,
			exact: true,
		});

		if (match) {
			return route;
		}

		if (route.routes) {
			return searchActiveRouteInChildren(route.routes, location.pathname);
		}

		return null;
	}, [location.pathname, route]);
};

export default useActiveRouteConfig;
