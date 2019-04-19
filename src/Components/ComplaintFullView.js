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
import Tooltip from '@material-ui/core/Tooltip';
import amber from '@material-ui/core/colors/amber';

import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import ImageCarousel from "./ImageCarousel";
import { getFormatedDate,openLocationInGoogleMaps, getCookie, url, hierarchy } from "../constants";
import { tr } from 'date-fns/esm/locale';
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
        marginTop: '20px'
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
        comment_helper_text:"",
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
            label="Remark"
            multiline
            shrink="true"
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

        isComplted:this.props.ComplaintDialogData ? (this.props.ComplaintDialogData.complaint_status=="Completed" ?true:false) : false,      

        srOfficerArray: [],
        rejection_resons: [],
        fileUploadBtn: 'Upload Image',
        fileUploadBtnColor: '',
        fileUploadName: '',
        uploadFile:"",
        isRetry:false,
        isSaving: false
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
                snackbarMessage: 'Please Enter Remark',
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
        },async () => {

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


            let extraChange =  async () => {
                let finalObj = {};

                if(this.state.new_complaint_status=="Completed") {
                    let res = await this.handleFileFetch(this.state.uploadFile)
                    if(res.success){
                        finalObj['completed_complaint_url'] = res.data;
                    }    
            
                }

                return finalObj;
            }

            this.setState({
                isSaving: true
            })

            let reqBody = {
                complaint_id: this.props.ComplaintDialogData._id, 
                complaint_status: this.state.new_complaint_status,
                isEmergency: this.state.new_isEmergency,
                comment: this.state.Comment,
                complaint_completion_url: "",
                ... (await extraChange())
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
                        show_new_isEmergency: reqBody.isEmergency,
                        isSaving: false,
                        Comment:"",
                    })

                    this.props.handleIndividualComplaintChange(reqBody,false);
                    if(this.state.new_complaint_status == "Completed")
                        this.props.handleComplaintDialogClose();
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    openSnackbarState: true,
                    snackbarMessage: err.message,
                    isSaving: false,
                    Comment:"",
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

        this.setState({
            isSaving: true
        })
        
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
                    snackbarMessage: 'Complaint is now forwarded',
                    isSaving: false
                })
                this.props.handleComplaintDialogClose();
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                openSnackbarState: true,
                snackbarMessage: err.message,
                isSaving: false
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
       console.log(">>>>>" ,this.props.ComplaintDialogData ? this.props.ComplaintDialogData.complaint_status : "");
       
       console.log(ComplaintDialogData);

        this.setState({        
            fileUploadBtn: 'Upload Image',
            fileUploadBtnColor: '',
            fileUploadName: '',
            uploadFile:"",
            isRetry:false,
            Comment: "",
            comments: ComplaintDialogData ? ComplaintDialogData.comments : [],
            // new_forword_complaint: null,
            show_new_complaint_status: ComplaintDialogData ? ComplaintDialogData.complaint_status : "Pending",
            show_new_isEmergency: ComplaintDialogData ? ComplaintDialogData.isEmergency : false,
            isComplted:ComplaintDialogData ? (ComplaintDialogData.complaint_status == "Completed" ? true : false ) : false,      
            new_complaint_status: ComplaintDialogData ? ComplaintDialogData.complaint_status : "Pending",
            new_estimated_time: ComplaintDialogData && ComplaintDialogData.estimated_completion ? ComplaintDialogData.estimated_completion : new Date(),
            new_isEmergency: ComplaintDialogData ? ComplaintDialogData.isEmergency : false
        })
    }

    handleFileFetch = async (file) => {
        let formData = new FormData();
        formData.append('file', file);
        
        return await fetch("https://imagescdn.herokuapp.com/", {
            headers: {
                'Accept': 'application/json',
            },
            method: "POST",
            body: formData
        })
        .then(res => res.json());
    }

    handleFileUpload = async () => {
        var input = document.createElement('input');
        input.onchange = (event) => {
            let fileName = input.value.split('\\')
            fileName = fileName.pop();

            console.log("file : ", input.files[0].size);
            if((input.files[0].size) > 300000){
                this.setState({
                    openSnackbarState:true,
                    snackbarMessage: 'File Size must not exceed 300kb',
                })
                return;
            }

            let genName = (date) => {
                let d = new Date(date);
                let name = "IMG_" + d.getDate() + (d.getMonth() + 1) + d.getFullYear() + "_" + d.getHours() + d.getMinutes() + d.getSeconds() + ".jpg";
                return name;
            }
            
            let blob = input.files[0].slice(0, input.files[0].size, 'image/jpg'); 
            let newFile = new File([blob], genName(new Date()), {type: 'image/jpg'});
            
            this.setState({
                isRetry:true,
                fileUploadBtn: 'File Selected',
                fileUploadBtnColor: 'green'
            })

            this.setState({
                uploadFile:newFile,
            })
            

        }
        input.accept = 'image/*'
        input.type = 'file';
        input.click();
    }

    render() {

        console.log(this.state);
        
        let props = this.props;
        const { classes } = props;
        const complaintData = props.ComplaintDialogData;

        let lastGrid = (complaintData) => {
            return (
                <div>
                    <Typography>{ "Emergency :   ".toUpperCase() + (complaintData? this.state.show_new_isEmergency ? "YES": "NO" : null)}</Typography>
                    <br/>
                    <Tooltip title={complaintData? "Location : "+complaintData.location.join(","):""}>
                    <Button variant="outlined" size="small" style={{ width: '70%' }} onClick={() => { openLocationInGoogleMaps(... (complaintData? complaintData.location: [1,2]) ) }}  color="secondary">SHOW ON MAP</Button>
                    </Tooltip>
                </div>
            )
        }

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
                    <Grid container style={{ paddingRight: '10px' }}>
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
                        <Grid item xs={12} md={8} className={classes.paddingClass} >
                           
                            
                            <Grid container>

                                {
                                    this.state.isComplted
                                    &&
                                    (
                                        <Grid xs={12} md >
                                            <ImageCarousel isCompleted={true} image={complaintData ? complaintData.completed_complaint_url : ""} postedUsers={complaintData? complaintData.posted_users : null} />
                                        </Grid>
                                    )
                                }
                                <Grid item xs={12} md>
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
                                <br />
                                {
                                    this.state.isComplted 
                                    &&
                                    lastGrid(complaintData)
                                }
                                </Grid>

                                {
                                    !this.state.isComplted
                                    &&
                                    (
                                        <Grid xs={12} md >
                                            {lastGrid(complaintData)}
                                        </Grid>
                                    )
                                }
                            </Grid>


                            <br /> 
                                <Paper className={classes.root} style={{ display: this.state.isComplted == true  ? "none" :"block" }}>
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
                            <Tab label="FORWARD COMPLAIN" />
                            }
                            </Tabs>
                          </Paper>
                         <Divider style={{ display: this.state.isComplted == true  ? "none" :"block" }}/>
                            {
                            this.state.value==0 &&
                            <Paper style={{ display: this.state.isComplted == true  ? "none" :"block" }} >
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

                                                {this.props.ComplaintDialogData && this.props.ComplaintDialogData.complaint_status === "Pending" &&
                                                    ([<MenuItem value="Pending" disabled>Pending</MenuItem>,
                                                     <MenuItem value="Approved">Approve</MenuItem>,
                                                     <MenuItem value="Rejected">Reject</MenuItem>])
                                                }

                                                {this.props.ComplaintDialogData && this.props.ComplaintDialogData.complaint_status === "Approved" &&
                                                    ([<MenuItem value="Approved" disabled>Approved</MenuItem>,
                                                    <MenuItem value="Rejected">Reject</MenuItem>,
                                                    <MenuItem value="In Progress">In Progress</MenuItem>])}
                                                    
                                                {this.props.ComplaintDialogData && this.props.ComplaintDialogData.complaint_status === "Rejected" &&
                                                    ([<MenuItem value="Rejected">Rejected</MenuItem>,
                                                    <MenuItem value="Approved">Approve</MenuItem>])}
                                                
                                                {this.props.ComplaintDialogData && this.props.ComplaintDialogData.complaint_status === "In Progress" &&
                                                    ([<MenuItem value="In Progress">In Progress</MenuItem>,
                                                    <MenuItem value="Completed">Complete</MenuItem>])}
                                                
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
                                    this.state.new_complaint_status == "Completed" &&
                                        <Button onClick={this.handleFileUpload} variant="contained" color="primary" style={{marginRight:"10px", marginBottom: '20px', backgroundColor: this.state.fileUploadBtnColor, color: 'white' }} >
                                            {this.state.fileUploadBtn}
                                            <CloudUploadIcon style={{marginLeft:"10"}}/>
                                        </Button>
                                }
                                {
                                    this.state.new_complaint_status == "Completed" &&
                                    this.state.isRetry &&
                                        <Button onClick={this.handleFileUpload} variant="contained" color="primary" style={{ backgroundColor:"red", marginBottom: '20px', color: 'white' }} >
                                            Retry
                                        </Button>
                                }
                                {
                                        this.state.new_complaint_status == "Rejected"
                                        &&
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
                                    }
                                            
                                <Button variant="raised" onClick={this.handleSave} style={{width: '100%', color: 'white'}} color="secondary" disabled={this.state.isSaving}>{!this.state.isSaving ? "Save" : "Saving..."}</Button>
                                    </Grid>
                             </Paper>
                            }
                            {
                            (getCookie("roadGPortalRole") !== hierarchy[hierarchy.length - 1])
                            && this.state.value==1 &&
                            <Paper style={{padding:'10px',textAlign: "center",display:this.state.value==1?"":"none"}}>
        
                               <Grid container>
                               <Grid item xs={12} md className={classes.textWrapper}> 
                               <br/>
                               <FormControl style={{width: '100%'}} className={classes.formControl} >
                                    <InputLabel htmlFor="new_forword_complaint">Forward Complaint To</InputLabel>
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
                                    <Button variant="raised" style={{width: '100%', color: 'white'}} onClick={this.handleForeword} color="secondary" disabled={this.state.isSaving} >{this.state.isSaving ? "Forwording" : "Forword"}</Button>
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