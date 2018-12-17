import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import GeneralDialog from '../Components/GeneralDialog';
import { getCookie, url } from '../constants';

const styles = theme => ({
  progressWrapper: {
      width: '100%',
      display: 'flex'
  },
  progress: {
      margin: 'auto',
      textAlign: 'center',
      width: '100%',
  },
  wrapper: {
      paddingTop: '60px',
      display: 'block',
      minHeight: '90vh',
      background: 'white'
  },
})

class ManageOfficer extends Component {

  state = {
    data: []
  }

  componentWillMount() {
    let headers = new Headers();
        headers.append('origin', '*');
        headers.append('auth', 'token ' + getCookie("roadGPortalAuth"));

        let req = new Request(url  + "getAllJrdIds", {
            method: "GET",
            headers: headers,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(res => {
                // console.log(res.data);                                  
                if(res.sucess){
                    this.setState({
                        data: res.data,
                        lodding : false
                    })

                } else{
                    this.handleDialogOpen(res.data, "Error");
                } 
            })
            .catch(err => {
                // console.log(err);      
                this.setState({
                    lodding : false
                });          
                this.handleDialogOpen(err.message, "Error")
            });
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
  };

  render() {
    return (
      <div>
        {/* <GeneralDialog
          openDialogState = {this.state.openDialog}
          dialogTitle = {this.state.dialogTitle}
          dialogMsg = {this.state.dialogMsg}  
          handleClose={this.handleClose}
          handleDialogOpen={this.handleDialogOpen} />
        <br />
        <br />
        <br />
        <br />
        <br />
        
          {this.state.data.map(data => (<div>{data._id}</div>))} */}
      </div>
    )
  }
}

ManageOfficer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageOfficer);
