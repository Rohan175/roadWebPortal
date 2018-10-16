import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import SideFilter from "../Components/SideFilter";
import ComplaintTable from "./ComplaintTable";
import ComplaintReport from "./ComplaintReport";
import GeneralDialog from '../Components/GeneralDialog';
import { griev_type,status_type,getCookie, url } from '../constants';
// import Card from '@material-ui/core/Card';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
    wrapper: {
        // marginTop: '-56px',
        // width: '100vw',
        // height: '100vh',
        display: 'flex'
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
        officers: this.officers,
        startAnimation: false,
        lodding : true,
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
        this.setState( oldState  => {
            
            const newMap = new Map(oldState[name]);
            const checked = !newMap.get(value)
            newMap.set(value,checked);

            let newFilteredComplaints = [];

            
            if(checked){
                
                if(name === "status_type_map"){
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.griev_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.complaint_status
                                && complaint.complaint_status.toUpperCase() == value.toUpperCase() 
                                && complaint.grievType
                                && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                        });
                    
                    newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
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
                        });
                    
                    newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
                    //console.log(newFilteredComplaints);

                }

            }else{
                console.log("removing",oldState.filteredComplaints);
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

        // console.log(getCookie("roadGPortalAuth"));
        

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
                    res.complaints.map(complaint => {
                        complaint.time = new Date(complaint.time);
                    })
                    
                    this.allComplaints = res.complaints;
                    
                    console.log(this.allComplaints);
                    
                    this.setState({
                        filteredComplaints : res.complaints,
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
            <Grid container spacing={8} style={{margin:'auto'}}>
                <Grid item sm={3} xs={12} style={{height: '90vh', overflowY:'scroll'}}>
                    <Slide direction="right" in={true}>
                        <SideFilter status_type_map={this.state.status_type_map}  griev_type_map={this.state.griev_type_map} 
                                    handleChange={this.handleChange}
                                    handleEndingDateChange = {this.handleEndingDateChange}
                                    handleStartingDateChange ={this.handleStartingDateChange}
                        /> 
                    </Slide>
                </Grid>
                <Grid item sm={9} xs={12} >
                    
                    {this.state.lodding
                        ? (<CircularProgress className={classes.progress} />)
                        :
                        (<div style={{margin: '10px', height: '80vh', overflowY:'scroll'}}>
                            <Switch >
                                <Route exact path="/Dashboard/Complaints/Table" render={() => (<ComplaintTable complaintsData={this.state.filteredComplaints} />)} />
                                <Route exact path="/Dashboard/Complaints/Reports" render={() => (<ComplaintReport complaintsData={this.state.filteredComplaints} />)} />
                                <Route exact path="/Dashboard/Complaints/Maps" render={() => (<h1>Complaint Maps</h1>)} />
                                <Route path="/Dashboard/Complaints/*">
                                    <Redirect to="/Dashboard/" />
                                </Route>
                            </Switch>
                        </div>)
                    }
                </Grid>
            </Grid>
          </div>  
        );
    }
}

ComplaintContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintContainer);