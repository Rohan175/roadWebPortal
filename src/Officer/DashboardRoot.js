import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';

import AllInbox from '@material-ui/icons/AllInbox';
import AddAlert from '@material-ui/icons/AddAlert';
import Timer from '@material-ui/icons/Timer';
import Check from '@material-ui/icons/Check';

// import bgImage from '../res/rnb.svg';

import CardBox from '../Components/DashboardCard';
import NewComplaintCardBox from '../Components/newComplaintCard';
// import DashboardCard from '../Components/DashboardCard';
import EmergencyCardBox from '../Components/EmergencyComplaintCard';

import { getCookie, url } from '../constants';

const styles = theme => ({
    wrapper: {
        // width: '100vw',
        // marginTop: '-30px',
        height: '100vh',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            marginTop: '-66px',
        },
    },
    dashboardwrapper: {
        marginTop: '120px',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            margin: 'auto'
        },
        margin: 'auto',
    },
    cardRoot: {
        [theme.breakpoints.down('sm')]: {
            // display: 'inline-block',
            // marginTop: '0px'
            'grid-template-columns': '1fr 1fr',
            'grid-template-rows': '30vh 30vh',
            margin: '0px'
        },
        marginTop: '-30px',
        display: 'grid',
        margin: 'auto',
        'grid-template-columns': '2fr 1fr 1fr',
        'grid-template-rows': '30vh 30vh'
    },
    card1: {
        'grid-column': '1/2',
        display: 'inline-block',
        'grid-row': '1/3',
        [theme.breakpoints.down('sm')]: {
            'grid-column': '1/2',
            display: 'inline-block',
            'grid-row': '1/2',
        },
    },
    card2: {

        'grid-column': '2/4',
        display: 'inline-block',
        'grid-row': '1/2',
        [theme.breakpoints.down('sm')]: {
            'grid-column': '2/2',
            display: 'inline-block',
            'grid-row': '1/2',
        },
    },
    card3: {

        'grid-column': '2/3',
        display: 'inline-block',
        'grid-row': '2/3',
        [theme.breakpoints.down('sm')]: {
            'grid-column': '1/2',
            display: 'inline-block',
            'grid-row': '2/2',
        },
    },
    card4: {

        'grid-column': '3/4',
        display: 'inline-block',
        'grid-row': '2/3',
        [theme.breakpoints.down('sm')]: {
            'grid-column': '2/2',
            display: 'inline-block',
            'grid-row': '2/2',
        },
    }
});


class DashboardRoot extends Component {

    state = {
        startAnimation: false,
        newComplaints: 0,
        emergency: 0,
        completed: 0,
        pending: 0,
        openUpdateDialog: true,
        cardData: [
            {
                name: "New",
                value: 10,
                icon: AllInbox,
                color: "primary"
            },
            {
                name: "Emergency",
                value: 10,
                icon: AddAlert,
                color: "danger"
            },
            {
                name: "Pending",
                value: 10,
                icon: Timer,
                color: "alert"
            },
            {
                name: "Completed",
                value: 10,
                icon: Check,
                color: "success"
            }
        ]
    }

    componentWillMount() {
        let headers = new Headers();
        headers.append('origin', '*');
        headers.append('auth', 'token ' + getCookie("roadGPortalAuth"));

        let req = new Request(url + "newComplaintsCount", {
            method: "GET",
            headers: headers,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(res => {
                console.log(getCookie("isUpdated"));
                if (res.success) {
                    this.setState({
                        newComplaints: res.data.newComplaints,
                        pending: res.data.pending,
                        emergency: res.data.emergency,
                        completed: res.data.completed,
                        openUpdateDialog: (getCookie("isUpdated") != 'true')
                    })
                } else {
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.setState({
            startAnimation: true
        })
    }

    handleClose = () => {
        this.setState({ openUpdateDialog: false });
    };

    render() {
        let { classes } = this.props;

        return (
            <div className={classes.wrapper} style={{ textAlign: 'center' }}>
            
                <div className={classes.dashboardwrapper}>
                    <div className={classes.cardRoot}>
                        <div className={classes.card1}><NewComplaintCardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[0].icon} CardName={this.state.cardData[0].name} CardValue={this.state.newComplaints} CardColor={this.state.cardData[0].color} /></div>
                        <div className={classes.card2}><EmergencyCardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[1].icon} CardName={this.state.cardData[1].name} CardValue={this.state.emergency} CardColor={this.state.cardData[1].color} link={"/Dashboard/Complaints/Table"} /></div>
                        <div className={classes.card3}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[2].icon} CardName={this.state.cardData[2].name} CardValue={this.state.pending} CardColor={this.state.cardData[2].color} link={"/Dashboard/Complaints/Table"} /></div>
                        <div className={classes.card4}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[3].icon} CardName={this.state.cardData[3].name} CardValue={this.state.completed} CardColor={this.state.cardData[3].color} link={"/Dashboard/Complaints/Table"} /></div>
                    </div>
                </div>
            </div>
        );
    }
}

DashboardRoot.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardRoot);