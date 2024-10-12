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

import {
  DeleteForeverOutlined,
  RestoreFromTrashOutlined,
} from "@mui/icons-material";
import useStore from "../../store/googleStore";
import {
  useMoveNoteArchive,
  usePermanentlyDeleteNote,
} from "../../hooks/callingNotesFromfirebase";
import { NoteType } from "../../type";

const TrashCard = styled(Card)`
  box-shadow: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const Trash = ({
  trash,
  setFetchedNotes,
}: {
  trash: {
    id: string;
    title: string;
    text: string;
  };
  setFetchedNotes: (data: NoteType[]) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const { mutate: unArchiveNote } = useMoveNoteArchive({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  const { mutate: permanentlyDeleteNote } = usePermanentlyDeleteNote({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
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
              sx={{ visibility: showActions ? "visible" : "hidden" }}
              onClick={() =>
                unArchiveNote({
                  id: trash.id,
                  collectionName: "deletedNotes",
                  action: "unarchive",
                })
              }
            >
              <RestoreFromTrashOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete permanent">
            <IconButton
              sx={{ visibility: showActions ? "visible" : "hidden" }}
              onClick={() => permanentlyDeleteNote(trash.id)}
            >
              <DeleteForeverOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </TrashCard>
    </React.Fragment>
  );
};

export default Trash;
