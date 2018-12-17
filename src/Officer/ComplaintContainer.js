import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SideFilter from "../Components/SideFilter";
import ComplaintTable from "./ComplaintTable";
import ComplaintReport from "./ComplaintReport";
import ComplaintMap from "./ComplaintMap";
import GeneralDialog from '../Components/GeneralDialog';
import { griev_type,status_type,getCookie, url } from '../constants';
// import Card from '@material-ui/core/Card';

const styles = theme => ({
    progressWrapper: {
        width: '100%',
        display: 'flex'
    },
    progress: {
        margin: 'auto',
        textAlign: 'center',
        width: '100%',
    },
    wrapper: {
        paddingTop: '60px',
        display: 'block',
        // minHeight: '90vh',
        background: 'white'
    },
    filterBtn: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    SideFilter: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    padding10: {
        padding: '10px'
    }
})

class ComplaintContainer extends Component {

    officers = [
        ['SECTION OFFICER',true],
        ['DEPUTY EXCECUTIVE ENGINEER',true],
        ['EXCECUTIVE ENGINEER',true],
        ['SUPRETENDING ENGINEER',true],
        ['CHIEF ENGINEER',true]
    ]

    state = {
        StartingDate: new Date(),
        EndingDate: new Date(),
        griev_type_map: new Map(griev_type),
        status_type_map : new Map(status_type),
        emergency_state : true,
        officers: this.officers,
        startAnimation: false,
        lodding : true,
        SideFilter: true,
        emptyList: true,
        filteredComplaints: []
    }

    handleStartingDateChange = (date) => {
        this.setState({ StartingDate: date });
    }

    handleEndingDateChange = (date) => {
        this.setState({ EndingDate: date }); 
    }

    handleChange = name => e  => {

        
        this.setState({
            lodding : true
        });

        const value = e.target.value;
        console.log(value,name);
        this.setState( oldState  => {
            
            let checked,newMap;
            if(oldState[name] instanceof Map){
                newMap = new Map(oldState[name]);  
                checked = !newMap.get(value) 
                newMap.set(value,checked);
            }else{
                newMap = checked = !oldState[name];
                console.log("inside emergency if");
                
            }

            let newFilteredComplaints = [];

            
            if(checked){
                
                if(name === "status_type_map"){

                    console.log("here2",oldState.emergency_state,this.allComplaints[0].isEmergency,(oldState.emergency_state===true || oldState.emergency_state !== this.allComplaints[0].isEmergency));
                    console.log("here3",oldState.emergency_state,this.allComplaints[1].isEmergency,(oldState.emergency_state===true || oldState.emergency_state !== this.allComplaints[1].isEmergency));
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.griev_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.complaint_status
                                && complaint.complaint_status.toUpperCase() == value.toUpperCase() 
                                && complaint.grievType
                                && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                                && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                        });
                    
                    newFilteredComplaints = newFilteredComplaints.concat(oldState.filteredComplaints)
                    //console.log(newFilteredComplaints);

                }else if(name === "griev_type_map"){
                            
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.status_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.grievType
                                && complaint.grievType.toUpperCase() == value.toUpperCase() 
                                && complaint.complaint_status
                                && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                                && oldState.emergency_state !== complaint.isEmergency
                        });
                    
                    newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
                    //console.log(newFilteredComplaints);

                }else if(name === "emergency_state"){

                    console.log("here ",this.allComplaints,oldState)
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                        
                        return complaint.grievType
                            && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                            && complaint.complaint_status
                            && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                    });
                
                    //newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
              
                    
                }
                console.log("Added",newFilteredComplaints);

            }else{ //Checked Else
                console.log("removing",oldState.filteredComplaints);
                
                if(oldState.filteredComplaints == []){
                    oldState.filteredComplaints = this.allComplaints;
                }

                if(name === "emergency_state"){
                    
                    //console.log(oldState.filteredComplaints, oldState.filteredComplaints[0]['isEmergency']);
                    
                    newFilteredComplaints = oldState.filteredComplaints.filter(complaint => (
                        complaint['isEmergency'] && (complaint['isEmergency'] == true)
                    ));
                        
                    console.log(newFilteredComplaints);
                    
                }else{

                    let jsonName = null;
                    if(name === "status_type_map"){
                        jsonName = "complaint_status";
                    }else if(name === "griev_type_map"){
                        jsonName = "grievType"
                    }

                    console.log(value,oldState.filteredComplaints[0][jsonName] && (oldState.filteredComplaints[0][jsonName].toUpperCase()));

                    newFilteredComplaints = oldState.filteredComplaints.filter(complaint => (
                        complaint[jsonName] && (complaint[jsonName].toUpperCase() !== value.toUpperCase())
                    ));
                    console.log(newFilteredComplaints);
              }


            }


            return {
                [name] : newMap,
                lodding : false,
                filteredComplaints : newFilteredComplaints
            }
          });


    }


    allComplaints = []


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
            startAnimation: true,
        })

        let headers = new Headers();
        headers.append('origin', '*');
        headers.append('auth', 'token ' + getCookie("roadGPortalAuth"));

        let req = new Request(url  + "getComplaints?isPaginated=0", {
            method: "GET",
            headers: headers,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(res => {
               
                this.setState({
                    lodding : false
                });

                if(res.success){
                    console.log("complaints ", res);
                    
                    res.complaints.map(complaint => {
                        complaint.time = new Date(complaint.time);
                    })
                    this.allComplaints = res.complaints;
                    
                    console.log(this.allComplaints);
                    let newFilteredComplaints = res.complaints;
                    const newMap = new Map(this.state.status_type_map); 
                 
                    if(this.props.dashboardButton){

                        newFilteredComplaints = newFilteredComplaints.filter(complaint => (
                            complaint['complaint_status'] && (complaint['complaint_status'].toUpperCase() !== this.props.dashboardButton.toUpperCase())
                        ));
                        
                        const checked = !newMap.get(this.props.dashboardButton)
                        newMap.set(this.props.dashboardButton.toUpperCase(),checked);
                        console.log(newMap,this.props.dashboardButton);

                    }

                    
                    this.setState({
                        status_type_map : newMap,
                        filteredComplaints : newFilteredComplaints,
                    })
                }else{
                    this.handleDialogOpen(res.data, "Error");
                }
            })
            .catch(err => {
                console.log(err);      
                this.setState({
                    lodding : false
                });          
                this.handleDialogOpen(err.message, "Error")
            });
    }

    handleFilterBar = () => {
        this.setState({
            filterDialogState: true
        })
    }

    handleFilterClose = () => {
        this.setState({
            filterDialogState: false
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
                {/* <Button>Hello</Button> */}
            </GeneralDialog>
            {
                this.allComplaints && this.allComplaints.length !== 0 ?
                <Grid container spacing={0} style={{margin:'auto'}}>
                    <Grid item md={3} xs={12} style={{height: '97vh', paddingTop: '56px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <SideFilter 
                            status_type_map={this.state.status_type_map} 
                            griev_type_map={this.state.griev_type_map} 
                            emergency_state={this.state.emergency_state}
                            handleChange={this.handleChange}
                            handleEndingDateChange = {this.handleEndingDateChange}
                            handleStartingDateChange ={this.handleStartingDateChange}
                        />
                    </Grid>
                    <Grid item md={9} xs={12} >
                        {
                            (this.state.filteredComplaints && this.state.filteredComplaints.length != 0)
                            ?(
                                this.state.lodding
                                    ? (<CircularProgress className={classes.progress} />)
                                    :
                                    (<div style={{paddingTop: '60px'}}>
                                        <Switch >
                                            <Route exact path="/Dashboard/Complaints/Table" render={() => (<ComplaintTable complaintsData={this.state.filteredComplaints} />)} />
                                            <Route exact path="/Dashboard/Complaints/Reports" render={() => (<ComplaintReport complaintsData={this.state.filteredComplaints} />)} />
                                            <Route exact path="/Dashboard/Complaints/Maps" render={() => (<ComplaintMap complaintsData={this.state.filteredComplaints} />)} />
                                            <Route path="/Dashboard/Complaints/*">
                                                <Redirect to="/Dashboard/" />
                                            </Route>
                                        </Switch>
                                    </div>)
                            ) 
                            :(
                                <div className={classes.progressWrapper} style={{height: '100vh'}}>
                                    <div style={{margin: 'auto', textAlign: 'center'}}>
                                        <img src={Empty} style={{width: '100px'}} />
                                        <br />
                                        <br />
                                        <Typography variant="display2" style={{color: 'black'}}>No such Complaints</Typography>
                                        <br />
                                        <Typography variant="headline" style={{color: 'rgba(0,0,0,0.5)'}}>Try some diffrent combinations</Typography>
                                    </div>
                                </div>
                            )

                        } 
                    </Grid>
                </Grid>
                :
                <div className={classes.progressWrapper} style={{height: '100vh'}}>
                    <div style={{margin: 'auto', textAlign: 'center'}}>
                        <img src={Empty} style={{width: '100px'}} />
                        <br />
                        <br />
                        <Typography variant="display2" style={{color: 'black'}}>No Complaints...Yet!</Typography>
                        <br />
                        <Typography variant="headline" style={{color: 'rgba(0,0,0,0.5)'}}>Complaints posted by citizen will be shown here</Typography>
                    </div>
                </div>
            }
          </div>  
        );
    }
}

ComplaintContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintContainer);