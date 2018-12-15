import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import LoginComponent from '../Components/LoginComponent';
import ForgotPasswordComponent from '../Components/ForgotPasswordComponent';

import { url } from "../constants";
import GeneralDialog from '../Components/GeneralDialog';
            

const styles = theme => ({
    wrapper: {
        width: '100vw',
        height: '100vh',
        display: 'flex'
    }
})

class Login extends Component {

    //state of login component
    state = {
        loginTab: true,
        openDialog : false
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
                console.log(res);
                if(res.success){
                    this.setCookie("roadGPortalAuth", res.data, 1);
                    this.setCookie("roadGPortalUserType", res.loginType, 1);
                    this.setCookie("roadGPortalRole", res.role, 1);
                    this.props.setLogin(res.loginType);
                }else{
                    this.handleDialogOpen(res.data, "Error");
                }
            })
            .catch(err => {
                console.log(err);                
                this.handleDialogOpen(err+"", "Error")
            });
            
        } else {
            this.handleDialogOpen("Password is required and it must be between 6 to 12 character", "Error")
        }
    }

    render() {
        let { classes } = this.props;

        return (
          <div className={classes.wrapper}>
            { this.state.loginTab ? <LoginComponent handleLogin={this.handleLogin} toForgotPassTab={this.toForgotPassTab} /> : <ForgotPasswordComponent toLoginTab={this.toLoginTab} /> }
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