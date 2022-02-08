/* eslint-disable react/require-default-props */
import React, { FunctionComponent } from 'react';
import { Box, Typography } from '@material-ui/core';
import { useSafeIntl } from 'bluesquare-components';
import { ConvertedLqasImData, RoundString } from '../../constants/types';
import MESSAGES from '../../constants/messages';
import {
    convertStatToPercent,
    totalCaregivers,
    totalCaregiversInformed,
} from '../../utils/LqasIm';

type Props = {
    campaign?: string;
    round: RoundString;
    data: Record<string, ConvertedLqasImData>;
};

export const CaregiversTableHeader: FunctionComponent<Props> = ({
    campaign,
    round,
    data,
}) => {
    const { formatMessage } = useSafeIntl();
    const dataForRound =
        data && campaign && data[campaign] ? data[campaign][round] : [];
    return (
        <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
                {`${formatMessage(
                    MESSAGES.totalCaregiversSurveyed,
                )}: ${totalCaregivers(dataForRound)}`}
            </Typography>
            <Typography variant="h6">
                {`${formatMessage(
                    MESSAGES.ratioCaregiversInformed,
                )}: ${convertStatToPercent(
                    totalCaregiversInformed(dataForRound),
                    totalCaregivers(dataForRound),
                )}`}
            </Typography>
        </Box>
    );
};
