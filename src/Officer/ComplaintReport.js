import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import GeneralDialog from '../Components/GeneralDialog';
import ComplaintFullView from "../Components/ComplaintFullView";
import { griev_type,status_type,getCookie, url } from '../constants';
// import Card from '@material-ui/core/Card';

const styles = theme => ({

})

class ComplaintReport extends Component {

    state = {
        openOfficerDialog: false,
        openErrorDialog : false,
        OfficerData: null,
        OfficerDialogData : null,
        Loading : true
    };

    handleOfficerDialogClose = () => {
        this.setState({
            OfficerDialogData: null,
            openOfficerDialog: false
        })
    }

    handleOfficerDialogOpen = (OfficerDialogData) => {


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

        this.setState({
            OfficerDialogData: OfficerDialogData,
            openOfficerDialog: true
        })
    }

    
    handleDialogOpen = (dialogMsg, dialogTitle) => {        
      this.setState({ 
          openErrorDialog: true,
          dialogMsg: dialogMsg,
          dialogTitle: dialogTitle
      });
    };

    handleClose = () => {
        this.setState({ openErrorDialog: false });
    };

    componentDidMount() {

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
            console.log(res)
              this.setState({
                  Loading : true
              });

              if(res.success){
    
                  this.setState({
                    OfficerDialogData : res.data,
                  })
              }else{
                  this.handleDialogOpen(res.data, "Error");
              }
          })
          .catch(err => {
              console.log(err);      
              this.setState({
                  Loading : false
              });          
              this.handleDialogOpen(err.message, "Error")
          });
  }

    render() {

        return (
            <Paper>
                  <GeneralDialog 
                    openDialogState = {this.state.openDialog}
                    dialogTitle = {this.state.dialogTitle}
                    dialogMsg = {this.state.dialogMsg}  
                    handleClose={this.handleClose}
                    handleDialogOpen={this.handleDialogOpen}
                >
                    {/* <Button>Hello</Button> */}
                </GeneralDialog>
                
                <ComplaintFullView 
                    OfficerDialogData={this.state.OfficerDialogData}
                    handleComplaintDialogClose={this.handleOfficerDialogClose} 
                    openComplaintDialogState={this.state.openComplaintDialogState}  />
              
                { this.state.Loading ? <LinearProgress /> :  
                <div style={{overflowX: 'auto',}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>index</TableCell>
                                <TableCell>Officer Name</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Complaints</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.OfficerData
                                .map((item, index) => (
                                    <TableRow key={index}>

                                        <TableCell>{item.grievType}</TableCell>
                                        <TableCell>{item.complaint_status}</TableCell>
                                        <TableCell>NO</TableCell>
                                        <TableCell>
                                            <Button 
                                                onClick={
                                                    () => {
                                                        this.handleOfficerDialogOpen(item,"Profile");
                                                    }
                                                }
                                                color="secondary"
                                                variant="outlined"
                                                >
                                               View
                                              </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                onClick={
                                                    () => {
                                                        this.handleOfficerDialogOpen(item,"Complaint");
                                                    }
                                                }
                                                color="secondary"
                                                variant="outlined"
                                                >
                                               Update
                                              </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                }
            </Paper>  
        );
    }
}

ComplaintReport.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintReport);