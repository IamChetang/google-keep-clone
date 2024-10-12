import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Notes from "./components/Notes/Notes";
import Archive from "./components/Archive/Archives";
import Trash from "./components/Trash/Trashs";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Header from "./components/Header/Sidenav/Sidenav";
import PrivateRoute from "./components/PrivateRoute";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

function App() {
  return (
    <>
      <Box style={{ display: "flex", width: "100%" }}>
        <Router>
          <Header />
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ p: 3, width: "100%" }}>
              <DrawerHeader />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Notes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/archive"
                  element={
                    <PrivateRoute>
                      <Archive />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/trash"
                  element={
                    <PrivateRoute>
                      <Trash />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </Box>
    </>
  );
}

export default App;
