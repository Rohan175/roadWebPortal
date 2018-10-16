import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
    wrapper: {
        width: '100vw',
        height: '100vh',
    }
})

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
            <h1>Admin Dashboard</h1>
          </div>  
        );
    }
}

AdminDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminDashboard);