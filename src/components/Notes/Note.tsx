import React, { useEffect, useState } from "react";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
  Checkbox,
  Modal,
  Grid,
  Box,
  Chip,
  Menu,
  MenuItem,
  TextField,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArchiveOutlined,
  DeleteOutlineOutlined,
 
} from "@mui/icons-material";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { labelType, NoteType } from "../../type";
import {
  useAddLabelToNotes,
  useAddOrDeleteLabelToNotes,
  useChangeBackGroundColor,
  useGetLabels,
  useMoveNoteArchive,
  useMoveNoteToDelete,
  useTogglePinNotes,
} from "../../hooks/callingNotesFromfirebase";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LabelIcon from "@mui/icons-material/Label";
const NoteCard = styled(Card)`
  box-shadow: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }
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
const Note = ({
  note,
  isSelected,
  toggleSelect,
  setFetchedNotes,
}: {
  note: NoteType;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
  setFetchedNotes: (data: NoteType[]) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [getLabel, setGetLabel] = useState<labelType[]>([]);
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

  const { mutate: archiveNote } = useMoveNoteArchive({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  const { mutate: deleteNote } = useMoveNoteToDelete({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  const { mutate: togglePinNotes } = useTogglePinNotes({
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
        getLabels();
      }
    },
  });
  const { mutate: getLabels } = useGetLabels({
    onSuccess: (data) => {
      if (data) {
        setGetLabel(data);
      }
    },
  });
  const { mutate: addOrDeleteLabelToNotes } = useAddOrDeleteLabelToNotes({
    onSuccess: (data) => {
      if (data) {
        setFetchedNotes(data);
      }
    },
  });
  const handleChange = (event: any) => {
    console.log(event.target.checked);

    addOrDeleteLabelToNotes({
      id: note.id,
      collectionName: "notes",
      label: event.target.name,
      action: event.target.checked,
    });
  };
  useEffect(() => {
    getLabels();
  }, []);
  return (
    <NoteCard
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        border: isSelected ? "2px solid black" : "1px solid grey",
        cursor: "pointer",
        position: "relative",
        backgroundColor: note.background,
        transition: "background-color 0.3s ease",
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
        {note?.labels ? (
          <div style={{ marginTop: "0.5rem" }}>
            {note.labels.map(
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
        <Tooltip title={note.isPinned ? "Unpin" : "Pin"}>
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => {
              togglePinNotes(note.id);
            }}
          >
            <PushPinOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Archive">
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => {
              archiveNote({
                id: note.id,
                collectionName: "notes",
                action: "archive",
              });
            }}
          >
            <ArchiveOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            sx={{ visibility: showActions ? "visible" : "hidden" }}
            onClick={() => {
              deleteNote({ id: note.id, fromNotes: true });
            }}
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
                      id: note.id,
                      collectionName: "notes",
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
                id: note.id,
                collectionName: "notes",
                label: newLabel,
              }),
                setNewLabel("");
            }}
          >
            <LabelIcon />
          </IconButton>
        </MenuItem>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            marginTop: 1,
          }}
        >
          {getLabel.map((value: any, index: React.Key | null | undefined) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={note.labels?.some(
                    (data: any) => value.label === data.label
                  )}
                  onChange={handleChange}
                  name={value.label}
                />
              }
              label={value.label}
            />
          ))}
        </Box>
      </Menu>
    </NoteCard>
  );
};

export default Note;
