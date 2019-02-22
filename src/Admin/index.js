import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableChart from '@material-ui/icons/TableChart';
import AddBox from '@material-ui/icons/AddBox';
import AccountCircle from '@material-ui/icons/AccountCircle';

import NavBar from '../Components/NavBar';
import AdminRoot from './AdminRoot';
import Manage from "./Manage";
import AddOfficer from "../Officer/AddOfficer";
import Profile from '../Components/Profile';

import bgImage from '../res/ROHAN.svg';

const styles = theme => ({
    wrapper: {
        // marginTop: '56px',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top'
    }
})

const navBarItems = [
    {
        name: 'Manage',
        path: '/Admin/Manage',
        icon: TableChart
    },
    {
        name: 'Add Officer',
        path: '/Admin/AddOfficer',
        icon: AddBox
    },
    {
        name: 'Profile',
        path: '/Admin/Profile',
        icon: AccountCircle
    }
];

class AdminDashboard extends Component {

    //state of login component
    state = {
        loginTab: true
    }

    toLoginTab = () => {
        this.setState( {
            loginTab: true
        });
    }

    toForgotPassTab = () => {
        this.setState( {
            loginTab: false
        });
    }

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper}>
            <NavBar navBarItems={navBarItems} />
            <Switch>
                <Route exact path="/Admin/" render={() => (<AdminRoot />)} />
                <Route exact path="/Admin/Manage/" render={() => (<Manage />)} />
                <Route exact path="/Admin/AddOfficer/" render={() => (<AddOfficer />)} />
                <Route exact path="/Admin/Profile" render={() => (<Profile />)} />
                <Route path="/Admin/*">
                    <Redirect to="/Admin" />
                </Route>
            </Switch>
          </div>  
        );
    }
}

AdminDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminDashboard);