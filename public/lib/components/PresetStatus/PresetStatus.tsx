import { Status } from '@acpaas-ui/react-editorial-components';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';

import { PresetStatusProps } from './PresetStatus.types';

const PresetStatus: FC<PresetStatusProps> = ({ active = false }) => {
	const [t] = useCoreTranslation();

	return (
		<>
			{active ? (
				<Status label={t(CORE_TRANSLATIONS.STATUS_ACTIVE)} type="ACTIVE" />
			) : (
				<Status label={t(CORE_TRANSLATIONS['STATUS_NON-ACTIVE'])} type="INACTIVE" />
			)}
		</>
	);
};

export default PresetStatus;
