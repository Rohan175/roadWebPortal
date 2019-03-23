
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GeneralDialog from '../Components/GeneralDialog';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import {
    getCookie,
    url,
  } from "../constants";

const styles = (theme) => ({
    textField: {
        width: '100%'
    },
    wrapper: {
        width: '100vw',
        height: '100vh',
        display: 'flex'
    },    
})

class ReceiveOfficerComponent extends Component {
    state={ 
        postData:[],
        officerData:[],
        value: 0,
        post:"",
        openDialog : false,
    }

    handleDialogOpen = (dialogMsg, dialogTitle) => {        
        this.setState({ 
            openDialog: true,
            dialogMsg: dialogMsg,
            dialogTitle: dialogTitle
        });
    };
    
    handleClose = () => {
        this.setState({ openDialog: false });
        if(this.state.toLogin){
            this.props.history.push('/');
        }
    };

    handleTabChange = (event, value) => {
        this.setState({ value });
      };

      handleOfficerChange = (value) => {
        if (value == null) {
          value = { value: "" };
        }
    
        this.setState({
            officerName: value
        });
      };
      
      handlePostChange = (e) => {
        let value=e.label;
        console.log("check 3",e);
        if (value == null) {
          value = { value: "" };
        }
    
        this.setState({
             post: e
        });
      };

    componentWillMount = () => {
            fetch( url + "getUnallocatedOfficers/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth': 'token ' + getCookie("roadGPortalAuth")
                },
                method: "GET",
            }
        )
        .then(res => res.json())
        .then(res => {
            if(res.success){
                console.log("data",res.data);
                this.setState({
                    officerData:res.data,
                })
                
            }else{
            }
        })
        .catch(err => {
            console.log(err);   
            this.handleDialogOpen(err,"Please try again later ");        
        });

    fetch( url + "getAllJrPosts/", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth': 'token ' + getCookie("roadGPortalAuth")
        },
        method: "GET",
    }
    )
    .then(res => res.json())
    .then(res => {
        if(res.success){
            this.setState({
                postData:res.data,
            })
        }else{
        }
    })
    .catch(err => {
        console.log(err);   
        this.handleDialogOpen(err,"Please try again later ");        
    });

    }

    handleAssignPost = () =>{
        console.log("Before");
        
        if(this.state.post.label.length>0 && this.state.officerName.label.length > 0){
            console.log("after");
            fetch( url + "hierarchyTransfer/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth': 'token ' + getCookie("roadGPortalAuth")
                },
                method: "POST",
                body: JSON.stringify({
                     post_id: this.state.post.value._id,
                     officer_id: this.state.officerName.value,
                     post_office_type: this.state.post.value.office_type
                })
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    //success
                    console.log("Succes : ",res);
                }else{
                    //Error
                    console.log("Error : ",res);
                }
            })
            .catch(err => {
                console.log(err);   
                this.handleDialogOpen(err, "Please try again later ");        
            });
        }
    }

    render(){
        const allOfficer = this.state.officerData
        .map(op => ({
          value: op._id,
          label: op.name +" ( "+op.phoneNo+" )",
        }));
        const allPost = this.state.postData
        .map(op => ({
          value: op,
          label: op.post_id,
        }));
        const { classes, theme } = this.props;
        const selectStyles = {
            input: base => ({
              ...base,
              color: theme.palette.text.primary,
              "& input": {
                font: "inherit"
              }
            })
          };
        
        return(
            <div className={classes.wrapper}>
            <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                <Button onClick={this.handleClose}>OK</Button>
            </GeneralDialog>
            <Paper style={{width:'40%',margin:'auto',paddingLeft:'30px',paddingRight:'30px',paddingBottom:'30px'}}>
            <Toolbar>
                <Typography
                variant="headline"
                style={{ textAlign: "center", width: "100%" }}>
                      Receive Officer
                </Typography>
            </Toolbar>
            <br/> 
            <Select
                classes={classes}
                styles={selectStyles && {marginTop:"200dp"}}
                options={allOfficer}
                value={this.state.officerName}
                onChange={this.handleOfficerChange}
                placeholder="Select Transferred Officer"
            />
            <br/>         
            <Divider/>
            <Paper elevation="0" className={classes.root} style={{ paddingLeft:"-30px",paddingRight:"-30px" }}>
                <Tabs
                value={this.state.value}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                >
                <Tab label="ASSIGN OFFICER POSITION" />
                <Tab label="CREATE OFFICER POSITION" />
                </Tabs>
            </Paper>
            <Divider/>

            {
                this.state.value==0 &&
                <Paper elevation="0"  style={{padding : "40px"}}>
                    <Select
                        classes={classes}
                        styles={selectStyles && {marginTop:"100dp"}}
                        options={allPost}
                        value={this.state.post}
                        onChange={(e) => this.handlePostChange(e)}
                        placeholder="Select Post Of Officer"
                    />
                    <br/>  
                    <Button
                         style={{width:"100%"}}
                         onClick={this.handleAssignPost}
                         color="secondary"
                         variant="outlined"
                    >
                        Assign Post
                    </Button>    
                </Paper>
            }            
            </Paper>
        </div>
        );
    }
}

ReceiveOfficerComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReceiveOfficerComponent);