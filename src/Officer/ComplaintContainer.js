import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SideFilter from "../Components/SideFilter";
import ComplaintTable from "./ComplaintTable";
import ComplaintReport from "./ComplaintReport";
import ComplaintMap from "./ComplaintMap";
import GeneralDialog from '../Components/GeneralDialog';
import { griev_type,status_type,getCookie, url } from '../constants';
// import Card from '@material-ui/core/Card';
import Empty from '../res/empty.svg';
import { Button } from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';

const styles = theme => ({
    progressWrapper: {
        width: '100%',
        display: 'flex'
    },
    progress: {
        margin: 'auto',
        marginTop : '50px',
        textAlign: 'center',
       
    },
    wrapper: {
      //  paddingTop: '60px',
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
    },
    sideFilterGrid: {
        height: '97vh',
        paddingTop: '56px', 
        overflowY: 'scroll', 
        overflowX: 'hidden',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    sideFilterButton: {
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        display: 'none',
        [theme.breakpoints.down('sm')]: {
          display: 'flex',
        },
    }
})

class ComplaintContainer extends Component {

    state = {
        StartingDate: new Date(new Date().setMonth(new Date().getMonth()-6)).setHours(0,0,0,0),
        EndingDate: new Date().setHours(0,0,0,0),
        griev_type_map: new Map(griev_type),
        status_type_map : new Map(status_type),
        emergency_state : true,
        startAnimation: false,
        lodding : true,
        SideFilter: true,
        emptyList: true,
        filteredComplaints: [],

        mobileFilterDialogOpen: false,
    }
    
    handleIndividualComplaintChange = (complaintData,isComplainForwarded) => {

        console.log(complaintData,isComplainForwarded);
        
        if(isComplainForwarded){

            this.allComplaints.splice(this.allComplaints.findIndex(c => c._id === complaintData._id),1);
            this.setState(oldState =>{
                oldState.filteredComplaints.splice(oldState.filteredComplaints.findIndex(c => c._id === complaintData._id),1);

                return {
                    filteredComplaints : oldState.filteredComplaints,
                }
            })
            

        }else{
            let c = this.allComplaints.find(c => c._id === complaintData.complaint_id)
            c.complaint_status = complaintData.complaint_status;
            c.isEmergency = complaintData.isEmergency

            this.setState((oldState) => {
                let cod = oldState.filteredComplaints.find(c => c._id === complaintData.complaint_id);
                cod.complaint_status = complaintData.complaint_status;
                cod.isEmergency = complaintData.isEmergency;
            })
        }
    }

    handleStartingDateChange = (date) => {
        
        this.setState( oldState  => {

            let newFilteredComplaints;
                
            if(date > this.state.StartingDate){

                if(oldState.filteredComplaints.length === 0){
                    newFilteredComplaints = this.allComplaints;
                }
                
                newFilteredComplaints = oldState.filteredComplaints.filter(complaint => (
                    complaint['time'] && (complaint['time'] >= date)
                ));

                console.log('After Remove :',newFilteredComplaints);

            }else{

                newFilteredComplaints = this.allComplaints.filter(complaint => {
                                
                    return complaint.complaint_status
                        && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                        && complaint.griev_type
                        && oldState.griev_type_map.get(complaint.griev_type.toUpperCase())
                        && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                        && (complaint.time >= date && complaint.time <= oldState.EndingDate)
                });

                console.log('After all filter :',newFilteredComplaints);

            }

            return { 
                filteredComplaints : newFilteredComplaints,
                StartingDate: date 
            }
        });

    }

    handleEndingDateChange = (date) => {
        
        date = date.setHours(0,0,0,0);
        this.setState( oldState  => {

            let newFilteredComplaints;
            if(date < this.state.EndingDate){

                if(oldState.filteredComplaints.length === 0){
                    newFilteredComplaints = this.allComplaints;
                }
                
                newFilteredComplaints = oldState.filteredComplaints.filter(complaint => {
                    console.log(complaint['time'] && (complaint['time'] <= date),new Date(date),new Date(complaint['time']));
                    
                    return complaint['time'] && (complaint['time'] <= date)
                });

                console.log('After Remove :',newFilteredComplaints);
            }else{

                newFilteredComplaints = this.allComplaints.filter(complaint => {
                                
                    return complaint.complaint_status
                        && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                        && complaint.griev_type
                        && oldState.griev_type_map.get(complaint.griev_type.toUpperCase())
                        && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                        && (complaint.time >= oldState.StartingDate && complaint.time <= date)
                        
                });

                console.log('After all filter :',newFilteredComplaints);
            }

            return { 
                filteredComplaints : newFilteredComplaints,
                EndingDate: date 
            }
        });


    }

    handleChange = name => e  => {

        
        this.setState({
            lodding : true
        });

        const value = e.target.value;
        console.log('handleChange : ',value,name);
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

                    // console.log("here2",oldState.emergency_state,this.allComplaints[0].isEmergency,(oldState.emergency_state===true || oldState.emergency_state !== this.allComplaints[0].isEmergency));
                    // console.log("here3",oldState.emergency_state,this.allComplaints[1].isEmergency,(oldState.emergency_state===true || oldState.emergency_state !== this.allComplaints[1].isEmergency));
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.griev_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.complaint_status
                                && complaint.complaint_status.toUpperCase() == value.toUpperCase() 
                                && complaint.griev_type
                                && oldState.griev_type_map.get(complaint.griev_type.toUpperCase())
                                && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                                && (complaint.time >= oldState.StartingDate && complaint.time <= oldState.EndingDate)
                        });
                    
                    newFilteredComplaints = newFilteredComplaints.concat(oldState.filteredComplaints)
                    //console.log(newFilteredComplaints);

                }else if(name === "griev_type_map"){
                            
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.status_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.griev_type
                                && complaint.griev_type.toUpperCase() == value.toUpperCase() 
                                && complaint.complaint_status
                                && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                                && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                                && (complaint.time >= oldState.StartingDate && complaint.time <= oldState.EndingDate)
                        });
                    
                    newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
                    //console.log(newFilteredComplaints);

                }else if(name === "emergency_state"){

                    console.log("here ",this.allComplaints,oldState)
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                        
                        return complaint.griev_type
                            && oldState.griev_type_map.get(complaint.griev_type.toUpperCase())
                            && complaint.complaint_status
                            && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                            && (complaint.time >= oldState.StartingDate && complaint.time <= oldState.EndingDate)
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
                        jsonName = "griev_type"
                    }

                    //console.log(value,oldState.filteredComplaints[0][jsonName] && (oldState.filteredComplaints[0][jsonName].toUpperCase()));

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

    handleClose = name => () => {
        this.setState({ [name]: false });
    };

    handleFilterOpen = () => {
        this.setState({
            mobileFilterDialogOpen: true
        })
    }

    exportExcel(e){

        console.log("Excel : ");        
        console.log(this);
        
        console.log(this.state.filteredComplaints);
        var Headers = Object.keys(this.state.filteredComplaints[0]);
        console.log(Headers);
        //     ["_id", "road_code", "name", "postedUsers","location","isEmergency","griev_type",
        // "description","complaint_status","time","estimated_completion"];
            
        let mHeaders = ["longitude","latitude", "complaint_status", "isEmergency", "_id", "road_code", "name", "griev_type", "time", "estimated_completion"];
        var CsvString = "";

        mHeaders.forEach(function(ColItem, ColIndex) {
            CsvString += ColItem + ',';
        });
        CsvString += "\r\n";
        this.state.filteredComplaints.forEach(function(RowItem, RowIndex) {
            Headers.forEach(function(ColItem, ColIndex) {
                
                if(ColItem === 'time' || ColItem ==='estimated_completion'){

                    let mDate = new Date(RowItem[ColItem]);
                    RowItem[ColItem] = mDate.getDate() + "-" + mDate.getMonth() + "-" + mDate.getFullYear();

                    console.log(RowItem[ColItem]);
                }
            if(ColItem!=='comments' && ColItem!== 'posted_users'){
                console.log(ColItem, "  ", RowItem[ColItem]);
                CsvString += RowItem[ColItem] + ',';
            }else{
                console.log("Skiiping commenst & posted Uswers");
                
            }
          });
          CsvString += "\r\n";
          console.log("\n");
        });
        console.log(CsvString);
        
        let link = document.createElement('a');
        console.log("Excel ", document, link);
        document.body.appendChild(link);
        link.setAttribute('href','data:application/vnd.ms-excel;charset=utf-8,'+encodeURIComponent(CsvString));
        link.setAttribute('download','R&BPortal_Data.csv');
        link.setAttribute('target', '_self');
        link.click();

        //e.downlaod = "R&BPortal_Data.xls"
        //window.open("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," + encodeURIComponent(CsvString));
        console.log("Exprot excel ");
        //window.open('data:application/vnd.ms-excel,' + encodeURIComponent(CsvString));
        
    }

    componentDidMount() {
        this.setState({
            startAnimation: true,
        })

        let headers = new Headers();

        headers.append('origin', '*');
        headers.append('auth', 'token ' + getCookie("roadGPortalAuth"));

        let req;

        if(this.props.manageOfficer){
            
            let query = 'getJrOfficerComplaints?officerIds=';
            console.log(this.props.OfficerIdArray);

            for(let i = 0; i < this.props.OfficerIdArray.length; i++){
                
                query+= this.props.OfficerIdArray[i] + ';';
                //console.log(i);
            }
            console.log(query);

            query = query.slice(0,query.length-1)
            req = new Request(url  + query,{
                method: "GET",
                headers: headers,
                mode: 'cors'
            });

        }else{
                
            req = new Request(url  + "getComplaints?isPaginated=0", {
                method: "GET",
                headers: headers,
                mode: 'cors'
            });
        }
        
        fetch(req)
            .then(res => res.json())
            .then(res => {
               
                if(res.success){
                    console.log("complaints ", res);
                    
                    
                    console.log(res.complaints);
                    
                    let new_griv_type = new Map();
                    res.complaints.map(complaint => {
                        complaint.time = new Date(complaint.time).setHours(0,0,0,0);
                        new_griv_type.set(complaint.griev_type,true);
                    })
                    
                    res.complaints = res.complaints.filter(c =>  {
                            console.log(c.time, Number.isNaN(c.time));
                            return !Number.isNaN(c.time)
                    });

                    this.allComplaints = res.complaints;
                    
                    console.log(this.allComplaints);
                    
                    if(this.props.dashboardButton){
                        let value = this.props.dashboardButton;

                        if(value.toUpperCase() === 'EMERGENCY'){
                            
                            let newFilteredComplaints = this.allComplaints.filter(complaint => {
                                return complaint['isEmergency'] && (complaint['isEmergency'] == true)
                            });
                            
                            

                            this.setState({
                                emergency_state : false,
                                filteredComplaints : newFilteredComplaints,
                            })

                        }else{
                            
                            let newFilteredComplaints = res.complaints;
                            const newMap = new Map(this.state.status_type_map); 
                            for (var [key, value] of newMap) {
                                newMap.set(key,!value);
                            }

                            newFilteredComplaints = newFilteredComplaints.filter(complaint => (
                                complaint['complaint_status'] && (complaint['complaint_status'].toUpperCase() === this.props.dashboardButton.toUpperCase())
                            ));
                            
                            const checked = !newMap.get(this.props.dashboardButton)
                            newMap.set(this.props.dashboardButton.toUpperCase(),checked);
                            console.log(newMap,this.props.dashboardButton);
                            
                            
                            this.setState({
                                
                                status_type_map : newMap,
                                filteredComplaints : newFilteredComplaints,
                            })
                        }
                    
                        

                        
                    }else{
                        
                        this.setState({
                            filteredComplaints : this.allComplaints
                        })
                    }

                    this.setState({
                        lodding : false,
                        griev_type_map : new_griv_type
                    });

                    
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

    sideFilter = () => {
        console.log("SideFilter : ");
        console.log(this, this instanceof ComplaintContainer);

        return (
            <SideFilter 
                status_type_map={this.state.status_type_map} 
                griev_type_map={this.state.griev_type_map} 
                StartingDate={this.state.StartingDate}
                EndingDate={this.state.EndingDate}
                exportExcel = {this.exportExcel.bind(this)}
                emergency_state={this.state.emergency_state}
                handleChange={this.handleChange}
                handleEndingDateChange = {this.handleEndingDateChange}
                handleStartingDateChange ={this.handleStartingDateChange}
            />
        )
    }

    render() {
        let { classes } = this.props;
        //console.log(this.props);
        
        return (    
          <div className={classes.wrapper}>
            <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose("openDialog")}
                handleDialogOpen={this.handleDialogOpen}
            >
                {/* <Button>Hello</Button> */}
            </GeneralDialog>

            {this.props.manageOfficer && 
            (<IconButton color="inherit" style={{position: 'absolute', top: '10px', left: '10px'}} onClick={this.props.handleComplaintDialogClose} aria-label="Close">
                <CloseIcon />
            </IconButton>)}

            <GeneralDialog 
                openDialogState = {this.state.mobileFilterDialogOpen}
                dialogTitle = {"Filters"}
                dialogMsg = {""}  
                handleClose={this.handleClose("mobileFilterDialogOpen")}
                handleDialogOpen={this.handleFilterOpen}
            >
                {this.sideFilter()}
            </GeneralDialog>
            

                {this.state.lodding &&  <LinearProgress  className={classes.progress} />}    
                
                {!this.state.lodding && this.allComplaints && this.allComplaints.length !== 0 &&
                <Grid container spacing={0} style={{margin:'auto'}}>
                    <Grid item md={3} xs={12} className={classes.sideFilterGrid}>
                        {this.sideFilter()}
                    </Grid>
                    <Grid item md={9} xs={12} >
                        {   

                            (this.state.filteredComplaints && this.state.filteredComplaints.length != 0) ?
                            (this.props.manageOfficer ? 

                            (<div style={{paddingTop: '0px'}}>
                                    <ComplaintTable manageOfficer complaintsData={this.state.filteredComplaints} />
                            </div>)
                            : (<div style={{paddingTop: '50px'}}>
                                    <Switch >
                                        <Route exact path="/Dashboard/Complaints/Table" render={() => (<ComplaintTable complaintsData={this.state.filteredComplaints} handleIndividualComplaintChange={this.handleIndividualComplaintChange}/>)} />
                                        <Route exact path="/Dashboard/Complaints/Reports" render={() => (<ComplaintReport complaintsData={this.state.filteredComplaints} />)} />
                                        <Route exact path="/Dashboard/Complaints/Maps" render={() => (<ComplaintMap complaintsData={this.state.filteredComplaints } handleIndividualComplaintChange={this.handleIndividualComplaintChange} />)} />
                                        <Route path="/Dashboard/Complaints/*">
                                            <Redirect to="/Dashboard/" />
                                        </Route>
                                    </Switch>
                                </div>)
                            )
                            : (
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
                                                        <Button variant="extendedFab" color="secondary" onClick={this.handleFilterOpen} className={classes.sideFilterButton}><FilterIcon />&nbsp;Filter</Button>
                    </Grid>
                </Grid>
                }
                
                {!this.state.lodding && this.allComplaints && this.allComplaints.length === 0 &&
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