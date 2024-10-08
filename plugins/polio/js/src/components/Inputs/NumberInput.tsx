import React, { FunctionComponent } from 'react';
import InputComponent from '../../../../../../hat/assets/js/apps/Iaso/components/forms/InputComponent';

type Props = {
    label: string;
    field: Record<string, any>;
    form: Record<string, any>;
    min?: number;
    max?: number;
};

export const NumberInput: FunctionComponent<Props> = ({
    label,
    field,
    form,
    min,
    max,
}) => (
    <InputComponent
        withMarginTop={false}
        keyValue={field.name}
        type="number"
        value={field.value}
        labelString={label}
        onChange={(_keyValue, value) => {
            form.setFieldValue(field.name, value);
        }}
        min={min}
        max={max}
    />
);
