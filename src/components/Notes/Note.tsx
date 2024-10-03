import React, { useState, useContext } from 'react';

import { Card, CardActions, CardContent, IconButton, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ArchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';

import useStore from '../../store/googleStore'

const NoteCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;

    &:hover {
        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
    }
`;

const Note = ({ note }:  {
    id: string;
    title: string;
    text: string;
  }) => {

    const [showActions, setShowActions] = useState(false);
    const { archiveNote ,deleteNote} = useStore()


 

    return (
        <NoteCard
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <CardContent sx={{ wordWrap: "break-word" }}>
                <Typography>{note.title}</Typography>
                <Typography>{note.text}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}>
                <Tooltip title="Archive">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => archiveNote(note.id)}
                    >
                        <ArchiveOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                        onClick={() => deleteNote(note.id)}
                    >
                        <DeleteOutlineOutlined fontSize='small' />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </NoteCard>
    )
}

export default Note;