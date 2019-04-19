// import React, { Component } from 'react';
// // import { Route, Switch, Redirect } from 'react-router-dom';

// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';

// import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
// import Toolbar from '@material-ui/core/Toolbar';
// import Button from '@material-ui/core/Button';
// import Paper from '@material-ui/core/Paper';

// import RoadCode from '../Components/RoadCode';
// import GeneralDialog from '../Components/GeneralDialog';
// import { url, setCookie, getCookie, hierarchy } from "../constants";



// const styles = theme => ({
//     wrapper: {
//         marginTop: '-46px',
//         width: '100vw',
//         height: '100vh',
//         display: 'flex'
//     },
//     textWrapper: {
//         padding: '10px'
//     },
//     textField: {
//         width: '100%',
//     },
//     ProfileWrapper: {
//         margin:'auto',
//         textAlign: 'center',
//         padding: '20px',
//         // background: 'white',
//         // borderRadius: '2px',
//         [theme.breakpoints.up('sm')]: {
//             width: "40%"
//         },
//     }
// })


// class Profile extends Component {

//     state = {
//         startAnimation: false,
//         id: "",
//         name: "",
//         email: "",
//         phoneNo: "",
//         password: "",
//         newPassword: "",
//         confirmNewPassword: "",
//         changed: false,
//         openDialog : false,
//         roads: [],
//         road_code: null
//     }

//     handleChange = e => {
//         this.setState({
//             changed: true,
//             [e.target.id]: e.target.value
//         })
//     }

//     handlePasswordErrors = e => {    
//         if(this.state.newPassword === "") {
//             return false
//         }
//         if(this.state.newPassword === this.state.confirmNewPassword) {
//             return false
//         }
//         return true
//     }

//     handleSave = () => {
//         if(this.handlePasswordErrors()) {
//             this.handleDialogOpen("Please check your password", "Error");
//             return;
//         }
//         fetch(url + "updateProfile/", {
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'auth': 'token ' + getCookie("roadGPortalAuth")
//             },
//             method: "POST",
//             body: JSON.stringify({
//                 name: this.state.name,
//                 email: this.state.email,
//                 phoneNo: this.state.phoneNo,
//                 password: this.state.password,
//                 newPassword: this.state.newPassword,
//             })
//         })
//         .then(res => res.json())
//         .then(res => {
//             console.log(res);            
//             if(res.success){
//                 this.handleDialogOpen(res.data, "Success");
//                 this.componentWillMount();
//             }else{
//                 this.handleDialogOpen(res.data, "Error");
//             }
//         })
//         .catch(err => {
//             console.log(err);                
//             this.handleDialogOpen(err+"", "Error")
//         });
//     }

//     handleDialogOpen = (dialogMsg, dialogTitle) => {        
//         this.setState({ 
//             openDialog: true,
//             dialogMsg: dialogMsg,
//             dialogTitle: dialogTitle
//         });
//     };

//     handleDialogClose = () => {
//         this.setState({ openDialog: false });
//     };

//     getRoads = () => {
//     }

//     componentWillMount() {
//         this.getRoads()
//     }

//     componentWillReceiveProps() {
//         console.log("state changed");
        

//         this.getRoads()

//         if(this.props.OfficerData && this.props.OfficerData.role == hierarchy[0]) {
//             fetch(url + "roads/")
//                 .then(res => res.json())
//                 .then(res => {   
//                     let roadList = res.data.map(data => {
//                         return {
//                             value: data.road_code,
//                             label: data.name
//                         }
//                     })
                    
//                     this.setState({
//                         roads: roadList
//                     })
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     this.handleDialogOpen("Cannot get road list", "Error")
//                 });

//             fetch(url + "getOfficerRoads/?officerId=" + this.props.OfficerData._id,
//             {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'auth': 'token ' + getCookie("roadGPortalAuth")
//                 },
//             })
//                 .then(res => res.json())
//                 .then(res => {

//                     let allocatedRoads = res.data.map(data => {
//                         return {
//                             value: data.road_code,
//                             label: data.road_code
//                         }
//                     });

//                     // allocatedRoads = allocatedRoads.concat(allocatedRoads);
//                     // console.log(allocatedRoads, "fetch end");
                
//                     this.setState({
//                         road_code: allocatedRoads
//                     })
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     this.handleDialogOpen("Cannot get allocated roads", "Error")
//                 });
//         }

//         if(this.props.OfficerData) {
//             this.setState({
//                 name: this.props.OfficerData.name,
//                 email: this.props.OfficerData.email,
//                 phoneNo: this.props.OfficerData.phoneNo
//             })
//         }
//     }

//     componentDidMount() {
//         this.setState({
//             startAnimation: true
//         })
//     }

//     render() {
//         let { classes } = this.props;

//         return (
//           <div className={classes.wrapper}>
//             <GeneralDialog
//                 openDialogState = {this.state.openDialog}
//                 dialogTitle = {this.state.dialogTitle}
//                 dialogMsg = {this.state.dialogMsg}  
//                 handleClose={this.handleDialogClose}
//                 handleDialogOpen={this.handleDialogOpen}
//             >
//                 <Button onClick={this.handleDialogClose}>Ok</Button>
//             </GeneralDialog>
//             <Paper className={classes.ProfileWrapper}>
//                 <Toolbar>
//                     <Typography variant="headline" style={{textAlign: 'center', width: '100%'}}>Update Profile Here</Typography>
//                 </Toolbar>
//                 <Grid container>
//                     <Grid item xs={12} className={classes.textWrapper}>
//                         <TextField
//                             id="name"
//                             label="Name"
//                             className={classes.textField}
//                             value={this.state.name}
//                             onChange={this.handleChange}
//                             margin="none"
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={6} className={classes.textWrapper}>
//                         <TextField
//                             id="email"
//                             label="Email"
//                             className={classes.textField}
//                             value={this.state.email}
//                             onChange={this.handleChange}
//                             margin="none"
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={6} className={classes.textWrapper}>
//                         <TextField
//                             id="phoneNo"
//                             label="Phone Number"
//                             className={classes.textField}
//                             value={this.state.phoneNo}
//                             onChange={this.handleChange}
//                             margin="none"
//                         />
//                     </Grid>
//                     <Grid item xs={12} className={classes.textWrapper}>
//                         <TextField
//                             id="password"
//                             label="Old Password"
//                             className={classes.textField}
//                             value={this.state.password}
//                             type="password"
//                             onChange={this.handleChange}
//                             margin="none"
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={6} className={classes.textWrapper}>
//                         <TextField
//                             id="newPassword"
//                             label="New Password"
//                             className={classes.textField}
//                             value={this.state.newPassword}
//                             type="password"
//                             onChange={this.handleChange}
//                             error={this.handlePasswordErrors()}
//                             helperText={this.state.newPassword.length > 6 && this.state.newPassword.length < 12 ? "" : "Password length must be in 6 to 12"}
//                             margin="none"
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={6} className={classes.textWrapper}>
//                         <TextField
//                             id="confirmNewPassword"
//                             label="Confirm New Password"
//                             className={classes.textField}
//                             value={this.state.confirmNewPassword}
//                             type="password"
//                             onChange={this.handleChange}
//                             error={this.handlePasswordErrors()}
//                             helperText={this.state.newPassword !== this.state.confirmNewPassword ? "Password not matched" : ""}
//                             margin="none"
//                         />
//                     </Grid>
//                     {
//                         this.props.OfficerData && this.props.OfficerData.role == hierarchy[0] 
//                         ?
//                         (
//                             <Grid item xs={12} className={classes.textWrapper}>
//                                 <RoadCode 
//                                     values={this.state.road_code}
//                                     options={this.state.roads}
//                                     setRoadCodes={opt => {
//                                         console.log(opt, "setRoadCode")
//                                         this.setState({
//                                             road_code: opt
//                                         },() => {
//                                             console.log(this.state.road_code,"Hello");
//                                         })
//                                     }} 
//                                 ></RoadCode>
//                             </Grid>
//                         ) :
//                         null
//                     }
//                 </Grid>
//                 <br />
//                 <Grid container>
//                     <Grid item xs>
//                         <Button color="primary" disabled={!this.state.changed} onClick={this.handleSave}>Save</Button>&nbsp;
//                         <Button color="secondary" onClick={ () => {
//                             setCookie("roadGPortalAuth", {}, -1);
//                             window.location.reload();
//                         } }>Logout</Button>
//                     </Grid>
//                     {/* <Grid item xs>
                        
//                     </Grid> */}
//                 </Grid>
//             </Paper>
//           </div>  
//         );
//     }
// }

// Profile.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(Profile);