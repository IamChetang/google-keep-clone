import { useState } from "react";

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
import { styled } from "@mui/material/styles";
import { UnarchiveOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import {
  useAddLabelToNotes,
  useChangeBackGroundColor,
  useMoveNoteArchive,
  useMoveNoteToDelete,
} from "../../hooks/callingNotesFromfirebase";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LabelIcon from "@mui/icons-material/Label";
import { NoteType } from "../../type";
const ArchiveCard = styled(Card)`
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
const Archive = ({
  archiveNote,
  setFetchedNotes,
}: {
  archiveNote: NoteType;
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
    <ArchiveCard
      style={{
        cursor: "pointer",
        position: "relative",
        backgroundColor: archiveNote.background,
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent sx={{ wordWrap: "break-word" }}>
        <Typography>{archiveNote.title}</Typography>
        <Typography>{archiveNote.text}</Typography>
        {archiveNote?.labels ? (
          <div style={{ marginTop: "0.5rem" }}>
            {archiveNote.labels.map(
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
      <CardActions
        sx={{ display: "flex", justifyContent: "end", marginLeft: "auto" }}
      >
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
                      id: archiveNote.id,
                      collectionName: "archivedNotes",
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
                id: archiveNote.id,
                collectionName: "archivedNotes",
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
    </ArchiveCard>
  );
};

export default Archive;
