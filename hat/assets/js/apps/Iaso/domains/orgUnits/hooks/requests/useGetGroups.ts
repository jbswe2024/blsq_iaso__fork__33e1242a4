import { useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';
// @ts-ignore
import { useSnackQuery } from 'Iaso/libs/apiHooks.ts';
// @ts-ignore
import { getRequest } from 'Iaso/libs/Api';
import { DropdownOptions } from '../../../../types/utils';

import MESSAGES from '../../messages';
import { staleTime } from '../../config';

type Props = {
    dataSourceId?: number;
    sourceVersionId?: number;
};

const makeGroupsQueryParams = ({ dataSourceId, sourceVersionId }) => {
    if (sourceVersionId) return `?version=${sourceVersionId}`;
    if (dataSourceId) return `?dataSource=${dataSourceId}`;
    return '';
};

export const useGetGroups = ({
    dataSourceId,
    sourceVersionId,
}: Props): UseQueryResult<DropdownOptions<string>[], Error> => {
    const groupsQueryParams = makeGroupsQueryParams({
        dataSourceId,
        sourceVersionId,
    });
    return useSnackQuery({
        queryKey: ['groups', dataSourceId, groupsQueryParams],
        queryFn: () => getRequest(`/api/groups/${groupsQueryParams}`),
        snackErrorMsg: MESSAGES.fetchGroupsError,
        options: {
            staleTime,
            select: data => {
                if (!data) return [];
                return data.groups.map(group => {
                    return {
                        value: group.id,
                        label: group.name,
                        original: group,
                    };
                });
            },
        },
    });
};
