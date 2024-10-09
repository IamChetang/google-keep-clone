import React, { useState, useRef } from "react";

import {
  Box,
  Container as MuiContainer,
  ClickAwayListener,
  TextField,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { v4 as uuid } from "uuid";

// import { DataContext } from '../../Context/DataProvider';
import useStore from "../../store/googleStore";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
  padding: 10px 15px;
  border-radius: 8px;
  border-color: "#e0e0e0";
  margin: auto;
  margin-bottom: 2rem;
  min-height: 30px;
`;

const note = {
  id: "",
  title: "",
  text: "",
  isPinned: false,
};

const Form = () => {
  const [showTextField, setShowTextField] = useState(false);
  const [addNote, setAddNote] = useState({ ...note, id: uuid() });
  const { addNotes } = useStore();
  const containerRef: any = useRef();
  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let changedNote = { ...addNote, [e.target.name]: e.target.value };
    setAddNote(changedNote);
  };
  function clickAwaay() {
    setShowTextField(false);
    containerRef.current.style.minHeight = "30px";
    setAddNote({ ...note, id: uuid() });
  }
  return (
    <ClickAwayListener
      onClickAway={() => {
        addNotes(addNote);
        clickAwaay();
      }}
    >
      <MuiContainer maxWidth="sm">
        <Container ref={containerRef}>
          {showTextField && (
            <TextField
              size="small"
              placeholder="Title"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              style={{ marginBottom: 10 }}
              onChange={(e) => onTextChange(e)}
              name="title"
              value={addNote.title}
            />
          )}
          <TextField
            multiline
            placeholder="Take a note..."
            variant="standard"
            InputProps={{ disableUnderline: true }}
            onClick={() => {
              setShowTextField(true);
              containerRef.current.style.minHeight = "70px";
            }}
            onChange={(e) => onTextChange(e)}
            name="text"
            value={addNote.text}
          />
        </Container>
      </MuiContainer>
    </ClickAwayListener>
  );
};

export default Form;
