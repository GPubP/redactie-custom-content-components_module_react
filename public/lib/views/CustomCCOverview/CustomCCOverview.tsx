import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { FilterForm, FilterFormState } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../customCC.const';
import { FilterItem } from '../../customCC.types';
import { usePresetsPagination } from '../../hooks';

import {
	DEFAULT_FILTER_FORM,
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	OVERVIEW_COLUMNS,
} from './CustomCCOverview.const';
import { OverviewTableRow } from './CustomCCOverview.types';

const CustomCCOverview: FC = () => {
	/**
	 * Hooks
	 */
	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS, false);

	const [filterFormState, setFilterFormState] = useState<FilterFormState>(DEFAULT_FILTER_FORM);
	const [initialLoading, setInitialLoading] = useState(true);

	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);
	const { loading, pagination } = usePresetsPagination(query);

	// Set initial loading
	useEffect(() => {
		if (initialLoading && !loading) {
			setInitialLoading(false);
		}
	}, [initialLoading, loading]);

	// Set initial values with query params
	useEffect(() => {
		if (query.search) {
			setFilterFormState({ ...filterFormState, name: query.search });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const createFilters = (values: FilterFormState): FilterItem[] => {
		return [
			{
				key: 'search',
				valuePrefix: 'Zoekterm',
				value: values.name,
			},
		].filter(f => !!f.value);
	};

	const clearAllFilters = (): void => {
		setQuery({ search: '' });
		setFilterFormState(DEFAULT_FILTER_FORM);
	};

	const clearFilter = (item: FilterItem): void => {
		const filterKey = item.key === 'search' ? 'name' : item.key;
		setQuery({ [item.key]: '' });
		setFilterFormState({
			...filterFormState,
			[filterKey]: '',
		});
	};

	const onPageChange = (page: number): void => {
		setQuery({
			skip: (page - 1) * query.limit,
			page,
		});
	};

	const onOrderBy = ({ key, order }: OrderBy): void => {
		const prefixedOrderBy = { order, key: `data.${key}` };
		setQuery({ sort: parseOrderByToString(prefixedOrderBy) });
	};

	const onApplyFilters = (values: FilterFormState): void => {
		setFilterFormState(values);
		setQuery({ search: values.name });
	};

	const activeSorting = parseStringToOrderBy(query.sort);
	const activeFilters = createFilters(filterFormState);

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		if (!pagination?.data.length) {
			return null;
		}

		const customCCRows: OverviewTableRow[] = pagination?.data.map(preset => ({
			uuid: preset.uuid,
			name: preset.data.label,
			description: `[${preset.data.name}]`,
			active: true,
			navigate,
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={clearAllFilters}
						onSubmit={onApplyFilters}
						clearActiveFilter={clearFilter}
						activeFilters={activeFilters}
					/>
				</div>
				<PaginatedTable
					className="u-margin-top"
					columns={OVERVIEW_COLUMNS(t)}
					rows={customCCRows}
					currentPage={pagination?.currentPage || 1}
					itemsPerPage={query.limit}
					onPageChange={onPageChange}
					orderBy={onOrderBy}
					activeSorting={activeSorting}
					totalValues={pagination?.total || 0}
					loading={loading}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Content componenten">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default CustomCCOverview;
