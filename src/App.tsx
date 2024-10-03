
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Notes from "./components/Notes/Notes"
import Archive from "./components/Archive/Archives"
import Trash from "./components/Trash/Trashs"
import Header from "./components/Header/Sidenav/Sidenav"

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

function App() {
  return (
    <>
    <Box style={{ display: 'flex', width: '100%' }}>
      <Router>
        <Header />
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ p: 3, width: '100%' }}>
            <DrawerHeader />
            <Routes>
              <Route path="/" element={<Notes />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/trash" element={<Trash />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </Box>

  
    </>
  )
}

export default App
