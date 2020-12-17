import { Breadcrumb } from '@redactie/redactie-core';
import { useObservable } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { contentTypesConnector } from '../../../connectors';

const PresetBreadCrumb: FC<Breadcrumb> = ({ match }) => {
	const { presetUuid } = match?.params || {};

	const presetObservable = useMemo(
		() => contentTypesConnector.presetsFacade.selectPreset(presetUuid),
		[presetUuid]
	);
	const preset = useObservable(presetObservable);

	return preset?.data.label ? <>{preset.data.label}</> : null;
};

export default PresetBreadCrumb;
