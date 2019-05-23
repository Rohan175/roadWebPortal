import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GeneralDialog from '../Components/GeneralDialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from '../res/emblem.svg';
import {url} from "../constants";
import { Typography } from '@material-ui/core';

const styles = theme => ({
    Card: {
        // margin: 'auto',
        textAlign: 'center',
        width: '270px'
    },
    logoWrapper: {
        position: 'relative',
        marginTop: '20px'
    },
    logo: {
        width: '70px',
        height: 'auto',
    },
    loginBtn: {
        marginTop: '20px',
        width: '200px'
    },
    forgotPasswordBtn: {
        marginTop: '20px',
        width: '200px'
    },
    textField: {
        width: '100%'
    }
})

    class ForgotPasswordComponent extends Component {
        state={
            openDialog : false,
            phonenumber:"",
            toLogin:false,
            reset_name:"Reset Password",
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
                // this.props.history.push('/');
                this.props.toLoginTab()
            }
        };
    
        handleforgot = () => {       
            if(this.state.phonenumber.length==10){

                this.setState({
                    reset_name:"PLEASE WAIT"
                })
            fetch( url + "forgotPassword/", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: "POST",
                    body: JSON.stringify({phoneNo:this.state.phonenumber})
                }
            )
            .then(res => res.json())
            .then(res => {
             
                this.setState({
                    reset_name:"Reset Password"
                })
                if(res.success){
                    this.setState({
                        toLogin:true,
                    })
                    this.handleDialogOpen("Go to the link which has been messaged on "+this.state.phonenumber+" .","To reset your password ");
                }else{
                    this.handleDialogOpen(res.data,"Error");  
                }
            })
            .catch(err => {
                
                this.setState({
                    reset_name:"Reset Password"
                })
                console.log(err);   
                this.handleDialogOpen(err,"Error Occur");        
            });
            

            }
            else{
                this.handleDialogOpen("Phone number must contain 10 digits","Error");
            }
        }

        handlechange = (event) =>{
            this.setState({
                phonenumber:event.target.value,
            })       
        }

render(){
        let { classes } = this.props;

    return (
        <div className={classes.Card}>
        
        <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                <Button onClick={this.handleClose}>OK</Button>
            </GeneralDialog>
            {/* <CardContent> */}
                <div className={classes.logoWrapper}>
                    <h1 style={{ color: '#263238' }}>Forgot Password</h1>
                </div>
                    <div>
                        <TextField
                            id="phoneNo"
                            label="Phone Number"
                            type="Number"
                            value={this.state.phonenumber}
                            onChange={this.handlechange}
                            min="1000000000"
                            max="9999999999"
                            className={classes.textField}
                            margin="normal" />
                    </div>
                    <div>
                        <Button type="submit" 
                        disabled={this.state.reset_name=="Reset Password"?false:true}
                        variant="contained" color="primary" onClick={this.handleforgot} className={classes.loginBtn}>
                            {this.state.reset_name}
                        </Button>
                    </div>
                <div>
                    <Button 
                        variant="flat" 
                        className={classes.forgotPasswordBtn}
                        onClick={this.props.toLoginTab}
                    >
                        Login
                    </Button>
                </div>
        </div>
    )
    }
}

ForgotPasswordComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ForgotPasswordComponent);