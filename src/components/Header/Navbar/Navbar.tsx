import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { styled } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../../assets/google-keep-logo.png";
import { useLocation } from "react-router-dom";
import useStore from "../../../store/googleStore";

interface NavbarProps {
  open: boolean;
}

const Navbar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<NavbarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#fff",
  boxShadow: "inset 0 -1px 0 0 #dadce0",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));
const Heading = styled(Typography)`
  color: #5f6368;
  font-size: 22px;
  padding: 0 0 0 15px;
`;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
type HeaderProps = {
  handleDrawer: () => void;
  open: boolean;
};
const Header: React.FC<HeaderProps> = ({ handleDrawer, open }) => {
  const [searchText, setSearchText] = useState("");
  const [, setSearchParams] = useSearchParams();

  const { logout } = useStore();
  const location = useLocation();
  const pathName = capitalize(location.pathname.substring(1));
  const navigate = useNavigate();
  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let changedNote = e.target.value;
    setSearchText(changedNote);
    setSearchParams({ search: changedNote });
  };
  return (
    <Navbar open={open}>
      <Toolbar>
        <IconButton onClick={handleDrawer} edge="start" sx={{ marginRight: 5 }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {pathName ? "" : <img src={logo} alt="logo" style={{ width: 30 }} />}
          <Heading>{pathName || "Keep"}</Heading>
        </Box>

        <Box
          ml={4}
          mr="auto"
          display="flex"
          alignItems="center"
          style={{
            backgroundColor: "#f1f3f4",
            padding: "0px 10px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <IconButton edge="start">
            <SearchOutlinedIcon />
          </IconButton>
          <InputBase
            placeholder="Search by title"
            inputProps={{ "aria-label": "search" }}
            style={{ width: "100%" }}
            value={searchText}
            onChange={(e) => onTextChange(e)}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          onClick={() => {
            navigate("/login"), logout();
          }}
        >
          <Avatar style={{ marginLeft: "12px", cursor: "pointer" }}></Avatar>
          {/* <h6 style={{ marginLeft: "12px", cursor: "pointer", color: "black" }}>
            Logout
          </h6> */}
        </Box>
      </Toolbar>
    </Navbar>
  );
};

export default Header;
