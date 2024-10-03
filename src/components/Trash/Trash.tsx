import React, { useState, useContext } from 'react';

import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Typography,
    Tooltip,
} from '@mui/material';

import { styled } from '@mui/material/styles';

import { DeleteForeverOutlined, RestoreFromTrashOutlined } from '@mui/icons-material';
import useStore from '../../store/googleStore'


const TrashCard = styled(Card)`
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

const Trash = ({ trash }:  {
    id: string;
    title: string;
    text: string;
  }) => {

    const [showActions, setShowActions] = useState(false);
    const { restoreNote,permanentlyDeleteNote } = useStore();


    return (
        <React.Fragment>
            <TrashCard
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <CardContent sx={{ wordWrap: "break-word" }}>
                    <Typography>{trash.title}</Typography>
                    <Typography>{trash.text}</Typography>
                </CardContent>
                <CardActions>
                  
                    <Tooltip title="Restore">
                        <IconButton
                            sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                            onClick={() => restoreNote(trash.id,false)}
                        >
                            <RestoreFromTrashOutlined fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete permanent">
                        <IconButton
                            sx={{ visibility: showActions ? 'visible' : 'hidden' }}
                            onClick={() => permanentlyDeleteNote(trash.id)}
                        >
                            <RestoreFromTrashOutlined fontSize='small' />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </TrashCard>

           
        </React.Fragment>
    )
}

export default Trash;