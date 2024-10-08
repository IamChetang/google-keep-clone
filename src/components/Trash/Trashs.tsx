import React from 'react';

import Trash from './Trash';
import {
    Box,
    Typography,
    Grid,
    Container,

} from '@mui/material';

import { DeleteOutlineOutlined } from '@mui/icons-material';
import useFetchNotes from '../../hooks/useFetchNotes';
const Trashs = () => {
  
    const { notes} = useFetchNotes('deletedNotes');
    return (
        <React.Fragment>
            {
                notes.length === 0 ? (
                    <React.Fragment>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '8rem',
                        }}>
                            <DeleteOutlineOutlined sx={{
                                backgroundSize: '120px 120px',
                                height: '120px',
                                margin: '20px',
                                opacity: '.1',
                                width: '120px',
                            }} />
                            <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                                No notes in Trash
                            </Typography>
                        </Box>
                    </React.Fragment>
                ) :
                    (
                        <Container maxWidth="lg">
                            <Grid spacing={2} container>
                                {
                                    notes.map(trash => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Trash trash={trash} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Container>
                    )
            }

           
        </React.Fragment >
    )
}

export default Trashs;