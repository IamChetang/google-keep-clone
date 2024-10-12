import React, { useState } from "react";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  TextField,
  Menu,
  Modal,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LabelIcon from "@mui/icons-material/Label";
import { styled } from "@mui/material/styles";
import {
  DeleteForeverOutlined,
  RestoreFromTrashOutlined,
} from "@mui/icons-material";
import {
  useAddLabelToNotes,
  useChangeBackGroundColor,
  useMoveNoteArchive,
  usePermanentlyDeleteNote,
} from "../../hooks/callingNotesFromfirebase";
import { NoteType } from "../../type";

const TrashCard = styled(Card)`
  box-shadow: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  p: 3,
};
const Trash = ({
  trash,
  setFetchedNotes,
}: {
  trash: NoteType;
  setFetchedNotes: (data: NoteType[]) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [open, setOpen] = useState<any>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const colors = [
    "#FFFFFF",
    "#F28B82",
    "#FBBC04",
    "#FFF475",
    "#CCFF90",
    "#A7FFEB",
    "#CBF0F8",
    "#AECBFA",
    "#D7AEFB",
    "#FDCFE8",
    "#E6C9A8",
    "#E8EAED",
  ];
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
  const { mutate: changeBackground } = useChangeBackGroundColor({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  const { mutate: handleAddLabel } = useAddLabelToNotes({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  return (
    <React.Fragment>
      <TrashCard
        style={{
          cursor: "pointer",
          position: "relative",
          backgroundColor: trash.background,
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <CardContent sx={{ wordWrap: "break-word" }}>
          <Typography>{trash.title}</Typography>
          <Typography>{trash.text}</Typography>
          {trash?.labels ? (
            <div style={{ marginTop: "0.5rem" }}>
              {trash.labels.map(
                (label: { id: string; label: string }, index: number) => (
                  <Chip
                    key={index}
                    label={label.label}
                    style={{ marginRight: "0.5rem" }}
                  />
                )
              )}
            </div>
          ) : (
            <></>
          )}
        </CardContent>
        <CardActions>
          <Tooltip title="Background">
            <IconButton
              sx={{ visibility: showActions ? "visible" : "hidden" }}
              onClick={() => {
                handleOpen();
              }}
            >
              <ColorLensIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="label">
            <IconButton
              sx={{ visibility: showActions ? "visible" : "hidden" }}
              onClick={(event: any) => setAnchorEl(event.currentTarget)}
            >
              <LabelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Select a Background Color
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              {colors.map((color: any, index: React.Key | null | undefined) => (
                <Grid item key={index}>
                  <div
                    style={{
                      border: index === 0 ? "1px solid grey" : "",
                      backgroundColor: color,
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleClose();
                      changeBackground({
                        id: trash.id,
                        collectionName: "deletedNotes",
                        background: color,
                      });
                    }}
                  ></div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem>
            <TextField
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Enter label"
              variant="standard"
            />
            <IconButton
              onClick={() => {
                handleAddLabel({
                  id: trash.id,
                  collectionName: "deletedNotes",
                  label: newLabel,
                }),
                  setNewLabel(""),
                  setAnchorEl(null);
              }}
            >
              <LabelIcon />
            </IconButton>
          </MenuItem>
        </Menu>
      </TrashCard>
    </React.Fragment>
  );
};

export default Trash;
