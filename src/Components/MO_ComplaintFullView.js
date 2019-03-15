import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
// import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
// import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import CloseIcon from '@material-ui/icons/Close';

import ImageCarousel from "./ImageCarousel";
import { getFormatedDate,openLocationInGoogleMaps, getCookie, url} from "../constants";




const styles = theme => ({
    root: {
        flexGrow: 1,
      },
    ComplaintFullView: {
        // overflow: 'hidden'
        padding: '20px'
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    alignCenter: {
        textAlign: 'center',
        margin: 'auto'
    },
    paddingClass: {
        // margin: '20px'
    },
    snackbar: {
        background: theme.palette.primary.light,
        // color: "black"
    },

    textField: {
        // minWidth: '270px'
        width: '100%',
        // marginleft: '10px'
    },
    textWrapper: {
        padding: '10px'
    }, 
    formControl: {
        minWidth: 280,
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}



class ComplaintFullView extends Component {

    state = {
        value: 0,
        openSnackbarState: false,
        snackbarMessage: '',
        snackbarVarient: '',

        comments : [],
        Comment: null,
        new_forword_complaint: "",
        
        show_new_complaint_status: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.complaint_status : "Pending",
        show_new_isEmergency: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.isEmergency : false,

        new_complaint_status: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.complaint_status : "Pending",
        new_estimated_time: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.estimated_time : new Date(),
        new_isEmergency: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.isEmergency : false,

        srOfficerArray: [],
        rejection_resons: []
    }

    handleIsEmergency = () => {        
        this.setState(prevState => {
            return { new_isEmergency: !(prevState.new_isEmergency) }
        })
    }

    handleChange = e => {
        this.setState({ Comment:"",[e.target.name]: e.target.value });
    };

    handleChangeComment = (comment) => {
        this.setState({
            Comment: comment
        })
    }
    
    handleSnackbarClose = () => {
        this.setState({
            openSnackbarState: false,
            snackbarMessage: '',
            snackbarVarient: {},
        })
    }




    componentWillReceiveProps(nextProps) {
       let ComplaintDialogData = nextProps.ComplaintDialogData;
       
       console.log("-----");
       console.log(ComplaintDialogData);

        this.setState({
            Comment: ComplaintDialogData ? ComplaintDialogData.comments[0] : null,
            comments: ComplaintDialogData ? ComplaintDialogData.comments : [],
            // new_forword_complaint: null,
            new_complaint_status: ComplaintDialogData ? ComplaintDialogData.complaint_status : "Pending",
            new_estimated_time: ComplaintDialogData && ComplaintDialogData.estimated_completion ? ComplaintDialogData.estimated_completion : new Date(),
            new_isEmergency: ComplaintDialogData ? ComplaintDialogData.isEmergency : false
        })
    }

    render() {
        let props = this.props;
        const { classes } = props;
        const complaintData = props.ComplaintDialogData;

        return (
            <div>
                <Dialog 
                
                open={props.openComplaintDialogState}
                onClose={props.handleComplaintDialogClose}
                TransitionComponent={Transition}
                className={classes.ComplaintFullView} >
                    <Typography variant="subhading" style={{marginLeft:'10px',marginRight:'10px',marginTop:'10px' ,textAlign: 'left'}}>{(complaintData? complaintData.name : null)}</Typography>
                    <Grid container  style={{ padding: '10px'}}>
                        <Grid item xs={12} md={6} className={classes.paddingClass}>
                                <Grid item xs={12}>
                                    <ImageCarousel postedUsers={complaintData? complaintData.posted_users : null} />
                                </Grid>
                        </Grid>
                     <Grid item xs={12} md={6} className={classes.paddingClass}>
                                <br/>
                                <Typography>{ "Emergency :   ".toUpperCase() + (complaintData? this.state.show_new_isEmergency ? "YES": "NO" : null)}</Typography>
                                <br/> 
                                <Typography>{ "Grievance :   ".toUpperCase() + (complaintData? complaintData.griev_type : null)} <Button color="secondary" size="small" style={{float: 'right', display: 'none'}}>view on map</Button></Typography>
                                <br />
                                <Typography>{ "Status :   ".toUpperCase() + (complaintData? this.state.show_new_complaint_status : null)}</Typography>
                                <br />
                                <Typography>{ "Date :   ".toUpperCase() + 
                                (complaintData
                                            ? new Date(complaintData.time)
                                                .toLocaleDateString("en-US",{
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                }) 
                                            : null)}
                                </Typography>
                               
                                { this.state.new_estimated_time ? 
                                
                                <Typography><br />{ "Estimated Date :   ".toUpperCase() + getFormatedDate(this.state.new_estimated_time)}</Typography> : null }
                               
                               <br/>     <br/>
                                    <Button variant="outlined" size="small" style={{width:"100%"}} onClick={() => { openLocationInGoogleMaps(... (complaintData? complaintData.location: [1,2]) ) }}  color="secondary">SHOW ON MAP</Button>
                                    
                         </Grid>   
                         </Grid>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}
                    open={this.state.openSnackbarState}
                    autoHideDuration={5000}
                    onClose={this.handleSnackbarClose}
                    ContentProps={{
                    'aria-describedby': 'message-id',
                    }}
                    message={
                        <span id="message-id" >{this.state.snackbarMessage}</span>
                    } />
            </div>
        );
    }
}

ComplaintFullView.propTypes = {
    classes: PropTypes.object.isRequired,
    };

export default withStyles(styles)(ComplaintFullView);