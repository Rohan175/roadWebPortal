import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import NavBar from '../Components/NavBar';
import DashboardRoot from './DashboardRoot';
import ComplaintContainer from './ComplaintContainer';
import Profile from './Profile';

const styles = theme => ({
    wrapper: {
        marginTop: '56px',
    }
})

class Dashboard extends Component {

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper}>
            {/* Insert Navbar here */}
            <NavBar />
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