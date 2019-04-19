import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Select from "react-select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Divider from "@material-ui/core/Divider";
import RoadCode from "../Components/RoadCode";
import GeneralDialog from "../Components/GeneralDialog";
import { url, getCookie } from "../constants";
//import ChipInput from "material-ui-chip-input";

const styles = theme => ({
  wrapper: {
    // marginTop: '-56px',
    width: "100vw",
    height: "100vh",
    display: "flex",
    textAlign: "center"
  },
  textWrapper: {
    padding: "10px"
  },
  textField: {
    width: "100%",
    textAlign: "left"
  },
  AddOfficerWrapper: {
    margin: "auto",
    padding: "10px",
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    }
  }
});

class AddNewOfficer extends Component {
  state = {
    startAnimation: false,
    name: "",
    email: "",
    phoneNo: "",
    value: 0,
    postData: [],
    post: "",
    sanctionedPostLable: "DEE",
    sanctioned_Post: "",
    districts: "",
    generateBtnDisable: false,
    assignBtnDisable: false
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handlePostChange = e => {
    let value = e.label;
    console.log("check 3", e);
    if (value == null) {
      value = { value: "" };
    }

    this.setState({
      post: e
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
  };

  performValidataion = flag => {
    //Flag 0 For Assign Post
    //Flag 1 For Generate Post

    if (
      this.state.name.length > 0 &&
      this.state.phoneNo.length === 10 &&
      this.state.email.length > 0
    ) {
      if (flag === 0 && this.state.post.label.length > 0) return true;
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
      getCookie("roadGPortalCurrentPosts");
      this.setState({ generateBtnDisable: true });
      fetch(url + "addOfficer", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: "token " + getCookie("roadGPortalAuth")
        },

        method: "POST",
        body: JSON.stringify({
          officer_name: this.state.name,
          post_office_type: this.state.sanctioned_Post,
          officer_phoneNo: this.state.phoneNo,
          officer_email: this.state.email,
          operationFlag: "nonp",
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
      fetch(url + "addOfficer/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth: "token " + getCookie("roadGPortalAuth")
        },
        method: "POST",
        body: JSON.stringify({
          post_id: this.state.post.value._id,
          post_office_type: this.state.post.value.office_type,
          officer_name: this.state.name,
          officer_phoneNo: this.state.phoneNo,
          officer_email: this.state.email,
          operationFlag: "noop"
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
            this.handleDialogOpen(res.data, "Error");
            console.log("Error : ", res);
          }
        })
        .catch(err => {
          console.log(err);
          this.handleDialogOpen(err.message, "Please try again later ");
          this.setState({ assignBtnDisable: false });
        });
    } else {
      this.handleDialogOpen("Please Fill In All The Fields ", "Error");
    }
  };
  handleDistrictChange = chips => {
    console.log("Disticts" + chips);
    //  this.setState({districts:chips})
  };
  componentWillMount = () => {
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
          console.log("Response data" + res.data);
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

  componentDidMount() {
    this.setState({
      startAnimation: true
    });
  }

  render() {
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
        <Paper className={classes.AddOfficerWrapper}>
          {/* <Collapse in={this.state.startAnimation}> */}
          <Toolbar>
            <Typography
              variant="headline"
              style={{ textAlign: "center", width: "100%" }}
            >
              Add New Officer
            </Typography>
          </Toolbar>
          <Grid container>
            <Grid item xs={12} className={classes.textWrapper}>
              <TextField
                id="name"
                label="Name"
                name="name"
                className={classes.textField}
                value={this.state.name}
                onChange={this.handleChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <TextField
                id="email"
                label="Email"
                name="email"
                className={classes.textField}
                value={this.state.email}
                onChange={this.handleChange}
                margin="none"
              />
            </Grid>
            <Grid item xs={12} md={6} className={classes.textWrapper}>
              <TextField
                id="phoneNo"
                label="Phone Number"
                name="phoneNo"
                className={classes.textField}
                value={this.state.phoneNo}
                onChange={this.handleChange}
                margin="none"
              />
            </Grid>
          </Grid>
          {/* </Collapse> */}
          <br />
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

AddNewOfficer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(AddNewOfficer);
