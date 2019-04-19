import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import GeneralDialog from "../Components/GeneralDialog";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Divider from "@material-ui/core/Divider";
import { getCookie, url } from "../constants";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textField: {
    width: "100%",
    textAlign: "left"
  },
  wrapper: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    textAlign: "center"
  },
  ReceiveOfficerWrapper: {
    margin: "auto",
    padding: "10px",
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    }
  }
});

class ReceiveOfficerComponent extends Component {
  state = {
    postData: [],
    officerData: [],
    value: 0,
    post: "",
    post1: {
      label: ""
    },
    openDialog: false,
    officerName1: {
      label: ""
    },
    officerName: "",
    generateBtnDisable: false,
    assignBtnDisable: false,
    sanctioned_Post: "",
    sanctionedPostLable: "DEE"
  };

  handleDialogOpen = (dialogMsg, dialogTitle) => {
    this.setState({
      openDialog: true,
      dialogMsg: dialogMsg,
      dialogTitle: dialogTitle
    });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
    if (this.state.toLogin) {
      this.props.history.push("/");
    }
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handleOfficerChange = value => {
    if (value == null) {
      value = { value: "" };
    }
    this.setState({
      officerName1: value,
      officerName: value
    });
  };

  handlePostChange = e => {
    let value = e.label;
    console.log("check 3", e);
    if (value == null) {
      value = { value: "" };
    }

    this.setState({
      post1: e,
      post: e
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentWillMount = () => {
    fetch(url + "getUnallocatedOfficers/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth: "token " + getCookie("roadGPortalAuth")
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          console.log("data", res.data);
          this.setState({
            officerData: res.data
          });
        } else {
        }
      })
      .catch(err => {
        console.log(err);
        this.handleDialogOpen(err.message, "Please try again later ");
      });

    fetch(url + "getAllJrPosts/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth: "token " + getCookie("roadGPortalAuth")
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            postData: res.data
          });
        } else {
        }
      })
      .catch(err => {
        console.log(err);
        this.handleDialogOpen(err.message, "Please try again later ");
      });
    let role = getCookie("roadGPortalRole");
    let label = "";
    if (role === "Chief Engineer") {
      label = "Enter Name Of Circle (ex. ASTC(Ahmedabad State Circle ))";
      role = "SE";
    } else if (role === "Deputy Executive Engineer") {
      label = "Enter Name Of Sanctioned Post(ex. SO1,SO2)";
      role = "";
    } else if (role === "Executive Engineer") {
      label = "Enter Name Of Sub Division (ex.Subdivision Mehsana... )";
      role = "DEE";
    } else if (role === "Superintending Engineer") {
      label = "Enter Name Of  Division (ex.Ahmedabad,Mehsana... )";
      role = "EE";
    }
    this.setState({ sanctionedPostLable: label, officerRole: role });
  };

  performValidataion = flag => {
    if (this.state.officerName1.label.length > 0) {
      //Flag 0 For Assign Post
      //Flag 1 For Generate Post

      if (flag === 0 && this.state.post1.label.length > 0) return true;
      if (flag === 1) {
        if (this.state.sanctioned_Post.length > 0) {
          if (
            this.state.officerRole === "EE" &&
            this.state.districts.length === 0
          ) {
            return false;
          }
          return true;
        }
      }
      return false;
    }
  };

  handleGeneratePost = () => {
    if (this.performValidataion(1)) {
      this.setState({ generateBtnDisable: true });
      fetch(url + "addOfficer", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: "token " + getCookie("roadGPortalAuth")
        },

        method: "POST",
        body: JSON.stringify({
          post_office_type: this.state.sanctioned_Post,
          officer_id: this.state.officerName.value,
          operationFlag: "oonp",
          post_districts: this.state.districts.split(",")
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            //success
            this.handleDialogOpen(res.data, "Notice");
          } else {
            //Error
            this.handleDialogOpen(res.data, "Error");
            console.log("Error : ", res);
          }
          this.setState({ generateBtnDisable: false });
        })
        .catch(err => {
          console.log(err);
          this.handleDialogOpen("Please try again later ");
          this.setState({ generateBtnDisable: false });
        });
    } else {
      this.handleDialogOpen("Please Fill In All The Fields ", "Error");
    }
  };

  handleAssignPost = () => {
    console.log("Before");

    if (this.performValidataion(0)) {
      this.setState({ assignBtnDisable: true });

      console.log("after");
      fetch(url + "hierarchyTransfer/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: "token " + getCookie("roadGPortalAuth")
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
          this.setState({ assignBtnDisable: false });

          if (res.success) {
            //success
            this.handleDialogOpen(res.data, "Notice");
          } else {
            //Error
            console.log(res.data, "Error :");
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({ assignBtnDisable: false });

          this.handleDialogOpen(err.message, "Please try again later ");
        });
    } else {
      this.handleDialogOpen("Please Fill In all Fields", "Error ");
    }
  };

  render() {
    const allOfficer = this.state.officerData.map(op => ({
      value: op._id,
      label: op.name + " ( " + op.phoneNo + " )"
    }));
    const allPost = this.state.postData.map(op => ({
      value: op,
      label: op.post_id
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

    return (
      <div className={classes.wrapper}>
        <GeneralDialog
          openDialogState={this.state.openDialog}
          dialogTitle={this.state.dialogTitle}
          dialogMsg={this.state.dialogMsg}
          handleClose={this.handleClose}
          handleDialogOpen={this.handleDialogOpen}
        >
          <Button onClick={this.handleClose}>OK</Button>
        </GeneralDialog>
        <Paper className={classes.ReceiveOfficerWrapper}>
          <Toolbar>
            <Typography
              variant="headline"
              style={{ textAlign: "center", width: "100%" }}
            >
              Receive Officer
            </Typography>
          </Toolbar>
          <br />
          <Select
            classes={classes}
            styles={selectStyles && { marginTop: "200dp" }}
            options={allOfficer}
            value={this.state.officerName}
            onChange={this.handleOfficerChange}
            placeholder="Select Transferred Officer"
          />
          <br />
          <Divider />
          <Paper
            elevation="0"
            className={classes.root}
            style={{ paddingLeft: "-30px", paddingRight: "-30px" }}
          >
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
          <Divider />

          {this.state.value == 0 && (
            <Paper elevation="0" style={{ padding: "40px" }}>
              <Select
                classes={classes}
                styles={selectStyles && { marginTop: "100dp" }}
                options={allPost}
                value={this.state.post}
                onChange={e => this.handlePostChange(e)}
                placeholder="Select Post Of Officer"
              />
              <br />
              <Button
                style={{ width: "100%" }}
                onClick={this.handleAssignPost}
                color="secondary"
                variant="outlined"
                disabled={this.state.assignBtnDisable}
              >
                {this.state.assignBtnDisable
                  ? "Assigning Post..."
                  : "Assign Post"}
              </Button>
            </Paper>
          )}

          {this.state.value == 1 && (
            <Paper
              elevation="0"
              style={{
                paddingLeft: "40px",
                paddingRight: "40px",
                paddingBottom: "40px",
                paddingTop: "20px"
              }}
            >
              <TextField
                id="sanctioned_Post"
                label={this.state.sanctionedPostLable}
                name="sanctioned_Post"
                className={classes.textField}
                value={this.state.sanctioned_Post}
                onChange={this.handleChange}
                margin="none"
              />
              {this.state.officerRole === "EE" && (
                <TextField
                  id="districts"
                  label="Name of District (enter , after each district name ex. Ahmedabad,Surat...)"
                  name="districts"
                  className={classes.textField}
                  value={this.state.districts}
                  onChange={this.handleChange}
                  margin="none"
                />
              )}

              <br />
              <br />
              <Button
                style={{ width: "100%" }}
                onClick={this.handleGeneratePost}
                color="secondary"
                variant="outlined"
                disabled={this.state.generateBtnDisable}
              >
                {this.state.generateBtnDisable
                  ? "Generating Post..."
                  : "Generate Post"}
              </Button>
            </Paper>
          )}
        </Paper>
      </div>
    );
  }
}

ReceiveOfficerComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles)(ReceiveOfficerComponent);
