import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import GeneralDialog from '../Components/GeneralDialog';
import { url, setCookie, getCookie } from "../constants";
import { tr } from 'date-fns/esm/locale';



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
        // marginTop: '-46px',
        width: '100vw',
        height: '100vh',
        display: 'flex'
    },
    textWrapper: {
        padding: '10px'
    },
    textField: {
        width: '100%',
    },
    ProfileWrapper: {
        margin:'auto',
        textAlign: 'center',
        padding: '20px',
        // background: 'white',
        // borderRadius: '2px',
        [theme.breakpoints.up('sm')]: {
            width: "40%"
        },
    }
})


class Profile extends Component {

    state = {
        startAnimation: false,
        openUpdateDialog: true,
        id: "",
        name: "",
        email: "",
        phoneNo: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
        validPhoneNo: true,
        changed: false,
        openDialog : false
    }

    handleChange = e => {
        this.setState({
            changed: true,
            [e.target.id]: e.target.value
        })
    }

    handlePasswordErrors = e => {    
        if(this.state.newPassword === "") {
            return false
        }
        if(this.state.newPassword === this.state.confirmNewPassword) {
            return false
        }
        return true
    }

    handleSave = () => {

        this.setState({
            changed: false
        })

        //phone No error
        if(!this.state.validPhoneNo) {
            this.handleDialogOpen("Please check your phone number", "Error");
            return;
        }

        if(this.handlePasswordErrors()) {
            this.handleDialogOpen("Please check your password", "Error");
            return;
        }
        fetch(url + "updateProfile/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth': 'token ' + getCookie("roadGPortalAuth")
            },
            method: "POST",
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                phoneNo: this.state.phoneNo,
                password: this.state.password,
                newPassword: this.state.newPassword,
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);            
            if(res.success){
                this.handleDialogOpen(res.data, "Success");
                this.componentWillMount();
            }else{
                this.handleDialogOpen(res.data, "Error");
                this.setState({
                    changed: true
                })
            }
        })
        .catch(err => {
            console.log(err);                
            this.handleDialogOpen(err+"", "Error")
            this.setState({
                changed: true
            })
        });
    }

    handleDialogOpen = (dialogMsg, dialogTitle) => {        
        this.setState({ 
            openDialog: true,
            dialogMsg: dialogMsg,
            dialogTitle: dialogTitle
        });
    };

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };

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
                // this.setState({
                //     data: res.data
                // })
                setCookie("isUpdated","false","1");
                this.setState({...res.data});
            }else{
                console.error(res);               
            }
        })
        .catch(err => { 
            console.log(err);
                           
            // this.handleDialogOpen(err.message, "Error")
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
          <div className={classes.wrapper}>

            
                {/* <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.openUpdateDialog}
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        Verification Process
            </DialogTitle>
                    <DialogContent>

                        <Typography gutterBottom>
                            Please check your details.
                </Typography>
                        <Typography gutterBottom>
                            If found incorrect, please modify your details, change your password and click on "SAVE" button.
                </Typography>

                
                <Typography gutterBottom>
                            If your details are proper, please change your password and click on "SAVE" button.
                </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Ok
                </Button>
                    </DialogActions>
                </Dialog> */}


            <GeneralDialog
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleDialogClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                <Button onClick={this.handleDialogClose}>Ok</Button>
            </GeneralDialog>
            <Paper className={classes.ProfileWrapper}>
                <Toolbar>
                    <Typography variant="headline" style={{textAlign: 'center', width: '100%'}}>Update Profile Here</Typography>
                </Toolbar>
                <Grid container>
                    <Grid item xs={12} className={classes.textWrapper}>
                        <TextField
                            id="name"
                            label="Name"
                            className={classes.textField}
                            value={this.state.name}
                            onChange={this.handleChange}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.textWrapper}>
                        <TextField
                            id="email"
                            label="Email"
                            className={classes.textField}
                            value={this.state.email}
                            onChange={this.handleChange}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.textWrapper}>
                        <TextField
                            id="phoneNo"
                            label="Phone Number"
                            type="number"
                            className={classes.textField}
                            value={this.state.phoneNo}
                            onChange={(e) => { 
                                this.handleChange(e);
                                if(e.target.value.length != 10) {
                                    this.setState({
                                        validPhoneNo: false
                                    })
                                } else {
                                    this.setState({
                                        validPhoneNo: true
                                    })
                                }
                            }}
                            helperText={ !this.state.validPhoneNo ? "Please enter valid phone no" : ""}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.textWrapper}>
                        <TextField
                            id="password"
                            label="Old Password"
                            className={classes.textField}
                            value={this.state.password}
                            type="password"
                            onChange={this.handleChange}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.textWrapper}>
                        <TextField
                            id="newPassword"
                            label="New Password"
                            className={classes.textField}
                            value={this.state.newPassword}
                            type="password"
                            onChange={this.handleChange}
                            error={this.handlePasswordErrors()}
                            helperText={this.state.newPassword.length > 6 && this.state.newPassword.length < 12 ? "" : "Password length must be in 6 to 12"}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.textWrapper}>
                        <TextField
                            id="confirmNewPassword"
                            label="Confirm New Password"
                            className={classes.textField}
                            value={this.state.confirmNewPassword}
                            type="password"
                            onChange={this.handleChange}
                            error={this.handlePasswordErrors()}
                            helperText={this.state.newPassword !== this.state.confirmNewPassword ? "Password not matched" : ""}
                            margin="none"
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs>
                        <Button color="primary" disabled={!this.state.changed} onClick={this.handleSave}>Save</Button>&nbsp;
                        <Button color="secondary" onClick={ () => {
                            setCookie("roadGPortalAuth", {}, -1);
                            window.location.reload();
                        } }>Logout</Button>
                    </Grid>
                    {/* <Grid item xs>
                        
                    </Grid> */}
                </Grid>
            </Paper>
          </div>  
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);