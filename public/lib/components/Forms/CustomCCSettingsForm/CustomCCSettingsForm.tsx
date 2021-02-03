import { Textarea, TextField } from '@acpaas-ui/react-components';
import { PresetDetailModel } from '@redactie/content-types-module';
import { CopyValue, ErrorMessage, FormikOnChangeHandler } from '@redactie/utils';
import { Field, Formik, isFunction } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors';
import { FormikChildrenFn } from '../../../customCC.types';
import { getFieldState } from '../../../helpers';

import { CUSTOM_CC_SETTINGS_VALIDATION_SCHEMA } from './CustomCCSettingsForm.const';
import { CustomCCSetingsFormProps } from './CustomCCSettingsForm.types';

const CustomCCSettingsForm: FC<CustomCCSetingsFormProps> = ({
	children,
	disabled = false,
	formikRef,
	preset,
	onSubmit,
	onChange,
}) => {
	/**
	 * Hooks
	 */

	const [t] = useCoreTranslation();

	/**
	 * Render
	 */

	return (
		<Formik
			innerRef={instance => isFunction(formikRef) && formikRef(instance)}
			initialValues={preset}
			onSubmit={onSubmit}
			validationSchema={CUSTOM_CC_SETTINGS_VALIDATION_SCHEMA}
		>
			{formikProps => {
				const { errors, touched } = formikProps;

				return (
					<>
						<FormikOnChangeHandler
							onChange={values => onChange(values as PresetDetailModel)}
						/>
						<div className="row">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										description="Geef het content component een korte en duidelijke naam."
										disabled={disabled}
										id="data.label"
										label="Naam"
										name="data.label"
										required
										state={getFieldState(touched, errors, 'data.label')}
									/>
									<ErrorMessage component="p" name="data.label" />
								</div>
							</div>
						</div>
						<div className="row u-margin-bottom-lg">
							<div className="col-xs-12 u-margin-top">
								<Field
									as={Textarea}
									id="data.description"
									label="Beschrijving"
									name="data.description"
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Geef het content component een duidelijke beschrijving voor in
									het overzicht.
								</small>
							</div>
						</div>
						{preset.uuid && (
							<div className="row u-margin-top">
								<CopyValue
									label="UUID"
									value={preset.uuid}
									buttonText={t(CORE_TRANSLATIONS.GENERAL_COPY)}
									className="col-xs-12"
								/>
							</div>
						)}
						{typeof children === 'function'
							? (children as FormikChildrenFn<PresetDetailModel>)(formikProps)
							: children}
					</>
				);
			}}
		</Formik>
	);
};

export default CustomCCSettingsForm;
