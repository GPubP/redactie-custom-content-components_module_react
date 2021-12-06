import { Button, Select, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage } from '@redactie/utils';
import classnames from 'classnames';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors';

import { ADD_CC_FORM_VALIDATION_SCHEMA, FIELD_TYPES_DEFAULT_OPTION } from './AddCCForm.const';
import { AddCCFormProps } from './AddCCForm.types';

const AddCCForm: FC<AddCCFormProps> = ({
	className,
	fieldTypeOptions,
	formState,
	onSubmit,
	preset,
}) => {
	const [t] = useCoreTranslation();

	return (
		<Formik
			initialValues={formState}
			validationSchema={ADD_CC_FORM_VALIDATION_SCHEMA(preset)}
			onSubmit={onSubmit}
		>
			{({ submitForm }) => (
				<div className={classnames(className, 'row')}>
					<div className="col-xs-12 col-md u-margin-bottom-xs">
						<Field
							required
							id="fieldType"
							label="Selecteer"
							name="fieldType"
							options={[FIELD_TYPES_DEFAULT_OPTION, ...fieldTypeOptions]}
							as={Select}
						/>
						<small className="u-block u-text-light u-margin-top-xs">
							Selecteer een content component van een bepaald type.
						</small>
						<ErrorMessage name="fieldType" />
					</div>

					<div className="col-xs-12 col-md u-margin-bottom-xs">
						<Field
							required
							as={TextField}
							description="Kies een gebruiksvriendelijk label, bijvoorbeeld 'Titel'."
							id="name"
							label="Naam"
							name="name"
							placeholder="Typ een naam"
							type="text"
						/>
						<ErrorMessage name="name" />
					</div>

					<div className="u-flex-shrink-md col-xs-12 col-sm-4 u-margin-top">
						<Button htmlType="button" onClick={submitForm} outline>
							{t(CORE_TRANSLATIONS.BUTTON_ADD)}
						</Button>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default AddCCForm;
