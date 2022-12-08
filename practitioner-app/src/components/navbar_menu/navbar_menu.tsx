import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

const NavbarMenu = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                sx={{ mx: '1rem' }}
                id="basic-button"
                aria-controls={open ? 'practitioner-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="contained"
            >
                Menu
            </Button>
            <Menu
                id="practitioner-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                <MenuItem onClick={() => navigate('/patient-profile')}>Patients profile</MenuItem>
                <MenuItem onClick={() => navigate('/forms-list')}>List of forms</MenuItem>
            </Menu>
        </div>
    );
};

export default NavbarMenu;
