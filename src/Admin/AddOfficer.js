import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';

import RoadCode from '../Components/RoadCode';
import GeneralDialog from '../Components/GeneralDialog';
import { url, getCookie, hierarchy } from "../constants";

const styles = theme => ({
    wrapper: {
        // marginTop: '-56px',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        textAlign: 'center'
    },
    textWrapper: {
        padding: '10px'
    },
    textField: {
        width: '100%',
        textAlign: 'left'
    },
    AddOfficerWrapper: {
        margin: 'auto',
        padding: '10px',
        [theme.breakpoints.up('sm')]: {
            width: "50%"
        },
    },
    road_code_field: {
        border: 'none',
        borderBottom: '2px solid gray',
        outline: "none",
    }
})

class AddOfficer extends Component {

    state = {
        startAnimation: false,
        name: "",
        email: "",
        phoneNo: "",
        password: "",
        repassword: "",
        role: "",
        road_code: "",
        sr_officer_id: "",
        isDisabled: false,
        sr_officer_list: [],
        roads: []
    }


    
    handleChange = e => {            
        this.setState({
            [e.target.name]: e.target.value
        })

        if(e.target.name === 'role') {

            if(e.target.value === hierarchy[0]) {
                fetch(url + "roads/")
                .then(res => res.json())
                .then(res => {   
                    let roadList = res.data.map(data => {
                        return {
                            value: data.road_code,
                            label: data.name
                        }
                    })
                    
                    this.setState({
                        roads: roadList
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.handleDialogOpen("Cannot get road list", "Error")
                });
            } else {
                this.setState({
                    roads: [],
                    road_code: ""
                })
            }

            if(e.target.value !== hierarchy[hierarchy.length - 1]) {

                fetch(url + "getSeniorIds/?role=" + e.target.value)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        sr_officer_list: res.data
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.handleDialogOpen("Cannot get senior officer list", "Error")
                });

            } else {
                this.setState({
                    sr_officer_list: [],
                    sr_officer_id: ""
                })
            }

        }

    }

    handlePasswordErrors = e => {    
        if(this.state.password === "") {
            return false
        }
        if(this.state.password === this.state.repassword) {
            return false
        }
        return true
    }

    handleSave = e => {
        if(
            this.state.name === "" ||
            this.state.email=== "" ||
            this.state.phoneNo === "" ||
            this.state.password === "" ||
            this.state.repassword === "" ||
            this.state.role === ""
        ) {
            this.handleDialogOpen("All Fields are Cumpalsory", "Error");
            return;
        }

        if(
            this.state.role === hierarchy[0] &&
            this.state.road_code === ""
            // this.state.sr_officer_id === ""
        ) {
            this.handleDialogOpen("Please select road for officer", "Error");
            return;
        }

        if(
            this.state.role !== hierarchy[hierarchy.length - 1] &&
            this.state.sr_officer_id === ""
        ) {
            this.handleDialogOpen("Please select senior officer", "Error");
            return;
        }

        if(this.state.role === hierarchy[0]) {
            this.setState({road_code :this.state.road_code.map(item => {
                return item.value;
            })})
        }

        fetch(url + "signup/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth': 'token ' + getCookie("roadGPortalAuth")
            },
            method: "POST",
            body: JSON.stringify({
                name : this.state.name,
                email : this.state.email,
                phoneNo : this.state.phoneNo,
                password : this.state.password,
                role : this.state.role,
                road_code : this.state.road_code,
                srOfficerId : this.state.sr_officer_id
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.handleDialogOpen("Officer added successfully!", "Success")
                this.setState( {
                    name: "",
                    email: "",
                    phoneNo: "",
                    password: "",
                    repassword: "",
                    role: "",
                    road_code: "",
                    sr_officer_id: ""
                })
            }else{
                console.error(res);
                alert(res.data);              
            }
        })
        .catch(err => {                
            this.handleDialogOpen(err.message, "Error")
        });
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
    };

    componentDidMount() {
        this.setState({
            startAnimation: true
        })
    }

    render() {
        let { classes } = this.props;

        return (
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
            <Paper className={classes.AddOfficerWrapper}>
                {/* <Collapse in={this.state.startAnimation}> */}
                <Toolbar>
                    <Typography variant="headline" style={{textAlign: 'center', width: '100%'}}>Add New Officer</Typography>
                </Toolbar>
                <Grid container>
                    <Grid item xs={12} className={classes.textWrapper}>
                        <TextField
                            id="name"
                            label="Name"
                            name="name"
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
                            name="email"
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
                            name="phoneNo"
                            className={classes.textField}
                            value={this.state.phoneNo}
                            onChange={this.handleChange}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.textWrapper}>
                        <TextField
                            id="password"
                            label="Password"
                            name="password"
                            className={classes.textField}
                            value={this.state.password}
                            onChange={this.handleChange}
                            error={this.handlePasswordErrors()}
                            helperText={this.state.password.length > 6 && this.state.password.length < 12 ? "" : "Password length must be in 6 to 12"}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className={classes.textWrapper}>
                        <TextField
                            id="repassword"
                            label="Confirm Password"
                            name="repassword"
                            className={classes.textField}
                            value={this.state.repassword}
                            onChange={this.handleChange}
                            error={this.handlePasswordErrors()}
                            helperText={this.state.password !== this.state.repassword ? "Password not matched" : ""}
                            margin="none"
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.textWrapper}>
                        <FormControl className={classes.textField}>
                            <InputLabel htmlFor="role">Role</InputLabel>
                            <Select
                                id="role"
                                value={this.state.role}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'role',
                                    id: 'role',
                                }} >
                                {
                                    hierarchy.map((value, index) => (
                                        <MenuItem value={value} key={index}>{value}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        this.state.role === hierarchy[0]
                        ?(<Grid item xs={12} className={classes.textWrapper}>
                            <FormControl className={classes.textField}>
                                <RoadCode 
                                    options={this.state.roads}
                                    setRoadCodes={opt => {
                                        this.setState({
                                            road_code: opt
                                        })
                                    }} 
                                ></RoadCode>
                            </FormControl>
                        </Grid>)
                        :null
                    }
                    {
                        this.state.role && this.state.role !== hierarchy[hierarchy.length - 1]
                        ?(<Grid item xs={12} className={classes.textWrapper}>
                            <FormControl className={classes.textField}>
                                <InputLabel htmlFor="sr_officer_id">Senior Officer</InputLabel>
                                <Select
                                    value={this.state.sr_officer_id}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: 'sr_officer_id',
                                        id: 'sr_officer_id',
                                    }} >
                                    {
                                        this.state.sr_officer_list.map((value, index) => (
                                            <MenuItem value={value._id} key={index}>{value.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>)
                        :null
                    }
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs>
                        <Button color="primary" disabled={this.state.isDisabled} onClick={this.handleSave}>Save</Button>&nbsp;
                        <Button color="secondary" onClick={ () => {
                            this.setState( {
                                name: "",
                                email: "",
                                phoneNo: "",
                                password: "",
                                repassword: "",
                                role: "",
                                road_code: "",
                                sr_officer_id: ""
                            })
                        } }>Reset</Button>
                    </Grid>
                </Grid>
                {/* </Collapse> */}
            </Paper>
          </div>  
        );
    }
}

AddOfficer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AddOfficer);