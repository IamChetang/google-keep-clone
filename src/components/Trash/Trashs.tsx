import React, { useEffect, useState } from "react";

import Trash from "./Trash";
import { Box, Typography, Grid, Container } from "@mui/material";

import { DeleteOutlineOutlined } from "@mui/icons-material";
import { NoteType } from "../../type";
import { useCreateInputOption } from "../../hooks/callingNotesFromfirebase";
import { useLocation } from "react-router-dom";
const Trashs = () => {
  const [fetchedNotes, setFetchedNotes] = useState<NoteType[]>([]);
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: any = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    fetchNotes({ collectionName: "deletedNotes", searchTerm: params.search });
  }, [location.search]);
  const { mutate: fetchNotes } = useCreateInputOption({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  useEffect(() => {
    fetchNotes({ collectionName: "deletedNotes" });
  }, []);
  return (
    <React.Fragment>
      {fetchedNotes.length === 0 ? (
        <React.Fragment>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "8rem",
            }}
          >
            <DeleteOutlineOutlined
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
              No notes in Trash
            </Typography>
          </Box>
        </React.Fragment>
      ) : (
        <Container maxWidth="lg">
          <Grid spacing={2} container>
            {fetchedNotes.map((trash) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Trash setFetchedNotes={setFetchedNotes} trash={trash} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </React.Fragment>
  );
};

export default Trashs;
