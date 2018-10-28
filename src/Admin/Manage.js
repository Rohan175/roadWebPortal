import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import Button from '@material-ui/core/Button';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import LinearProgress from '@material-ui/core/LinearProgress';

// import ComplaintFullView from "../Components/ComplaintFullView";

// import Card from '@material-ui/core/Card';

const styles = theme => ({
    wrapper: {
        marginTop: '-56px',
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
    }
})

class Manage extends Component {

    render() {
        let { classes } = this.props;

        return (
            <div className={classes.wrapper}>
                <Paper style={{margin: 'auto'}}>
                    this is text
                </Paper>
            </div>  
        );
    }
}

Manage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Manage);