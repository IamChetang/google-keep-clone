import React from 'react';

import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    InputBase,
    Avatar 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../../assets/google-keep-logo.png';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
    open: boolean;
}


const Navbar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})<NavbarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#fff',
    boxShadow: 'inset 0 -1px 0 0 #dadce0',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));
const Heading = styled(Typography)`
    color : #5f6368;
    font-size: 22px;
    padding: 0 0 0 15px;
`;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
type HeaderProps = {
    handleDrawer: () => void,
    open: boolean
}
const Header: React.FC<HeaderProps> = ({ handleDrawer, open }) => {
    const location = useLocation();
    const pathName = capitalize(location.pathname.substring(1));

    return (
        <Navbar open={open}>
            <Toolbar>
                <IconButton
                    onClick={handleDrawer}
                    edge="start"
                    sx={{ marginRight: 5 }}>
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {
                        pathName ? "" : <img src={logo} alt="logo" style={{ width: 30 }} />
                    }
                    <Heading>{pathName || 'Keep'}</Heading>
                </Box>
                <Box
                    ml={4}
                    mr="auto"
                    display="flex"
                    alignItems="center"
                    style={{
                        backgroundColor: '#f1f3f4',
                        padding: '0px 10px',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '500px',
                    }}
                >
                    <IconButton
                        edge="start"
                    >
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}
                        style={{ width: '100%' }}
                    />
                </Box>
                <Box display="flex" alignItems="center">
                 

                  
                    <Avatar style={{ marginLeft: '12px' }}></Avatar>
                </Box>
            </Toolbar>
        </Navbar>
    )
}

export default Header;