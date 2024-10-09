import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { ArchiveOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import useStore from "../store/googleStore";

interface SelectionBarProps {
  selectedCards: string[];
  sendDataToParent: any;
}
const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCards,
  sendDataToParent,
}) => {
  const { archiveMultipleNotes } = useStore();
  return (
    <React.Fragment>
      {selectedCards.length !== 0 ? (
        <AppBar
          color="default"
          style={{ zIndex: "2000", position: "absolute", top: 0, left: 0 }}
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
