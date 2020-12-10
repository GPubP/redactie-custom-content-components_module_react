import { AlertContainer } from '@redactie/utils';
import React, { FC } from 'react';

import { ALERT_CONTAINER_IDS } from '../../customCC.const';

const CustomCCDetailCC: FC = () => {
	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailCC}
			/>
			<h1>Detail CC</h1>
		</>
	);
};

export default CustomCCDetailCC;
