
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GeneralDialog from '../Components/GeneralDialog';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from '../res/emblem.svg';
import {url} from "../constants";
import { Typography } from '@material-ui/core';

const styles = theme => ({
    Card: {
        margin: 'auto',
        textAlign: 'center',
        minWidth: '320px'
    },
    logoWrapper: {
        position: 'relative',
        textAlign:'center'
    },
    logo: {
        width: '70px',
        height: 'auto',
    },
    loginBtn: {
        marginTop: '20px',
        width: '100%',
    },
    forgotPasswordBtn: {
        marginTop: '20px',
        width: '200px'
    },
    textField: {
        width: '100%'
    },
    wrapper: {
        width: '100vw',
        height: '100vh',
        display: 'flex'
    },    
})

class ForgotPasswordComponent extends Component {
    state={ 
        openDialog : false,
        newPassword:"",
        confirmPassword:"",
        toLogin:false,
        reset_name:"Reset Password"
    }

    handleDialogOpen = (dialogMsg, dialogTitle) => {        
        this.setState({ 
            openDialog: true,
            dialogMsg: dialogMsg,
            dialogTitle: dialogTitle
        });
    };

    
    handleClose = () => {
        this.setState({ openDialog: false });
        if(this.state.toLogin){
            this.props.history.push('/');
        }
    };

    handleNewPassword = (event) =>{
        this.setState({
            newPassword:event.target.value,
        })   
    }
    handleConfirmPassword = (event) =>{
        this.setState({
            confirmPassword:event.target.value,
        })   
    }

    handleReset = () => {
        console.log(this.props.match);
        if(!(this.state.newPassword.length > 5)){
            this.handleDialogOpen("Password must contain 6 charachters","Error");
            return ;
        }
        if(this.state.confirmPassword === this.state.newPassword){
            this.setState({
                reset_name:"PLEASE WAIT"
            })
            fetch( url + "verifyForgotPassword/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({password:this.state.newPassword,token:this.props.match.params.id})
            }
        )
        .then(res => res.json())
        .then(res => {
            this.setState({
                toLogin:true,
                reset_name:"Reset Password"
            })
            if(res.success){
                this.handleDialogOpen("Your password has been changed successfully !");
            }else{
                this.handleDialogOpen(res.data,"Error");  
            }
        })
        .catch(err => {
            this.setState({
                toLogin:true,
                reset_name:"Reset Password"
            })
            console.log(err);   
            this.handleDialogOpen(err,"Please try again later ");        
        });

        }
        else{
            this.handleDialogOpen("New Password and Confirm Password is not same ","Error");
        }
    }

    render(){
        let { classes } = this.props;

        return(
            <div className={classes.wrapper}>
            <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                <Button onClick={this.handleClose}>OK</Button>
            </GeneralDialog>
            <Paper style={{margin:'auto',padding:'20px 50px 50px 50px'}}>
            {/* <CardContent> */}
                <div>
                    <Typography variant="headline" style={{ textTransform: 'capitalize', textAlign: 'center', margin: '0px 0px 20px 0px' }}>Reset your password here</Typography>
                </div>
                {/* <div className={classes.logoWrapper}>
                    <img src={logo} className={classes.logo} alt="Road and Building" />
                </div> */}
                <form onSubmit={
                    e => {
                        e.preventDefault();
                    }
                }>
                    <br/>
                    <div>
                        <TextField
                            id="password"
                            name="password"
                            label="New Password"
                            value={this.state.newPassword}
                            type="password"
                            className={classes.textField}
                            margin="small" 
                            onChange={this.handleNewPassword}
                            />
                    </div>
                    <div>
                        <TextField
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={this.state.confirmPassword}
                            className={classes.textField}
                            margin="small" 
                            onChange={this.handleConfirmPassword}
                            />
                    </div>
                    <div>
                        <br/>
                        <Button 
                        disabled={this.state.reset_name=="Reset Password"?false:true}
                        type="submit" variant="contained" onClick={this.handleReset} color="primary" className={classes.loginBtn}>
                            {this.state.reset_name}
                        </Button>
                    </div>
                </form>
        </Paper>
        </div>
        );
    }
}

ForgotPasswordComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ForgotPasswordComponent);