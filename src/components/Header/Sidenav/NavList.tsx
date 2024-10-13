import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  TextField,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Button,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import {
  LightbulbOutlined,
  ArchiveOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { makeStyles } from "@mui/styles";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  useAddLabels,
  useDeleteLabels,
  useGetLabels,
} from "../../../hooks/callingNotesFromfirebase";
import { labelType } from "../../../type";
const useStyles = makeStyles({
  sideBarActive: {
    backgroundColor: "#feefc3",
    borderBottomRightRadius: "50px",
    borderTopRightRadius: "50px",
    color: "#000",
  },
  "&:hover": {
    backgroundColor: "#f0f0f0",
    borderBottomRightRadius: "50px",
    borderTopRightRadius: "50px",
  },
});
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  p: 3,
};
const NavList = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarLinks = [
    {
      id: 1,
      label: "Notes",
      icon: <LightbulbOutlined />,
      link: "/",
      isModal: false,
    },
    {
      id: 3,
      label: "Edit label",
      icon: <AddOutlinedIcon />,
      link: "/edit-label",
      isModal: true,
    },
    {
      id: 2,
      label: "Archive",
      icon: <ArchiveOutlined />,
      link: "/archive",
      isModal: false,
    },
    {
      id: 3,
      label: "Bin",
      icon: <DeleteOutlineOutlined />,
      link: "/trash",
      isModal: false,
    },
  ];

  const handleDrawer = () => {
    setOpen(true);
  };

  const [labels, setLabels] = useState<labelType[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddLabel = () => {
    if (newLabel.trim() !== "") {
      addLabels(newLabel);
      setNewLabel("");
    }
  };

  const { mutate: getLabels } = useGetLabels({
    onSuccess: (data) => {
      if (data) {
        setLabels(data);
      }
    },
  });
  const { mutate: addLabels } = useAddLabels({
    onSuccess: (data) => {
      if (data) {
        setLabels(data);
      }
    },
  });
  const { mutate: deleteLabels } = useDeleteLabels({
    onSuccess: (data) => {
      if (data) {
        setLabels(data);
      }
    },
  });
  useEffect(() => {
    getLabels();
  }, []);
  return (
    <List>
      {sidebarLinks.map(
        (list: {
          id: number;
          label: string;
          icon: any;
          link: string;
          isModal: boolean;
        }) => (
          <ListItem
            key={list.id}
            disablePadding
            sx={{ display: "block" }}
            className={
              location.pathname === list.link ? classes.sideBarActive : ""
            }
            onClick={() => {
              list.isModal ? setIsOpen(true) : navigate(list.link);
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={handleDrawer}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {list.icon}
              </ListItemIcon>
              <ListItemText
                primary={list.label}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        )
      )}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={modalStyle}>
          <Typography>Edit Labels</Typography>
          <TextField
            label="Create new label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleAddLabel} variant="contained" color="primary">
            Save
          </Button>
          <List>
            {labels?.map((label, index) => (
              <ListItem key={index}>
                <ListItemText primary={label.label} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => deleteLabels(label.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </Box>
      </Modal>
    </List>
  );
};

export default NavList;
