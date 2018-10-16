import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AllInbox from '@material-ui/icons/AllInbox';
import AddAlert from '@material-ui/icons/AddAlert';
import Timer from '@material-ui/icons/Timer';
import Check from '@material-ui/icons/Check';

import CardBox from '../Components/DashboardCard';
import DashboardCard from '../Components/DashboardCard';

const styles = theme => ({
    wrapper: {
        marginTop: '-56px',
        width: '100vw',
        height: '100vh',
        display: 'flex',
    }
})


class DashboardRoot extends Component {

    state = {
        startAnimation: false,
        cardData: [
            {
                name: "Total",
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
                <Grid container style={{margin:'auto'}}>
                    <Grid item xs={12} md>
                        <Grid container>
                            <Grid item xs={6}>
                                <CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[0].icon} CardName={this.state.cardData[0].name} CardValue={this.state.cardData[0].value} CardColor={this.state.cardData[0].color} />
                            </Grid>
                            <Grid item xs={6}>
                                <CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[1].icon} CardName={this.state.cardData[1].name} CardValue={this.state.cardData[1].value} CardColor={this.state.cardData[1].color} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md>
                        <Grid container>
                            <Grid item xs={6}>
                                <CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[2].icon} CardName={this.state.cardData[2].name} CardValue={this.state.cardData[2].value} CardColor={this.state.cardData[2].color} />
                            </Grid>
                            <Grid item xs={6}>
                                <CardBox startAnimation={this.state.startAnimation} CardIcon={this.state.cardData[3].icon} CardName={this.state.cardData[3].name} CardValue={this.state.cardData[3].value} CardColor={this.state.cardData[3].color} />
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    {
                        // this.state.cardData.map((item, index) => (
                        //     <Grid item xs={6} md  />
                        // ))
                    }
                </Grid>
            </div>
          </div>
        );
    }
}

DashboardRoot.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardRoot);