import React, { useEffect, useState } from "react";
import SelectionBar from "../selected/Selected.tsx";
import Form from "./Form";
import Note from "./Note";
import { Box, Typography, Container, Grid } from "@mui/material";
import { LightbulbOutlined } from "@mui/icons-material";
import { NoteType } from "../../type.ts";
import { useCreateInputOption } from "../../hooks/callingNotesFromfirebase.ts";
import { useLocation } from "react-router-dom";

const Notes = () => {
  const [fetchedNotes, setFetchedNotes] = useState<NoteType[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: any = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    fetchNotes({ collectionName: "notes", searchTerm: params.search });
  }, [location.search]);

  const { mutate: fetchNotes } = useCreateInputOption({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });

  useEffect(() => {
    fetchNotes({ collectionName: "notes" });
  }, []);

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

  const pinnedNotes = fetchedNotes
    ? fetchedNotes.filter((note) => note.isPinned)
    : [];
  const unpinnedNotes = fetchedNotes
    ? fetchedNotes.filter((note) => !note.isPinned)
    : [];

  return (
    <React.Fragment>
      <SelectionBar
        selectedCards={selectedCards}
        sendDataToParent={handleDataFromChild}
        setFetchedNotes={setFetchedNotes}
      ></SelectionBar>
      <Form setFetchedNotes={setFetchedNotes} />
      {fetchedNotes.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
          }}
        >
          <LightbulbOutlined
            sx={{
              backgroundSize: "120px 120px",
              height: "120px",
              margin: "20px",
              opacity: ".1",
              width: "120px",
            }}
          />
          <Typography
            sx={{ fontSize: "1.375rem" }}
            align="center"
            variant="h6"
            color="#5f6368"
          >
            Notes you add appear here
          </Typography>
        </Box>
      ) : pinnedNotes.length === 0 ? (
        <Container maxWidth="lg">
          <Grid spacing={2} container>
            {fetchedNotes.map((note: NoteType, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Note
                  note={note}
                  isSelected={selectedCards.includes(note.id)}
                  toggleSelect={toggleSelect}
                  setFetchedNotes={setFetchedNotes}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : (
        <>
          <Container maxWidth="lg">
            <h5 style={{ fontWeight: "400" }}>Pinned</h5>
            <Grid spacing={2} container>
              {pinnedNotes.map((note: NoteType, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Note
                    note={note}
                    isSelected={selectedCards.includes(note.id)}
                    toggleSelect={toggleSelect}
                    setFetchedNotes={setFetchedNotes}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
          <Container maxWidth="lg">
            <h5 style={{ fontWeight: "400" }}>
              {unpinnedNotes.length !== 0 ? "Others" : ""}
            </h5>
            <Grid spacing={2} container>
              {unpinnedNotes.map((note: NoteType, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Note
                    note={note}
                    isSelected={selectedCards.includes(note.id)}
                    toggleSelect={toggleSelect}
                    setFetchedNotes={setFetchedNotes}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}
    </React.Fragment>
  );
};

export default Notes;
