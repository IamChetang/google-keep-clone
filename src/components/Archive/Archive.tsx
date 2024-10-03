import React, { useState, useContext } from 'react';

import { Card, CardActions, CardContent, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { UnarchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import useStore from '../../store/googleStore'
const ArchiveCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const Archive = ({ archiveNote }:  {
    id: string;
    title: string;
    text: string;
  }) => {

    const [showActions, setShowActions] = useState(false);
    const { restoreNote,deleteNote } = useStore();
 

    return (
        <ArchiveCard
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <CardContent sx={{ wordWrap: "break-word" }}>
                <Typography>{archiveNote.title}</Typography>
                <Typography>{archiveNote.text}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                <Tooltip title="Unarchive">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => restoreNote(archiveNote.id)}
                    >
                        <UnarchiveOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => deleteNote(archiveNote.id,false)}
                    >
                        <DeleteOutlineOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </ArchiveCard>
    )
}

export default Archive;