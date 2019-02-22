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
// import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
// import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import CloseIcon from '@material-ui/icons/Close';

import ImageCarousel from "./ImageCarousel";
import { getFormatedDate, getCookie, url, hierarchy } from "../constants";
// import { tr } from 'date-fns/esm/locale';

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
        new_forword_complaint: "",
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
        
        if(this.state.new_complaint_status == "Rejected" && ( this.state.Comment == "" || this.state.Comment == null ) ) {
            this.setState({
                openSnackbarState: true,
                snackbarMessage: 'Please select a rejection reason',
                snackbarStyle: {
                    backgroundColor: green[600],
                    display: 'flex',
                },
            }) 
            return;
        }

        Date.prototype.withoutTime = function () {
            var d = new Date(this);
            d.setHours(0, 0, 0, 0);
            return d;
        }
        let today = new Date();
        
        this.setState({
            new_estimated_time: new Date(this.state.new_estimated_time)
        },() => {

            console.log(this.state.new_estimated_time);
            

            if(this.state.new_estimated_time.withoutTime() < today.withoutTime()) {
                this.setState({
                    openSnackbarState: true,
                    snackbarMessage: 'Invalid Date',
                    snackbarStyle: {
                        backgroundColor: green[600],
                        display: 'flex',
                    },
                })    
            }
            // console.log(this.state);
            

            // this.setState({
            //     openSnackbarState: true,
            //     snackbarMessage: this.state.new_estimated_time,
            // })

            // return;
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
                    })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    openSnackbarState: true,
                    snackbarMessage: err.message,
                })
            });
        });
    }

    handleForeword = () => {
        fetch(url + "forewordComplaint/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth': 'token ' + getCookie("roadGPortalAuth")
            },
            method: "POST",
            body: JSON.stringify({
                officerId: this.state.new_forword_complaint,
                complaint_id: this.props.ComplaintDialogData._id
            })
        })
        .then(res => res.json())
        .then(res => {
            console.log("foreword complaint response", res);
            
            // if(res.success) {
            //     this.setState({
            //         openSnackbarState: true,
            //         snackbarMessage: 'Complaint is now foreworded',
            //     })
            // }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                openSnackbarState: true,
                snackbarMessage: err.message,
            })
        });
    }

    handleSnackbarClose = () => {
        this.setState({
            openSnackbarState: false,
            snackbarMessage: '',
            snackbarVarient: {},
        })
    }

    read() {
        fetch(url + "manage/rejections/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.setState({
                    rejection_resons: res.data
                })
            }else {
                console.log("Err", res.data);
                alert(res.data);                
            }
        })
        .catch(err => {
            console.log("new errre",err);
        });
    }

    componentWillMount() {
        fetch(url + "getSrIdsForeword/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth': 'token ' + getCookie("roadGPortalAuth")
            },
            method: "GET",
        })
        .then(res => res.json())
        .then(res => {
            // console.log("Foreword Complaints", res);
            if(res.success) {
                this.setState({
                    srOfficerArray: res.data
                })
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                openSnackbarState: true,
                snackbarMessage: err.message,
            })
        });
    }

    componentDidMount() {
        this.read();
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
                fullScreen
                open={props.openComplaintDialogState}
                onClose={props.handleComplaintDialogClose}
                TransitionComponent={Transition}
                className={classes.ComplaintFullView} >
                    <AppBar className={classes.appBar} color="inherit">
                        <Toolbar>
                            <IconButton color="inherit" onClick={props.handleComplaintDialogClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            {/* <Button color="inherit" onClick={this.handleSave}>
                                Save
                            </Button> */}
                        </Toolbar>
                    </AppBar>
                {/* complaint content here */}
                    <Grid container>
                        <Grid item xs={12} md={4} className={classes.paddingClass}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <ImageCarousel postedUsers={complaintData? complaintData.postedUsers : null} />
                                </Grid>
                                <Grid item xs={12}>
                                    <br />
                                    <Divider />
                                    <br />
                                    <Typography variant="headline" style={{textAlign: 'center'}}>{(complaintData? complaintData.name : null)}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={7} className={classes.paddingClass}>
                            <br />
                            <Typography>{ "Grievance :   ".toUpperCase() + (complaintData? complaintData.grievType : null)} <Button color="secondary" size="small" style={{float: 'right', display: 'none'}}>view on map</Button></Typography>
                            <br />
                            <Typography>{ "Status :   ".toUpperCase() + (complaintData? complaintData.complaint_status : null)}</Typography>
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
                            <br />
                            <Typography>{ "Emergency :   ".toUpperCase() + (complaintData? (complaintData.isEmergency) ? "YES": "NO" : null)}</Typography>
                            <br />
                            {/* <Typography>{ "Description :   ".toUpperCase() + (complaintData? complaintData.description : null)}</Typography>
                            { this.state.new_estimated_time ? <Typography><br />{ "Estimated Date :   ".toUpperCase() + getFormatedDate(this.state.new_estimated_time)}</Typography> : null }
                            <br /> */}
                            <Divider />
                            <Grid container>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                    <Grid container>
                                        <Grid item xs={12} className={classes.textWrapper}>
                                            <FormControlLabel
                                                checked={this.state.new_isEmergency}
                                                onChange={this.handleIsEmergency}
                                                value="isEmergency"
                                                control={ <Checkbox /> }
                                                label="Mark Complaint as Emergency" />
                                        </Grid>
                                        <Grid item xs={12} className={classes.textWrapper}>
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
                                        <Grid item xs={12} className={classes.textWrapper}>
                                            <br />
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
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                {
                                    this.state.new_complaint_status == "Rejected"
                                    ?
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="Comment">Rejection Reason</InputLabel>
                                            <Select
                                                label="Rejection Reason"
                                                // multiline
                                                value={this.state.Comment}
                                                error={this.state.comment_error}
                                                helperText={this.state.comment_helper_text}
                                                onChange={this.handleChange}
                                                inputProps={{
                                                    name: 'Comment',
                                                    id: 'Comment',
                                                }}
                                                fullWidth >
                                                {
                                                    this.state.rejection_resons.map((item, index) => {
                                                        return (
                                                            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        // <TextField
                                        //     id="Comment"
                                        //     label="Comment"
                                        //     multiline
                                        //     value={this.state.Comment}
                                        //     error={this.state.comment_error}
                                        //     helperText={this.state.comment_helper_text}
                                        //     rows="5"
                                        //     onChange={this.handleComment}
                                        //     // defaultValue="Enter Your Coment Here.."
                                        //     className={classes.textField}
                                        //     // InputLabelProps={{
                                        //     //     shrink: false,
                                        //     // }}
                                        //     style={{margin: '10px'}}
                                        //     margin="normal" />
                                    :
                                        <TextField
                                            id="Comment"
                                            label="Comment"
                                            multiline
                                            value={this.state.Comment}
                                            error={this.state.comment_error}
                                            helperText={this.state.comment_helper_text}
                                            rows="5"
                                            onChange={this.handleComment}
                                            // defaultValue="Enter Your Coment Here.."
                                            className={classes.textField}
                                            // InputLabelProps={{
                                            //     shrink: false,
                                            // }}
                                            style={{margin: '10px'}}
                                            margin="normal" />
                                }
                                        <br />
                                        <br />
                                    <Button variant="raised" onClick={this.handleSave} style={{width: '100%'}} color="secondary">Save</Button>
                                </Grid>
                            </Grid>
                            <Divider />
                            {
                            (getCookie("roadGPortalRole") !== hierarchy[hierarchy.length - 1]) &&
                            <Grid container>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="new_forword_complaint">Forword Complaint To</InputLabel>
                                            <Select
                                                value={this.state.new_forword_complaint}
                                                onChange={this.handleChange}
                                                inputProps={{
                                                    name: 'new_forword_complaint',
                                                    id: 'new_forword_complaint',
                                                }} >
                                                {
                                                    this.state.srOfficerArray.map(item => (
                                                        <MenuItem value={item.id}>{item.role}</MenuItem>
                                                    ))
                                                }
                                        
                                            </Select>
                                        </FormControl>
                                </Grid>
                                <Grid xs={12} md className={classes.textWrapper}>
                                    <br />
                                    <Button variant="raised" style={{width: '100%'}} onClick={this.handleForeword} color="secondary">foreword</Button>
                                </Grid>
                            </Grid>
                            }
                            {/* <Typography variant="title">Comments : </Typography> */}
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