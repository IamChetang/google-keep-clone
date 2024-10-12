import React, { useEffect, useState } from "react";

import Archive from "./Archive";

import { Box, Typography, Container, Grid } from "@mui/material";
import { ArchiveOutlined } from "@mui/icons-material";
import { NoteType } from "../../type";
import { useCreateInputOption } from "../../hooks/callingNotesFromfirebase";
import { useLocation } from "react-router-dom";

const Archives = () => {
  const [fetchedNotes, setFetchedNotes] = useState<NoteType[]>([]);
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: any = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    fetchNotes({ collectionName: "archivedNotes", searchTerm: params.search });
  }, [location.search]);
  const { mutate: fetchNotes } = useCreateInputOption({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  useEffect(() => {
    fetchNotes({ collectionName: "archivedNotes" });
  }, []);
  return (
    <React.Fragment>
      {fetchedNotes.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "8rem",
          }}
        >
          <ArchiveOutlined
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
            Your archived notes appear here
          </Typography>
        </Box>
      ) : (
        <Container maxWidth="lg">
          <Grid spacing={2} container>
            {fetchedNotes.map((archiveNote) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Archive
                  setFetchedNotes={setFetchedNotes}
                  archiveNote={archiveNote}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </React.Fragment>
  );
};

export default Archives;
