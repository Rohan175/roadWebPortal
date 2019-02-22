import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

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

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

const styles = theme => ({
    wrapper: {
        // width: '100vw',
        height: '100vh',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            marginTop: '-66px',
            // display: 'none',
        },
        // background: 'white',
        // backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${bgImage})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center'
    },
    dashboardwrapper: {
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            margin: 'auto'
        },
        margin: '100px auto auto auto',
        // background: 'black',
        width: '40%'
    },
    cardRoot: {
        [theme.breakpoints.down('sm')]: {
            // marginTop: '-66px',
            display: 'inline-block',
        },
        display: 'grid',
        margin: 'auto',
        'grid-template-columns': '2fr 1fr 1fr',
        'grid-template-rows': '30vh 30vh'
    },
    card1: {
        'grid-column': '1/2',
        display: 'inline-block',
        'grid-row': '1/3',
    },
    card2: {

        'grid-column': '2/4',
        display: 'inline-block',
        'grid-row': '1/2'
    },
    card3: {

        'grid-column': '2/3',
        display: 'inline-block',
        'grid-row': '2/3'
    },
    card4: {

        'grid-column': '3/4',
        display: 'inline-block',
        'grid-row': '2/3'
    }
})


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

                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.openUpdateDialog}
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        Verification Process
            </DialogTitle>
                    <DialogContent>

                        <img src={require('./../Capture.PNG')} alt={"Helper Image"} />

                        <Typography gutterBottom>
                            Please check your details in "Profile" tab.
                </Typography>
                        <Typography gutterBottom>
                            If found incorrect, please modify your details and click on "SAVE" button.
                </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Ok
                </Button>
                    </DialogActions>
                </Dialog>


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