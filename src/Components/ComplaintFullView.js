import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DatePicker from 'material-ui-pickers/DatePicker';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import CloseIcon from '@material-ui/icons/Close';

import ImageCarousel from "./ImageCarousel";
import { getFormatedDate, getCookie, url } from "../constants";

const styles = theme => ({
    ComplaintFullView: {
        // overflow: 'hidden'
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
        margin: '20px'
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
        openSnackbarState: false,
        snackbarMessage: '',
        snackbarVarient: '',

        comments : [],
        Comment: null,
        new_forword_complaint: null,
        new_complaint_status: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.complaint_status : "Pending",
        new_estimated_time: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.estimated_time : new Date(),
        new_isEmergency: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.isEmergency : false
    }

    handleIsEmergency = () => {        
        this.setState(prevState => {
            return { new_isEmergency: !(prevState.new_isEmergency) }
        })
    }

    handleEstimatedDateChange = (date) => {
        this.setState({ new_estimated_time: date });
    }

    handleChange = e => {    
        this.setState({ [e.target.name]: e.target.value });
    };

    handleComment = e => {
        this.setState({
            Comment: e.target.value
        })
    }

    handleSave = () => {
        // updateComplaint

        let reqBody = {
            complaint_id: this.props.ComplaintDialogData._id, 
            complaint_status: this.state.new_complaint_status,
            estimated_completion: this.state.new_estimated_time,
            isEmergency: this.state.new_isEmergency,
            comment: this.state.Comment
        }        

        fetch(url + "updateComplaint/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth': 'token ' + getCookie("roadGPortalAuth")
                },
                method: "POST",
                body: JSON.stringify(reqBody)
            }
        )
        .then(res => res.json())
        .then(res => {
            if(res.success) {
                this.setState({
                    openSnackbarState: true,
                    snackbarMessage: 'Complaint has been updated',
                    snackbarStyle: {
                        backgroundColor: green[600],
                        display: 'flex',
                    },
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    handleSnackbarClose = () => {
        this.setState({
            openSnackbarState: false,
            snackbarMessage: '',
            snackbarVarient: {},
        })
    }

    componentWillMount() {
        this.setState({
            Comment: null,
            new_forword_complaint: null,
            new_complaint_status: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.complaint_status : "Pending",
            new_estimated_time: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.estimated_time : new Date(),
            new_isEmergency: this.props.ComplaintDialogData ? this.props.ComplaintDialogData.isEmergency : false
        })
    }

    componentWillReceiveProps(nextProps) {
       let ComplaintDialogData = nextProps.ComplaintDialogData            
        this.setState({
            Comment: null,
            comments: ComplaintDialogData ? ComplaintDialogData.comments : [],
            new_forword_complaint: null,
            new_complaint_status: ComplaintDialogData ? ComplaintDialogData.complaint_status : "Pending",
            new_estimated_time: ComplaintDialogData ? ComplaintDialogData.estimated_time : null,
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
                fullScreen
                open={props.openComplaintDialogState}
                onClose={props.handleComplaintDialogClose}
                TransitionComponent={Transition}
                className={classes.ComplaintFullView} >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={props.handleComplaintDialogClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                    Complaint
                            </Typography>
                            <Button color="inherit" onClick={this.handleSave}>
                                Save
                            </Button>
                        </Toolbar>
                    </AppBar>
                {/* complaint content here */}
                    <Grid container>
                        <Grid item xs={12} md className={classes.paddingClass}>
                            <ImageCarousel postedUsers={complaintData? complaintData.postedUsers : null} />
                        </Grid>
                        <Grid item xs={12} md className={classes.paddingClass}>
                            <Typography variant="headline">{(complaintData? complaintData.name : null)}</Typography>
                            <br />
                            <Divider />
                            <br />
                            <Typography>{ "Grievance :   ".toUpperCase() + (complaintData? complaintData.grievType : null)} <Button color="secondary" size="small" style={{float: 'right'}}>view on map</Button></Typography>
                            <br />
                            <Typography>{ "Status :   ".toUpperCase() + (complaintData? complaintData.complaint_status : null)}</Typography>
                            <br />
                            <Typography>{ "Date :   ".toUpperCase() + (complaintData? complaintData.time : null)}</Typography>
                            <br />
                            <Typography>{ "Emergency :   ".toUpperCase() + (complaintData? (complaintData.isEmergency) ? "YES": "NO" : null)}</Typography>
                            <br />
                            <Typography>{ "Description :   ".toUpperCase() + (complaintData? complaintData.description : null)}</Typography>
                            { complaintData && complaintData.estimated_time ? <Typography><br />{ "Estimated Date :   ".toUpperCase() + (complaintData? complaintData.estimated_time : null)}</Typography> : null }
                            <br />
                            <Divider />
                            <br />
                            <Grid container>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                    <FormControlLabel
                                        checked={this.state.new_isEmergency}
                                        onChange={this.handleIsEmergency}
                                        value="isEmergency"
                                        control={ <Checkbox /> }
                                        label="Mark Complaint as Emergency" />
                                </Grid>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="complaint_status">Change Complaint Status</InputLabel>
                                        <Select
                                            value={this.state.new_complaint_status}
                                            onChange={this.handleChange}
                                            inputProps={{
                                                name: 'new_complaint_status',
                                                id: 'new_complaint_status',
                                            }} >
                                            <MenuItem value="Pending" disabled>Pending</MenuItem>
                                            <MenuItem value="Approved">Approved</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Typography variant="caption">Set Estimated Date</Typography>
                                        <DatePicker 
                                            error={this.state.estimated_time_Error}
                                            helperText={this.state.estimated_time_helper_text}
                                            value={this.state.new_estimated_time}
                                            onChange={this.handleEstimatedDateChange}
                                            style={{width: '100%'}}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid xs={12} md className={classes.textWrapper}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="new_forword_complaint">Forword Complaint To</InputLabel>
                                        <Select
                                            value={this.state.new_forword_complaint}
                                            onChange={this.handleChange}
                                            inputProps={{
                                                name: 'new_forword_complaint',
                                                id: 'new_forword_complaint',
                                            }} >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Approved">Approved</MenuItem>
                                            <MenuItem value="Rejected">Rejected</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <TextField
                                id="Comment"
                                label="Comment"
                                multiline
                                error={this.state.comment_error}
                                helperText={this.state.comment_helper_text}
                                rows="4"
                                onChange={this.handleComment}
                                // defaultValue="Enter Your Coment Here.."
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{margin: '10px'}}
                                margin="normal" />
                            <br />
                            <Typography variant="title">Comments : </Typography>
                            <br />
                            {
                                // this.state.comments.map((comment, index) => (
                                //     <CardContent key={index}>
                                //         <Typography>{comment}</Typography>
                                //     </CardContent>
                                // ))
                            }
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
                        <SnackbarContent style={this.state.snackbarStyle}>
                            <span id="message-id" >{this.state.snackbarMessage}</span>
                        </SnackbarContent>
                    } />
            </div>
        );
    }
}

ComplaintFullView.propTypes = {
classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintFullView);