import React, { useState } from "react";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { UnarchiveOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import {
  useMoveNoteArchive,
  useMoveNoteToDelete,
} from "../../hooks/callingNotesFromfirebase";
import { NoteType } from "../../type";
const ArchiveCard = styled(Card)`
  box-shadow: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const Archive = ({
  archiveNote,
  setFetchedNotes,
}: {
  archiveNote: {
    id: string;
    title: string;
    text: string;
  };
  setFetchedNotes: (data: NoteType[]) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  const { mutate: deleteNote } = useMoveNoteToDelete({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  const { mutate: unArchiveNote } = useMoveNoteArchive({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  return (
    <ArchiveCard
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent sx={{ wordWrap: "break-word" }}>
        <Typography>{archiveNote.title}</Typography>
        <Typography>{archiveNote.text}</Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}
      >
        <Tooltip title="Unarchive">
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() =>
              unArchiveNote({
                id: archiveNote.id,
                collectionName: "archivedNotes",
                action: "unarchive",
              })
            }
          >
            <UnarchiveOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => deleteNote({ id: archiveNote.id, fromNotes: false })}
          >
            <DeleteOutlineOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </ArchiveCard>
  );
};

export default Archive;
