import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DatePicker from 'material-ui-pickers/DatePicker';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
import { getFormatedDate,openLocationInGoogleMaps, getCookie, url, hierarchy } from "../constants";
// import { tr } from 'date-fns/esm/locale';



const styles = theme => ({
    root: {
        flexGrow: 1,
      },
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

class CommentComponent extends Component{
    state={
        comment:"",
        comment_error:null,
        comment_helper_text:""
    }

    handleComment = e => {
            this.setState({
                Comment: e.target.value
            })
            this.props.handleChangeComment(e.target.value)
        }
    render(){
        let props = this.props;
        const { textField } = props;
        
        return(
            <TextField
            id="Comment"
            label="Comment"
            multiline
            value={props.comment}
            error={this.state.comment_error}
            helperText={this.state.comment_helper_text}
            rows={props.lines}
            onChange={this.handleComment}
            // defaultValue="Enter Your Coment Here.."
            className={textField}
            // InputLabelProps={{
            //     shrink: false,
            // }}
            style={{margin: '0px'}}
            margin="normal" />

        );
    }
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

    // handleEstimatedDateChange = (date) => {
    //     this.setState({ new_estimated_time: date });
    // }

    handleChange = e => {
        this.setState({ Comment:"",[e.target.name]: e.target.value });
    };

    handleChangeComment = (comment) => {
        this.setState({
            Comment: comment
        })
    }
    handleSave = () => {        
        // updateComplaint
        
        if(this.state.new_complaint_status == "Rejected" && ( this.state.Rejection_Reason == "" || this.state.Rejection_Reason == null ) ) {
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
       
        if(this.state.Comment == "" || this.state.Comment == null  ) {
            this.setState({
                openSnackbarState: true,
                snackbarMessage: 'Please Enter comment',
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
                        show_new_complaint_status :reqBody.complaint_status,
                        show_new_isEmergency: reqBody.isEmergency
                    })

                    this.props.handleIndividualComplaintChange(reqBody,false);
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

        if(this.state.Comment == "" || this.state.Comment == null  ) {
            this.setState({
                openSnackbarState: true,
                snackbarMessage: 'Please Enter comment',
                snackbarStyle: {
                    backgroundColor: green[600],
                    display: 'flex',
                },
            }) 
            return;
        }
        
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
            this.props.handleIndividualComplaintChange(this.props.ComplaintDialogData,true);
            if(res.success) {
                this.setState({
                    openSnackbarState: true,
                    snackbarMessage: 'Complaint is now foreworded',
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

    handleTabChange = (event, value) => {
        this.setState({ value });
        this.setState({ Comment:""});
      };
    

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
             console.log("Foreword Complaints", res);
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
                                    <ImageCarousel postedUsers={complaintData? complaintData.posted_users : null} />
                                </Grid>
                                <Grid item xs={12}>
                                  <br/>
                                    <Typography variant="subhading" style={{textAlign: 'center'}}>{(complaintData? complaintData.name : null)}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={7} className={classes.paddingClass}>
                           
                            
                            <Grid container>
                                <Grid item xs={12} md className={classes.textWrapper}>
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
                               
                                </Grid>
                                <Grid xs={12} md className={classes.textWrapper}>
                                    <Typography style={{ display: 'inline', paddingRight:20}}>Location :{complaintData? complaintData.location.join(","):""}</Typography>
                                    <Button variant="outlined" size="small" onClick={() => { openLocationInGoogleMaps(... (complaintData? complaintData.location: [1,2]) ) }}  color="secondary">SHOW ON MAP</Button>
                                    <br/><br/>
                                <Typography>{ "Emergency :   ".toUpperCase() + (complaintData? this.state.show_new_isEmergency ? "YES": "NO" : null)}</Typography>
                                
                                </Grid>
                            </Grid>


                            <br /> 
                                <Paper className={classes.root}>
                            <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                            >
                            <Tab label="UPDATE" />

                            {
                            (getCookie("roadGPortalRole") !== hierarchy[hierarchy.length - 1]) &&
                            <Tab label="FOREWORD COMPLAIN" />
                            }
                            </Tabs>
                          </Paper>
                         <Divider />
                            <Paper style={{display:this.state.value==0?"":"none"}}>
                            <Grid container >
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
                                                <InputLabel htmlFor="new_complaint_status">Change Complaint Status</InputLabel>
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
                                        {/* <Grid item xs={12} className={classes.textWrapper}>
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
                                        </Grid> */}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md className={classes.textWrapper}>
                                        
                                        <CommentComponent comment={this.state.Comment} handleChangeComment={this.handleChangeComment} textField={classes.textField} lines={5}/>

                                </Grid>

                            </Grid>
                            <Grid item xs={12} md className={classes.textWrapper} >
                            {
                                    this.state.new_complaint_status == "Rejected"
                                    ?
                                    <div>
                                        <FormControl style={{marginLeft:'10px',width: '70%'}} className={classes.formControl} >
                                            <InputLabel htmlFor="Rejection_Reason" shrink >Rejection Reason</InputLabel>
                                            <Select
                                                // multiline
                                                value={this.state.Rejection_Reason}
                                                onChange={this.handleChange}
                                                inputProps={{
                                                    name: 'Rejection_Reason',
                                                    id: 'Rejection_Reason',
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
                                        <br/><br/>
                                    </div>
                                    :""
                                    }
                                        
                                    <Button variant="raised" onClick={this.handleSave} style={{width: '100%'}} color="secondary">Save</Button>
                                    </Grid>
                             </Paper>
                            {
                            (getCookie("roadGPortalRole") !== hierarchy[hierarchy.length - 1]) &&
                            <Paper style={{padding:'10px',textAlign: "center",display:this.state.value==1?"":"none"}}>
        
                               <Grid container>
                               <Grid item xs={12} md className={classes.textWrapper}> 
                               <br/>
                               <FormControl style={{width: '100%'}} className={classes.formControl} >
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
                                                        <MenuItem value={item._id}>{item.officer_id.name} ({item.officer_type})</MenuItem>
                                                    ))
                                                }
                                        
                                            </Select>
                                        </FormControl>
                                        
                                    </Grid>
                                    <Grid item xs={12} md className={classes.textWrapper}>
                                        <CommentComponent handleChangeComment={this.handleChangeComment} comment={this.state.comment} textField={classes.textField} lines={2}/>
                                    </Grid>
                                    </Grid>
                                    <br/>
                                    <Button variant="raised" style={{width: '100%'}} onClick={this.handleForeword} color="secondary">foreword</Button>
                          </Paper>
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