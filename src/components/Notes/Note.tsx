import React, { useState } from "react";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArchiveOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

import useStore from "../../store/googleStore";
import { NoteType } from "../../type";
const NoteCard = styled(Card)`
  box-shadow: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }
`;

const Note = ({
  note,
  isSelected,
  toggleSelect,
}: {
  note: NoteType;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const { archiveNote, deleteNote, togglePinNotes } = useStore();
  return (
    <NoteCard
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        border: isSelected ? "2px solid black" : "1px solid grey",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Checkbox
        sx={{ visibility: showActions || isSelected ? "visible" : "hidden" }}
        checked={isSelected}
        onChange={() => toggleSelect(note.id)}
        style={{ position: "absolute", top: 0, right: 0 }}
      />
      <CardContent sx={{ wordWrap: "break-word" }}>
        <Typography>{note.title}</Typography>
        <Typography>{note.text}</Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}
      >
        <Tooltip title={note.isPinned ? "Unpin" : "Pin"}>
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => togglePinNotes(note.id)}
          >
            <PushPinOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Archive">
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => archiveNote(note.id)}
          >
            <ArchiveOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => deleteNote(note.id, true)}
          >
            <DeleteOutlineOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </NoteCard>
  );
};

export default Note;
