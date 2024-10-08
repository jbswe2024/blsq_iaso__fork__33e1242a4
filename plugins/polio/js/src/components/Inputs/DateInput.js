import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { DatePicker } from 'bluesquare-components';
import { get } from 'lodash';
import { apiDateFormat } from 'Iaso/utils/dates.ts';

import MESSAGES from '../../constants/messages';

export const DateInput = ({ field, form, label, required }) => {
    const hasError =
        form.errors &&
        Boolean(get(form.errors, field.name) && get(form.touched, field.name));
    return (
        <Box mb={2}>
            <DatePicker
                label={label}
                required={required}
                clearMessage={MESSAGES.clear}
                currentDate={field.value || null}
                errors={hasError ? [get(form.errors, field.name)] : []}
                onChange={date => {
                    form.setFieldTouched(field.name, true);
                    form.setFieldValue(
                        field.name,
                        date ? date.format(apiDateFormat) : null,
                    );
                }}
            />
        </Box>
    );
};
DateInput.defaultProps = {
    required: false,
};

DateInput.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
};
