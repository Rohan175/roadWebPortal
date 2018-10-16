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

import CloseIcon from '@material-ui/icons/Close';

import ImageCarousel from "./ImageCarousel";
import { getFormatedDate } from "../constants";

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
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ComplaintFullView extends Component {

    state = {
        new_estimated_time: null,
        new_isEmergency: false,
        new_complaint_status: "Pending",
        Comment: null,
        new_forword_complaint: null
    }

    handleIsEmergency = () => {        
        this.setState(prevState => {
            return { new_isEmergency: !(prevState.new_isEmergency) }
        })
    }

    handleEstimatedDateChange = (date) => {
        this.setState({ new_estimated_time: getFormatedDate(date) });
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
    
    }

    componentWillMount() {
        this.setState({
            new_complaint_status: this.props.complaintData ? this.props.complaintData.complaint_status : "Pending",
            new_estimated_time: this.props.complaintData ? this.props.complaintData.estimated_time : null,
            new_isEmergency: this.props.complaintData ? this.props.complaintData.isEmergency : false
        })
    }

    componentWillReceiveProps() {
        this.setState({
            new_estimated_time: null,
            new_isEmergency: false,
            new_complaint_status: "Pending",
            Comment: null,
            new_forword_complaint: null
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
                            <Typography>{ "Date :   ".toUpperCase() + (complaintData? complaintData : null)}</Typography>
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
                                        <InputLabel htmlFor="new_forword_complaint">Forword Complaint</InputLabel>
                                        <Select
                                            value={this.state.new_forword_complaint}
                                            // onChange={this.handleChange}
                                            inputProps={{
                                                name: 'new_forword_complaint',
                                                id: 'new_forword_complaint',
                                            }}
                                             >
                                            <MenuItem value="Pending" disabled>Pending</MenuItem>
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
                        </Grid>
                    </Grid>
                    {/* <Grid container>
                        <Grid item xs={12} md className={classes.paddingClass}>
                            
                        </Grid>
                        <Grid item xs={12} md className={classes.paddingClass}>
                        
                        </Grid>
                    </Grid> */}
                </Dialog>
            </div>
        );
    }
}

ComplaintFullView.propTypes = {
classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintFullView);