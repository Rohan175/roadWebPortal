import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import MenuIcon from '@material-ui/icons/Menu/';
import Notifications from '@material-ui/icons/Notifications';

import TableChart from '@material-ui/icons/TableChart';
import PieChart from '@material-ui/icons/PieChart';
import Place from '@material-ui/icons/Place';
import AccountCircle from '@material-ui/icons/AccountCircle';

import MobileDrawer from './MobileDrawer';
import DesktopMenu from './DesktopMenu';

const styles = theme => ({
    Toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    appNavbar: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    }
})

const navBarItems = [
    {
        name: 'Complaints',
        path: '/Dashboard/Complaints/Table',
        icon: TableChart
    },
    {
        name: 'Reports',
        path: '/Dashboard/Complaints/Reports',
        icon: PieChart
    },
    {
        name: 'Maps',
        path: '/Dashboard/Complaints/Maps',
        icon: Place
    },
    {
        name: 'Profile',
        path: '/Dashboard/Profile',
        icon: AccountCircle
    }
];

class NavBar extends Component {
    state = {
        openDrawer: false
    }

    handleMenuClick = () => {
        this.setState({
            openDrawer: true
        });
    };

    handleClickAway = () => {
        this.setState({
            openDrawer: false
        });
    };

    render() {
        let { classes } = this.props;
        return (
            <AppBar position="fixed">
                <Toolbar variant="dense" className={classes.Toolbar}>
                    <Typography variant="subheading" color="inherit" className={classes.grow}>
                        <Button component={Link} style={{color: 'white'}} to="/">Road {'&'} Building</Button>
                    </Typography>
                    <DesktopMenu menuItems={navBarItems} />
                    <div>
                        <Tooltip title="Notifications">
                            <IconButton color="inherit"><Notifications /></IconButton>
                        </Tooltip>
                        <IconButton className={classes.appNavbar} color="inherit" onClick={this.handleMenuClick}><MenuIcon /></IconButton>
                    </div>
                </Toolbar>
                <MobileDrawer menuItems={navBarItems} openDrawer={this.state.openDrawer} handleClickAway={this.handleClickAway} />
            </AppBar>
        )
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);