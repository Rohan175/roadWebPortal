import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';

import LoginComponent from '../Components/LoginComponent';
import ForgotPasswordComponent from '../Components/ForgotPasswordComponent';

import { url } from "../constants";
import GeneralDialog from '../Components/GeneralDialog';
import roadImage from '../res/road.svg';
import emblem from '../res/emblem.svg';

const styles = theme => ({
    wrapper: {
        width: '100vw',
        height: '100vh',
        // display: 'flex'
    },
    paper: {
        padding:'20px',
        width:'270px',
        position: 'absolute',
        right: '120px',
        top: '90px'
    },
    roadImage: {
        width: '100vw',
        position: 'fixed',
        bottom: '-260px',
        left: '-160px'
    },
    logo: {
        width: '50px',
        padding: '20px',
        margin: '40px 0px 40px 40px',
        display: 'inline-block'
    },
    title: {
        // display: 'inline-block',
        padding: '0px',
        margin: '0px',
        marginTop: '60px'
    }
})

class Login extends Component {

    //state of login component
    state = {
        loginTab: true,
        openDialog : false,
        loginText : "Login",
        disableLogin : false
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

    handleDialogOpen = (dialogMsg, dialogTitle) => {        
        this.setState({ 
            openDialog: true,
            dialogMsg: dialogMsg,
            dialogTitle: dialogTitle
        });
    };

    setCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";";
    }

    handleClose = () => {
        this.setState({ openDialog: false });
    };

    handleLogin = (phoneNo, password) => {

        this.setState({
            loginText : "Logging In ...",
            disableLogin : true
        })

        if(!phoneNo){
            this.handleDialogOpen("Please enter phone number.", "Error")
            this.setState({
                loginText:"Login",
                disableLogin:false
            })

            return;
        }

        if(phoneNo && password && password.length >= 6 && password.length < 12) {
            fetch(url + "login/", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({phoneNo:phoneNo, password:password})
                }
            )
            .then(res => res.json())
            .then(res => {
                console.log("Auth : ",res);
                if(res.success){
                    this.setCookie("roadGPortalAuth", res.data, 1);
                    this.setCookie("roadGPortalUserType", res.loginType, 1);
                    this.setCookie("roadGPortalRole", res.role, 1);
                    this.setCookie("roadGPortalPosts", JSON.stringify(res.posts), 1);
                    this.setCookie("roadGPortalCurrentPosts", JSON.stringify(res.posts[0]), 1);
                    this.setCookie("firstTimeLogin", true, 1);
                    this.setCookie("isUpdated", res.isUpdated, 1);
                    this.props.setLogin(res.loginType);
                    console.log("posts available",res.posts);
                }else{
                    this.handleDialogOpen(res.data, "Error");
                    this.setState({
                        loginText:"Login",
                        disableLogin:false
                    })
                }
            })
            .catch(err => {
                console.log(err);                
                this.handleDialogOpen(err+"", "Error")
                this.setState({
                    loginText:"Login",
                    disableLogin:false
                })
            });
            
        } else {
            this.handleDialogOpen("Password is required and it must be between 6 to 12 character", "Error")
            this.setState({
                loginText:"Login",
                disableLogin:false
            })
        }
    }

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper}>
            <div style={{width: '610px'}}>
                <img src={emblem} className={classes.logo} />
                <span style={{float: 'right'}}>
                    <h1 className={classes.title} style={{color: '#263238'}}>Roads & Buildings Department</h1>
                    <h2 style={{color: '#263238', margin: '0px'}}>Government of Gujarat</h2>
                </span>
            </div>
            <img src={roadImage} className={classes.roadImage} />
           <Paper className={classes.paper}>
            { this.state.loginTab 
                ? 
                <LoginComponent handleLogin={this.handleLogin} toForgotPassTab={this.toForgotPassTab} loginText={this.state.loginText} disableLogin={this.state.disableLogin}/> 
                : <ForgotPasswordComponent toLoginTab={this.toLoginTab} /> }
            </Paper>
            <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                <Button onClick={this.handleClose}>OK</Button>
            </GeneralDialog>
          </div>  
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);