import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Profile from './Profile';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import ComplaintContainer from './ComplaintContainer';
import GeneralDialog from '../Components/GeneralDialog';
import ComplaintFullView from "../Components/ComplaintFullView";
import { griev_type,status_type,getCookie, url } from '../constants';
// import Card from '@material-ui/core/Card';

const styles = theme => ({

})

function Transition(props) {
    return <Slide direction="up" {...props} />;
  }


class ComplaintReport extends Component {

    state = {
        page: 0,
        rowsPerPage: 10,

        openOfficerDialogState: false,
        openComplaintDialogState : false,
        openErrorDialog : false,

        OfficerData: null,

        OfficerDialogData : null,
        ComplaintDialogData : null,
        
        Loading : true
    };

     //handling table pagination
     handleChangePage = (event, page) => {
        this.setState({ page });
      };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    //------------------

     
    handleComplaintDialogClose = () => {
        this.setState({
            OfficerDialogData: null,
            openComplaintDialogState: false
        })
    }

    handleOfficerDialogClose = () => {
        this.setState({
            OfficerDialogData: null,
            openOfficerDialogState: false
        })
    }

    handleOfficerDialogOpen = (OfficerDialogData) => {
        this.setState({
            OfficerDialogData: OfficerDialogData,
            openOfficerDialogState : true
        })
    }

    handleComplaintDialogOpen = (OfficerDialogData) => {

        this.setState({
            OfficerDialogData: OfficerDialogData,
            openComplaintDialogState : true
        })


        let headers = new Headers();
        headers.append('origin', '*');
        headers.append('auth', 'token ' + getCookie("roadGPortalAuth"));

        let req = new Request(url  + "testOfficers", {
            method: "GET",
            headers: headers,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(res => {
               
                this.setState({
                    Loading : false
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

      let req = new Request(url  + "testOfficers", {
          method: "GET",
          headers: headers,
          mode: 'cors'
      });

      fetch(req)
          .then(res => res.json())
          .then(res => {
            console.log(res)
              
              console.log("officerData",res);
                  this.setState({
                    Loading : false,
                    OfficerData : res,
                  })
              
            //   if(res.success){
                  
            //       this.setState({
            //         OfficerDialogData : res.data,
            //       })
            //   }else{
            //       this.handleDialogOpen(res.data, "Error");
            //   }
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

        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.complaintsData.length - page * rowsPerPage);

    
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
                
                {/* <ComplaintFullView 
                    OfficerDialogData={this.state.OfficerDialogData}
                    handleComplaintDialogClose={this.handleOfficerDialogClose} 
                    openComplaintDialogState={this.state.openComplaintDialogState}  /> */}

                <Dialog
                        fullScreen
                        open={this.state.openComplaintDialogState}
                        onClose={this.handleComplaintDialogOpen}
                        TransitionComponent={Transition}
                    >
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.handleComplaintDialogClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                    <ComplaintContainer />
                </Dialog>

                <Dialog
                        fullScreen
                        open={this.state.openOfficerDialogState}
                        onClose={this.handleOfficerDialogClose}
                        TransitionComponent={Transition}
                    >
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.handleOfficerDialogClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                    <Profile OfficerData={this.state.OfficerDialogData}/>
                </Dialog>

                { this.state.Loading ? <LinearProgress /> :  
                <div style={{overflowX: 'auto',}}>

                            <TablePagination
                                component="div"
                                count={this.state.OfficerData.length}
                                rowsPerPageOptions={[5, 10, 15]}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                backIconButtonProps={{
                                'aria-label': 'Previous Page',
                                }}
                                nextIconButtonProps={{
                                'aria-label': 'Next Page',
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>index</TableCell>
                                <TableCell>Officer Name</TableCell>
                                <TableCell>Officer Role</TableCell>
                                <TableCell>Profile</TableCell>
                                <TableCell>Complaints</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.OfficerData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow key={index}>

                                        <TableCell>NO</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.role}</TableCell>
                                        <TableCell>
                                            <Button 
                                                onClick={
                                                    () => {
                                                        this.handleOfficerDialogOpen(item);
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
                                                        this.handleComplaintDialogOpen(item);
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
                        {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                        )}

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