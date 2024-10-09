import React, { useState } from 'react';
import SelectionBar from '../Selected.tsx'
import Form from './Form';
import Note from './Note';
import { Box, Typography, Container, Grid } from '@mui/material';
import { LightbulbOutlined } from '@mui/icons-material';
import useFetchNotes from '../../hooks/useFetchNotes';
import { NoteType } from '../../type.ts'
const Notes = () => {
 
    let { notes } = useFetchNotes('notes');
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const toggleSelect = (id: any) => {
        if (selectedCards.includes(id)) {
            setSelectedCards(selectedCards.filter((cardId) => cardId !== id));
        } else {
            setSelectedCards([...selectedCards, id]);
        }
    };
    function handleDataFromChild(data: string[]) {
        setSelectedCards(data);
        
      }
    return (
        <React.Fragment>
            <SelectionBar selectedCards={selectedCards} sendDataToParent={handleDataFromChild}></SelectionBar>
            <Form  />
            {
                notes.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '5rem',
                    }}>
                        <LightbulbOutlined sx={{
                            backgroundSize: '120px 120px',
                            height: '120px',
                            margin: '20px',
                            opacity: '.1',
                            width: '120px',
                        }} />
                        <Typography sx={{ fontSize: '1.375rem' }} align='center' variant="h6" color="#5f6368">
                            Notes you add appear here
                        </Typography>
                    </Box>
                ) :
                    (
                        <Container maxWidth="lg">
                            <Grid spacing={2} container
                            >
                                {
                                    notes.map((note: NoteType, index: number) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}
                                            key={index}
                                        >
                                            <Note note={note} isSelected={selectedCards.includes(note.id)}
                                                toggleSelect={toggleSelect} />
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

export default Notes;