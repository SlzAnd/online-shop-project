import * as React from "react";

// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { BrowserRouter, Route } from 'react-router-dom';
import {Button, Link, MenuItem, Switch, ThemeProvider} from "@mui/material";

import MyButton from "./MyButton";
import AddProductForm from "./AddProductForm";
import "../App.css";
import AdminPage from "../pages/AdminPage";

export default function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
            <BrowserRouter>
                    <AppBar position="static" sx={{ backgroundColor: '#274C5B',
                        color: '#FFFFFF'}}>
                        <Toolbar>
                            <Button color="inherit">
                                <MyButton formComponent={AddProductForm}/>
                            </Button>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
            </BrowserRouter>
    );
}