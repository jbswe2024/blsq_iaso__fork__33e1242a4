import React, { FunctionComponent } from 'react';
import { Grid, Box } from '@material-ui/core';
import { useTheme, Theme } from '@material-ui/core/styles';

import {
    // @ts-ignore
    Table,
    // @ts-ignore
    useSafeIntl,
} from 'bluesquare-components';

import { ColorPicker } from '../../../components/forms/ColorPicker';

import { AssignmentsMap } from './AssignmentsMap';

import { AssignmentsApi } from '../types/assigment';
import { Planning } from '../types/planning';
import { Team, DropdownTeamsOptions } from '../types/team';
import { Column } from '../../../types/table';
import { IntlFormatMessage } from '../../../types/intl';

import { teamsColors } from '../constants/teamColors';

import MESSAGES from '../messages';

type Props = {
    assignments: AssignmentsApi;
    planning: Planning | undefined;
    currentTeam: Team | undefined;
    teams: DropdownTeamsOptions[];
    // eslint-disable-next-line no-unused-vars
    setTeamColor: (color: string, teamId: number) => void;
};

const getColumns = (
    formatMessage: IntlFormatMessage,
    assignments: AssignmentsApi,
    teams: DropdownTeamsOptions[],
    // eslint-disable-next-line no-unused-vars
    setTeamColor: (color: string, teamId: number) => void,
    theme: Theme,
): Column[] => {
    return [
        {
            Header: formatMessage(MESSAGES.name),
            id: 'name',
            accessor: 'name',
        },
        {
            Header: formatMessage(MESSAGES.color),
            id: 'color',
            accessor: 'color',
            Cell: settings => {
                const fullTeam = teams.find(
                    team => team.original.id === settings.row.original.id,
                );
                return (
                    <>
                        <Box display="flex" justifyContent="center">
                            <ColorPicker
                                currentColor={
                                    fullTeam?.color ?? theme.palette.grey[500]
                                }
                                colors={teamsColors.filter(
                                    color =>
                                        !fullTeam ||
                                        (fullTeam && color !== fullTeam.color),
                                )}
                                displayLabel={false}
                                onChangeColor={color =>
                                    setTeamColor(
                                        color,
                                        settings.row.original.id,
                                    )
                                }
                            />
                        </Box>
                    </>
                );
            },
        },
        {
            Header: formatMessage(MESSAGES.assignationsCount),
            id: 'assignationsCount',
            accessor: 'assignationsCount',
            Cell: settings => {
                return (
                    <div>
                        {
                            assignments.filter(
                                assignment =>
                                    assignment.team ===
                                    settings.row.original.id,
                            ).length
                        }
                    </div>
                );
            },
        },
    ];
};

export const AssignmentsMapTab: FunctionComponent<Props> = ({
    assignments,
    planning,
    currentTeam,
    teams,
    setTeamColor,
}) => {
    const { formatMessage } = useSafeIntl();
    const theme: Theme = useTheme();
    return (
        <Grid container spacing={2}>
            <Grid item xs={5}>
                <Table
                    data={currentTeam?.sub_teams_details || []}
                    showPagination={false}
                    defaultSorted={[{ id: 'name', desc: false }]}
                    countOnTop={false}
                    marginTop={false}
                    columns={getColumns(
                        formatMessage,
                        assignments,
                        teams,
                        setTeamColor,
                        theme,
                    )}
                    count={currentTeam?.sub_teams_details?.length ?? 0}
                    onTableParamsChange={p =>
                        console.log('onTableParamsChange', p)
                    }
                />
            </Grid>
            <Grid item xs={7}>
                <AssignmentsMap
                    assignments={assignments}
                    planning={planning}
                    teams={teams}
                />
            </Grid>
        </Grid>
    );
};
