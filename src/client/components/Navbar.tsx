import React from 'react';

import { AppBar, Toolbar, Typography, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <AppBar position="static" color='transparent'>
            <Toolbar>
                <Typography variant="h6">
                    <Button variant="text">
                        <Link to="/">Home</Link>
                    </Button>
                    <Button variant="text">
                        <Link to="/getPendingData">Pending Data</Link>
                    </Button>
                    <Button variant="text">
                        <Link to="/getData">Data</Link>
                    </Button>
                    <Button variant="text">
                        <Link to="/insert">Inserisci data</Link>
                    </Button>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;