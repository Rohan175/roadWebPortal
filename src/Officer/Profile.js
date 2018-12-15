import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';

import { url, setCookie, getCookie } from "../constants";



const styles = theme => ({
    wrapper: {
        marginTop: '-56px',
        width: '100vw',
        height: '100vh',
        display: 'flex'
    },
    textWrapper: {
        padding: '10px'
    },
    textField: {
        // minWidth: '270px'
        width: '100%',
        // marginleft: '10px'
    }
})


class Profile extends Component {

    state = {
        startAnimation: false,
        name: "",
        data: {
            name: "",
            email: "",
            phoneNo: ""
        }
    }

    handleChange = e => {
        this.setState({
            name: e.target.value
        })
    }

    componentWillMount() {
        fetch(url + "getUserInfo/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth': 'token ' + getCookie("roadGPortalAuth")
                },
                method: "GET",
            }
        )
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.setState({
                    data: res.data
                })
            }else{
                console.error(res);               
            }
        })
        .catch(err => {                
            this.handleDialogOpen(err.message, "Error")
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
          <div className={classes.wrapper}>
            <div style={{margin:'auto'}}>
                {/* <Collapse in={this.state.startAnimation}> */}
                    <Card style={{textAlign: 'center'}}>
                        <CardContent>
                            <Toolbar>
                                <Typography variant="headline" style={{textAlign: 'center', width: '100%'}}>Update Profile Here</Typography>
                            </Toolbar>
                            <Grid container>
                                <Grid item xs={12} className={classes.textWrapper}>
                                    <TextField
                                        id="name"
                                        label="Name"
                                        className={classes.textField}
                                        value={this.state.data.name}
                                        onChange={this.handleChange}
                                        margin="none"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.textWrapper}>
                                    <TextField
                                        id="email"
                                        label="Email"
                                        className={classes.textField}
                                        value={this.state.data.email}
                                        onChange={this.handleChange}
                                        margin="none"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.textWrapper}>
                                    <TextField
                                        id="phoneNo"
                                        label="Phone Number"
                                        className={classes.textField}
                                        value={this.state.data.phoneNo}
                                        onChange={this.handleChange}
                                        margin="none"
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.textWrapper}>
                                    <TextField
                                        id="password"
                                        label="Old Password"
                                        className={classes.textField}
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        margin="none"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.textWrapper}>
                                    <TextField
                                        id="newPassword"
                                        label="New Password"
                                        className={classes.textField}
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        margin="none"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.textWrapper}>
                                    <TextField
                                        id="confirmNewPassword"
                                        label="Confirm New Password"
                                        className={classes.textField}
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        margin="none"
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Grid item xs>
                                    <Button color="primary">Save</Button>&nbsp;
                                    <Button color="secondary" onClick={ () => {
                                        setCookie("roadGPortalAuth", {}, -1);
                                        window.location.reload();
                                    } }>Logout</Button>
                                </Grid>
                                {/* <Grid item xs>
                                    
                                </Grid> */}
                            </Grid>
                        </CardContent>
                    </Card>
                {/* </Collapse> */}
            </div>
          </div>  
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);