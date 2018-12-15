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

import ComplaintFullView from "../Components/ComplaintFullView";

// import Card from '@material-ui/core/Card';

const styles = theme => ({

})

class ComplaintTable extends Component {

    state = {
        page: 0,
        rowsPerPage: 25,
        openComplaintDialogState: false,
        ComplaintDialogData: null
    };

    //-----------------------------------------
    //handling complaint full view
    handleComplaintDialogClose = () => {
        this.setState({
            ComplaintDialogData: null,
            openComplaintDialogState: false
        })
    }

    handleComplaintDialogOpen = (ComplaintDialogData) => {
        this.setState({
            ComplaintDialogData: ComplaintDialogData,
            openComplaintDialogState: true
        })
    }
    //----------------------------------------------


    //----------------------------------------------
    //handling table pagination
    handleChangePage = (event, page) => {
        this.setState({ page });
      };
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    //----------------------------------------------

    exportExcel(e){
        var Results = [
            ["_id", "road_code", "name", "postedUsers","location","isEmergency","grievType","description","complaint_status","time","estimated_completion"],
            ["Data", 50, 100, 500],
            ["Data", -100, 20, 100],
          ];
        
        var CsvString = "";
        Results.forEach(function(RowItem, RowIndex) {
          RowItem.forEach(function(ColItem, ColIndex) {
            CsvString += ColItem + ',';
          });
          CsvString += "\r\n";
        });

        window.open("data:application/csv," + encodeURIComponent(CsvString));
        console.log("Exprot excel ",e);
        //window.open('data:application/vnd.ms-excel,' + encodeURIComponent(CsvString));
        
    }


    render() {
        // let { classes } = this.props;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.complaintsData.length - page * rowsPerPage);

        return (
            <Paper>
                <ComplaintFullView ComplaintDialogData={this.state.ComplaintDialogData} handleComplaintDialogClose={this.handleComplaintDialogClose} openComplaintDialogState={this.state.openComplaintDialogState}  />
                <Toolbar style={{overflowX: 'auto',}}>
                    <Grid container>
                        <Grid item xs>
                            <Typography variant="title">Complaints Table</Typography>
                            
                        </Grid>
                        <Grid item xs>
                            <Button onClick={this.exportExcel} href=""> Export for Excel </Button>
                            <TablePagination
                                component="div"
                                count={this.props.complaintsData.length}
                                rowsPerPageOptions={[15, 30, 45]}
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
                        </Grid>
                    </Grid>
                </Toolbar>
                { this.props.isLoading ? <LinearProgress /> : '' }
                <div style={{overflowX: 'auto',}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>index</TableCell>
                                <TableCell>Girevance</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Emergency</TableCell>
                                <TableCell>#</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.complaintsData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" >{page * rowsPerPage + index+1}</TableCell>
                                        <TableCell>{item.grievType}</TableCell>
                                        <TableCell>{item.complaint_status}</TableCell>
                                        <TableCell>NO</TableCell>
                                        <TableCell><Button 
                                            onClick={
                                                () => {
                                                    this.handleComplaintDialogOpen(item);
                                                }
                                            }
                                            color="secondary"
                                            variant="raised"
                                        >view</Button></TableCell>
                                    </TableRow>
                                ))
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>  
        );
    }
}

ComplaintTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintTable);