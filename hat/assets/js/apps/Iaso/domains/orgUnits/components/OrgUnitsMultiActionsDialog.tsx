import React, { FunctionComponent, useState } from 'react';
import { UseMutateAsyncFunction } from 'react-query';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    makeStyles,
    Box,
    Grid,
    Typography,
} from '@material-ui/core';
import {
    // @ts-ignore
    commonStyles,
    // @ts-ignore
    formatThousand,
    // @ts-ignore
    useSafeIntl,
} from 'bluesquare-components';
// @ts-ignore
import { useCurrentUser } from 'Iaso/utils/usersUtils';
import { useGetOrgUnitTypes } from '../hooks/requests/useGetOrgUnitTypes';

import MESSAGES from '../messages';
import InputComponent from '../../../components/forms/InputComponent';
import ConfirmDialog from '../../../components/dialogs/ConfirmDialogComponent';
import { compareGroupVersions, decodeSearch } from '../utils';
import { useGetGroups } from '../hooks';
import { OrgUnitParams, OrgUnit } from '../types/orgUnit';
import { SaveData } from '../types/saveMulti';
import { Selection } from '../types/selection';
import { Group } from '../types/group';
import { OrgunitType } from '../types/orgunitTypes';

type Props = {
    open: boolean;
    params: OrgUnitParams;
    closeDialog: () => void;
    selection: Selection<OrgUnit>;
    saveMulti: UseMutateAsyncFunction<unknown, unknown, unknown, unknown>;
};

const useStyles = makeStyles(theme => ({
    ...commonStyles(theme),
    paper: {
        overflow: 'visible',
    },
    title: {
        paddingBottom: 0,
    },
    content: {
        overflow: 'visible',
        paddingBottom: theme.spacing(2),
    },
    action: {
        paddingBottom: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

const stringOfIdsToArrayofIds = stringValue =>
    !stringValue || stringValue === ''
        ? []
        : stringValue.split(',').map(s => parseInt(s, 10));

export const OrgUnitsMultiActionsDialog: FunctionComponent<Props> = ({
    open,
    closeDialog,
    selection: { selectCount, selectedItems, unSelectedItems, selectAll },
    params,
    saveMulti,
}) => {
    const { formatMessage } = useSafeIntl();
    const classes: Record<string, string> = useStyles();
    const { data: orgUnitTypes } = useGetOrgUnitTypes();
    const [editGroups, setEditGroups] = useState<boolean>(false);
    const [groupsAdded, setGroupsAdded] = useState<Group[]>([]);
    const [groupsRemoved, setGroupsRemoved] = useState<Group[]>([]);
    const [editOrgUnitType, setEditOrgUnitType] = useState<boolean>(false);
    const [orgUnitType, setOrgUnitType] = useState<OrgunitType | undefined>(
        undefined,
    );
    const [editValidation, setEditValidation] = useState<boolean>(false);
    const [validationStatus, setValidationStatus] = useState<
        string | undefined
    >(undefined);

    const currentUser = useCurrentUser();
    const { groups = [], isFetchingGroups } = useGetGroups({
        dataSourceId: currentUser?.account?.default_version?.data_source?.id,
        sourceVersionId: currentUser?.account?.default_version?.id,
    });
    const isSaveDisabled = () =>
        (editGroups &&
            groupsAdded.length === 0 &&
            groupsRemoved.length === 0) ||
        (editOrgUnitType && !orgUnitType) ||
        (editValidation && validationStatus === null) ||
        (!editGroups && !editOrgUnitType && !editValidation);
    const groupsWithoutAdded = [...groups].filter(
        g => groupsAdded.indexOf(g.id) === -1,
    );
    const handleSetEditGroups = editEnabled => {
        if (!editEnabled) {
            setGroupsAdded([]);
            setGroupsRemoved([]);
        }
        setEditGroups(editEnabled);
    };
    const handleSetEditOuType = editEnabled => {
        if (!editEnabled) {
            setEditOrgUnitType(false);
        }
        setEditOrgUnitType(editEnabled);
    };
    const handleSetEditValidation = editEnabled => {
        if (!editEnabled) {
            setValidationStatus(undefined);
        }
        setEditValidation(editEnabled);
    };
    const closeAndReset = () => {
        setEditGroups(false);
        setGroupsAdded([]);
        setGroupsRemoved([]);
        setEditOrgUnitType(false);
        setOrgUnitType(undefined);
        setEditValidation(false);
        setValidationStatus(undefined);
        closeDialog();
    };
    const saveAndReset = () => {
        const data: SaveData = {};
        if (editGroups) {
            if (groupsAdded.length > 0) {
                data.groups_added = groupsAdded;
            }
            if (groupsRemoved.length > 0) {
                data.groups_removed = groupsRemoved;
            }
        }
        if (editOrgUnitType) {
            data.org_unit_type = orgUnitType;
        }
        if (editValidation) {
            data.validation_status = validationStatus;
        }
        if (!selectAll) {
            data.selected_ids = selectedItems.map(i => i.id);
        } else {
            data.select_all = true;
            data.unselected_ids = unSelectedItems.map(i => i.id);
            // TODO : taken from OrgUnitsFiltersComponent to match
            // their fix but not a fan we should change it
            // when we refactor the search, probably set orgUnitParentId
            // directly in the onchange of OrgUnitTreeviewModal.
            const searches = decodeSearch(params.searches);
            searches.forEach((s, i) => {
                searches[i].orgUnitParentId = searches[i].levels;
            });
            data.searches = searches;
        }
        saveMulti(data).then(() => closeAndReset());
    };
    return (
        <>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={open}
                classes={{
                    paper: classes.paper,
                }}
                onClose={(event, reason) => {
                    if (reason === 'backdropClick') {
                        closeAndReset();
                    }
                }}
                scroll="body"
            >
                <DialogTitle className={classes.title}>
                    {formatMessage(MESSAGES.multiEditTitle)}
                    {` (${formatThousand(selectCount)} `}
                    {selectCount === 1 && formatMessage(MESSAGES.titleSingle)}
                    {selectCount > 1 && formatMessage(MESSAGES.titleMulti)})
                </DialogTitle>
                <DialogContent className={classes.content}>
                    <div>
                        <InputComponent
                            keyValue="editGroups"
                            onChange={(key, checked) =>
                                handleSetEditGroups(checked)
                            }
                            value={editGroups}
                            type="checkbox"
                            label={MESSAGES.editGroups}
                        />
                        {editGroups && (
                            <>
                                <InputComponent
                                    multi
                                    clearable
                                    keyValue="addGroups"
                                    onChange={(key, value) =>
                                        setGroupsAdded(
                                            stringOfIdsToArrayofIds(value),
                                        )
                                    }
                                    value={
                                        groupsAdded.length > 0
                                            ? groupsAdded
                                            : null
                                    }
                                    type="select"
                                    loading={isFetchingGroups}
                                    options={groups
                                        .sort(compareGroupVersions)
                                        .map(g => ({
                                            label: `${g.name} - Version: ${g.source_version.number}`,
                                            value: g.id,
                                        }))}
                                    label={MESSAGES.addToGroups}
                                />
                                <InputComponent
                                    multi
                                    clearable
                                    keyValue="removeGroups"
                                    onChange={(key, value) =>
                                        setGroupsRemoved(
                                            stringOfIdsToArrayofIds(value),
                                        )
                                    }
                                    value={
                                        groupsRemoved.length > 0
                                            ? groupsRemoved
                                            : null
                                    }
                                    type="select"
                                    options={groupsWithoutAdded.map(g => ({
                                        label: `${g.name} - Version: ${g.source_version.number}`,
                                        value: g.id,
                                    }))}
                                    label={MESSAGES.removeFromGroups}
                                />
                            </>
                        )}
                    </div>
                    <div>
                        <InputComponent
                            keyValue="editOrgUnitType"
                            onChange={(key, checked) =>
                                handleSetEditOuType(checked)
                            }
                            value={editOrgUnitType}
                            type="checkbox"
                            label={MESSAGES.editOrgUnitType}
                        />
                        {editOrgUnitType && (
                            <InputComponent
                                multi={false}
                                clearable
                                keyValue="changeOrgUnitType"
                                onChange={(key, value) => setOrgUnitType(value)}
                                value={orgUnitType}
                                type="select"
                                options={orgUnitTypes || []}
                                label={MESSAGES.org_unit_type}
                                isSearchable
                            />
                        )}
                    </div>
                    <div>
                        <InputComponent
                            keyValue="editValidation"
                            onChange={(key, checked) =>
                                handleSetEditValidation(checked)
                            }
                            value={editValidation}
                            type="checkbox"
                            label={MESSAGES.editValidation}
                        />
                        {editValidation && (
                            <div className={classes.marginLeft}>
                                <InputComponent
                                    keyValue="isValid"
                                    onChange={(key, value) => {
                                        setValidationStatus(value);
                                    }}
                                    value={validationStatus}
                                    type="radio"
                                    options={[
                                        {
                                            value: 'NEW',
                                            label: formatMessage(MESSAGES.new),
                                        },
                                        {
                                            value: 'VALID',
                                            label: formatMessage(
                                                MESSAGES.valid,
                                            ),
                                        },
                                        {
                                            value: 'REJECTED',
                                            label: formatMessage(
                                                MESSAGES.rejected,
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
                <DialogActions className={classes.action}>
                    <Button onClick={closeAndReset} color="primary">
                        {formatMessage(MESSAGES.cancel)}
                    </Button>

                    <ConfirmDialog
                        btnMessage={formatMessage(MESSAGES.validate)}
                        question={
                            <Grid direction="column" container>
                                <Grid item>
                                    <Box>
                                        {formatMessage(
                                            MESSAGES.confirmMultiChange,
                                        )}
                                        <>🚨</>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box>
                                        <Typography variant="body2">
                                            {formatMessage(
                                                MESSAGES.bulkChangeCount,
                                                {
                                                    count: `${selectedItems.length}`,
                                                },
                                            )}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        }
                        confirm={() => saveAndReset()}
                        btnDisabled={isSaveDisabled()}
                        btnVariant="text"
                    />
                </DialogActions>
            </Dialog>
        </>
    );
};
