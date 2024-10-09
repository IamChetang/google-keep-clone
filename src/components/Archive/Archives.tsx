import React from 'react';

import Archive from './Archive';


import { Box, Typography, Container, Grid } from '@mui/material';
import useFetchNotes from '../../hooks/useFetchNotes';
import { ArchiveOutlined } from '@mui/icons-material';

const Archives = () => {
    const { notes} = useFetchNotes('archivedNotes');
    return (
        <React.Fragment>
            {
                notes.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '8rem',
                    }}>
                        <ArchiveOutlined sx={{
                            backgroundSize: '120px 120px',
                            height: '120px',
                            margin: '20px',
                            opacity: '.1',
                            width: '120px',
                        }} />
                        <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                            Your archived notes appear here
                        </Typography>
                    </Box>
                ) :
                    (
                        <Container maxWidth="lg">
                            <Grid spacing={2} container>
                                {
                                    notes.map(archiveNote => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Archive archiveNote={archiveNote} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Container>
                    )
            }
        </React.Fragment>
    )
}

export default Archives;