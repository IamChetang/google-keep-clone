import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ArchiveOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import { NoteType } from "../../type";
import { useMultipleMoveNoteArchive } from "../../hooks/callingNotesFromfirebase";
const SelectionBar = ({
  selectedCards,
  sendDataToParent,
  setFetchedNotes,
}: {
  selectedCards: string[];
  sendDataToParent: any;
  setFetchedNotes: (data: NoteType[]) => void;
}) => {
  const { mutate: archiveMultipleNotes } = useMultipleMoveNoteArchive({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
        sendDataToParent([]);
      }
    },
  });
  return (
    <React.Fragment>
      {selectedCards.length !== 0 ? (
        <AppBar
          color="default"
          style={{ zIndex: "2000", position: "fixed", top: 0, left: 0 }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="close">
              <CloseIcon onClick={() => sendDataToParent([])} />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1, marginLeft: "8px" }}>
              {selectedCards.length} selected
            </Typography>

            <IconButton color="inherit" aria-label="archive">
              <ArchiveOutlined
                onClick={() => archiveMultipleNotes(selectedCards)}
              />
            </IconButton>

            <IconButton color="inherit" aria-label="more options">
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default SelectionBar;
