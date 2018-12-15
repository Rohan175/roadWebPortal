import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AllInbox from '@material-ui/icons/AllInbox';
import AddAlert from '@material-ui/icons/AddAlert';
import Timer from '@material-ui/icons/Timer';
import Check from '@material-ui/icons/Check';

import bgImage from '../res/rnb.svg';

import CardBox from '../Components/DashboardCard';
// import DashboardCard from '../Components/DashboardCard';

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
    cardRoot: {
        [theme.breakpoints.down('sm')]: {
            marginTop: '-66px',
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
        cardData: [
            {
                name: "New",
                value: 10,
                icon: AllInbox,
                color: "primary"
            },
            {
                name: "New",
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

    componentDidMount() {
        this.setState({
            startAnimation: true
        })
    }

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper} style={{textAlign: 'center'}}>
            <div style={{margin: 'auto'}}>
                <div className={classes.cardRoot}>
                    <div className={classes.card1}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[0].icon} CardName={this.state.cardData[0].name} CardValue={this.state.cardData[0].value} CardColor={this.state.cardData[0].color} /></div>
                    <div className={classes.card2}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[1].icon} CardName={this.state.cardData[1].name} CardValue={this.state.cardData[1].value} CardColor={this.state.cardData[1].color} /></div>
                    <div className={classes.card3}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[2].icon} CardName={this.state.cardData[2].name} CardValue={this.state.cardData[2].value} CardColor={this.state.cardData[2].color} /></div>
                    <div className={classes.card4}><CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[3].icon} CardName={this.state.cardData[3].name} CardValue={this.state.cardData[3].value} CardColor={this.state.cardData[3].color} /></div>
                </div>
                {/* <Grid container style={{margin:'auto'}}>
                    <Grid item xs={12} md>
                    </Grid>
                    <Grid item xs={12} md>
                        <Grid container direction="row" alignContent="stretch" alignItems="stretch">
                            <Grid item xs={12}>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={6}>
                                    </Grid>
                                    <Grid item xs={6}>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid> */}
                    
                    {
                        // this.state.cardData.map((item, index) => (
                        //     <Grid item xs={6} md  />
                        // ))
                    }
                {/* </Grid> */}
            </div>
          </div>
        );
    }
}

DashboardRoot.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardRoot);