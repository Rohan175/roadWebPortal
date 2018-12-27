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

import { getCookie, url } from '../constants';

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
        'grid-template-rows': '1fr 1fr'
    },
    card1:{
        'grid-column' : '1/2',
        display: 'inline-block',
        'grid-row' : '1/3',
    },
    card2:{
        
        'grid-column' : '2/4',
        display: 'inline-block',
        'grid-row' : '1/2'
    },
    card3:{
        
        'grid-column' : '2/3',
        display: 'inline-block',
        'grid-row' : '2/3'
    },
    card4:{
        
        'grid-column' : '3/4',
        display: 'inline-block',
        'grid-row' : '2/3'
    }
})


class DashboardRoot extends Component {

    state = {
        startAnimation: false,
        newComplaints: 0,
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

        let req = new Request(url  + "newComplaintsCount", {
            method: "GET",
            headers: headers,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(res => {
                console.log(res);                
                if(res.success){
                   this.setState({
                       newComplaints: res.data
                   }) 
                }else{
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

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper} style={{textAlign: 'center'}}>
            <div className={classes.dashboardwrapper}>
                <div className={classes.cardRoot}>
                    <div className={classes.card1}><NewComplaintCardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[0].icon} CardName={this.state.cardData[0].name} CardValue={this.state.newComplaints} CardColor={this.state.cardData[0].color} /></div>
                    <div className={classes.card2}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[1].icon} CardName={this.state.cardData[1].name} CardValue={this.state.cardData[1].value} CardColor={this.state.cardData[1].color} /></div>
                    <div className={classes.card3}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[2].icon} CardName={this.state.cardData[2].name} CardValue={this.state.cardData[2].value} CardColor={this.state.cardData[2].color} /></div>
                    <div className={classes.card4}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[3].icon} CardName={this.state.cardData[3].name} CardValue={this.state.cardData[3].value} CardColor={this.state.cardData[3].color} /></div>
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