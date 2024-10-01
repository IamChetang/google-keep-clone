import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { LightbulbOutlined, ArchiveOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    sideBarActive: {
        backgroundColor: '#feefc3',
        borderBottomRightRadius: '50px',
        borderTopRightRadius: '50px',
        color: '#000',
    },
    '&:hover': {
        backgroundColor: '#f0f0f0',
        borderBottomRightRadius: '50px',
        borderTopRightRadius: '50px',
    }
})

type NavProps = {
    open: boolean,
    setOpen: any
}
const NavList: React.FC<NavProps> = ({ open, setOpen }) => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();

    const sidebarLinks = [
        {
            id: 1,
            label: 'Notes',
            icon: <LightbulbOutlined />,
            link: '/'
        },
        {
            id: 2,
            label: 'Archive',
            icon: <ArchiveOutlined />,
            link: '/archive'
        },
        {
            id: 3,
            label: 'Trash',
            icon: <DeleteOutlineOutlined />,
            link: '/trash'
        }
    ];

    const handleDrawer = () => {
        setOpen(true);
    }

    return (
        <List>
            {sidebarLinks.map((list: {
                id: number,
                label: string,
                icon: any,
                link: string
            },) => (
                <ListItem key={list.id} disablePadding sx={{ display: 'block' }}
                    className={location.pathname === list.link ? classes.sideBarActive : ''}
                    onClick={() => {
                        navigate(list.link);
                    }}
                >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={handleDrawer}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                         
                        >
                            {list.icon}
                        </ListItemIcon>
                        <ListItemText  primary={list.label} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default NavList;