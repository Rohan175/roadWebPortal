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
import ManageOfficer from './ManageOfficer';
import AddOfficer from './AddOfficer';
import Profile from '../Components/Profile';
import { getCookie, hierarchy } from "../constants";

import bgImage from '../res/ROHAN.svg';
// import AddOfficer from './AddOfficer';

const styles = theme => ({
    wrapper: {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom'
    },
    backgr: {
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: '0px',
        left: '0px',
        right: '0px',
        zIndex: '-9',
    },
    bgImage: {
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: '0px',
        left: '0px',
        // right: '0px',
        // zIndex: '-9',
    }
})


class Dashboard extends Component {

    state = {
        navBarItems: [
            {
                name: 'Complaints',
                path: '/Dashboard/Complaints/Table',
                icon: TableChart
            },
            {
                name: 'Maps',
                path: '/Dashboard/Complaints/Maps',
                icon: Place
            },
            ... getCookie('roadGPortalRole') !== hierarchy[0] ? [{
                name: 'Manage Officer',
                path: '/Dashboard/ManageOfficer',
                icon: PieChart
            }] : [],
            ... getCookie('roadGPortalRole') === hierarchy[hierarchy.length - 1] ? [{
                name: 'Add Officer',
                path: '/Dashboard/AddOfficer',
                icon: PieChart
            }] : [],
            {
                name: 'Profile',
                path: '/Dashboard/Profile',
                icon: AccountCircle
            }
        ]
    }

    render() {
        console.log(this.props);
        
        let { classes } = this.props;

        return (
          <div className={classes.wrapper}>
            {/* <img src={bgImage} className={classes.bgImage} /> */}
            {/* <div className={classes.backgr}></div> */}
            {/* Insert Navbar here */}
            <NavBar navBarItems={this.state.navBarItems} />
            <Switch>
                <Route exact path="/Dashboard/" render={() => (<DashboardRoot />)} />
                <Route exact path="/Dashboard/Complaints/*" render={(locationProps) => (<ComplaintContainer {...locationProps.location.state}/>)} />
                <Route exact path="/Dashboard/ManageOfficer" render={() => (<ManageOfficer />)} />
                <Route exact path="/Dashboard/AddOfficer" render={() => (<AddOfficer />)} />
                <Route exact path="/Dashboard/Profile" render={() => (<Profile />)} />
                <Route path="/Dashboard/*">
                    <Redirect to="/Dashboard/" />
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