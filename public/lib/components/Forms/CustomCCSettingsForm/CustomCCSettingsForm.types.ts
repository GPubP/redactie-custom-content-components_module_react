import { FormikProps, FormikValues } from 'formik';
import { ReactNode, Ref } from 'react';

import { FormikChildrenFn } from '../../../customCC.types';
import { PresetDetailModel } from '../../../store/presets';

export interface CustomCCSetingsFormProps {
	children?: FormikChildrenFn<PresetDetailModel> | ReactNode;
	disabled?: boolean;
	formikRef?: Ref<FormikProps<FormikValues>>;
	isUpdate?: boolean;
	preset: PresetDetailModel;
	onSubmit: (values: PresetDetailModel | null) => void;
}
