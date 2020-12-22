import { Breadcrumb } from '@redactie/redactie-core';
import { useNavigate, useObservable } from '@redactie/utils';
import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { contentTypesConnector } from '../../../connectors';
import { MODULE_PATHS } from '../../../customCC.const';

const PresetBreadCrumb: FC<Breadcrumb> = ({ match }) => {
	const { presetUuid } = match?.params || {};
	const { generatePath } = useNavigate();

	const presetObservable = useMemo(
		() => contentTypesConnector.presetsFacade.selectPreset(presetUuid),
		[presetUuid]
	);
	const preset = useObservable(presetObservable);

	return preset?.data.label ? (
		<Link to={generatePath(MODULE_PATHS.detailCC, match?.params)}>{preset.data.label}</Link>
	) : null;
};

export default PresetBreadCrumb;
