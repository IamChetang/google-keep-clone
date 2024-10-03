import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { Box, Link, Drawer as MuiDrawer, Typography } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import NavList from './NavList';
import { DrawerProps } from '@mui/material/Drawer';
const drawerWidth = 240;

const openedMixin = (theme: Theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    marginTop: 10,
    border: 'none'
});

const closedMixin = (theme: Theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    marginTop: 10,
    border: 'none'
});

const DrawerHeader = styled('div')(({ theme }) => ({
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })< DrawerProps &{ open: boolean } >(
    ({ theme, open }:any) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        })
    }),
);

const Sidebar = () => {
    const [open, setOpen] = React.useState(false);
    const handleDrawer = () => {
        setOpen(prevState => !prevState);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar open={open} handleDrawer={handleDrawer} />
            <Drawer variant="permanent" open={open}>
                <DrawerHeader></DrawerHeader>
                <NavList open={open} setOpen={setOpen} />
            </Drawer>
        </Box>
    );
}

export default Sidebar;