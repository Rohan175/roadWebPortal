import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableChart from '@material-ui/icons/TableChart';
import PieChart from '@material-ui/icons/PieChart';
import Place from '@material-ui/icons/Place';
import AccountCircle from '@material-ui/icons/AccountCircle';

import NavBar from '../Components/NavBar';
import DashboardRoot from './DashboardRoot';
import ComplaintContainer from './ComplaintContainer';
import Profile from './Profile';

const styles = theme => ({
    wrapper: {
        marginTop: '56px',
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

class Dashboard extends Component {

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper}>
            {/* Insert Navbar here */}
            <NavBar navBarItems={navBarItems} />
            <Switch>
                <Route exact path="/Dashboard/" render={() => (<DashboardRoot />)} />
                <Route exact path="/Dashboard/Complaints/*" render={() => (<ComplaintContainer />)} />
                <Route exact path="/Dashboard/Profile" render={() => (<Profile />)} />
                <Route path="/Dashboard/*">
                    <Redirect to="/Dashboard" />
                </Route>
            </Switch>
          </div>  
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);