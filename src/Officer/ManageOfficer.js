import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Typography from '@material-ui/core/Typography';
import { Button, TextField } from "@material-ui/core";
import classnames from "classnames";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import SideFilter from "../Components/SideFilter";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
// import Button from '@material-ui/core/Button';
import Toolbar from "@material-ui/core/Toolbar";
import Profile from "./Profile";
import FilterIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import ComplaintContainer from "./ComplaintContainer";
import GeneralDialog from "../Components/GeneralDialog";
import ComplaintCount from "../Components/complaintCount";
import ComplaintChipCount from "../Components/complaintChipCount";
import ComplaintFullView from "../Components/ComplaintFullView";
import ManageCharge from "./ManageCharge";
import ReceiveOfficer from "../Components/ReceiveOfficer";
import AddNewOfficer from "../Components/AddNewOfficer";
import {
  griev_type,
  status_type,
  getCookie,
  url,
  hierarchy,
  hierarchy1
} from "../constants";
import ManageComplaints from "./ComplaintContainer";
import { it } from "date-fns/esm/locale";

const styles = theme => ({
  wrapper: {
    marginTop: "50px",
    // width: '100vw',
    height: "100vh"
    // display: 'flex',
  },
  centerStyle: {
    textAlign: "center"
  },
  alignLeft: {
    display: "flex",
    justifyContent: "space-between",
    verticalAlign: "middle"
  },
  wrapperItem: {
    marginLeft: "10px",
    marginRight: "10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
    textAlign: "left"
  },
  avatar: {
    //padding: "10px",
    margin: "2px",
    // marginBottom: "1px",
    width: 40,
    height: 40
    // minWidth: "15px",
    // borderRadius: "50%",
    // display: 'inline-block',
    // textAlign: 'center'
  },
  textField: {
    width: "100%"
  },
  sideFilter: {
    height: "90vh",
    overflowY: "scroll",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  complaintChips: {
    overflow: "auto",
    display: "flex",
    justifyContent: "space-around",
    paddingTop: "20px",
    [theme.breakpoints.down("sm")]: {
      display: "flex"
    }
  },
  sideFilterButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex"
    }
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ManageOfficer extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,

    openReceiveOfficerDialog: false,
    openOfficerDialogState: false,
    openComplaintDialogState: false,
    openAddNewOfficerDialog: false,
    openChargeDialog: false,
    expandOfficerFilters: true,
    openErrorDialog: false,

    OfficerData: [],

    OfficerMap: null,
    searchQuery : "",
    OfficerDialogData: null,
    ComplaintDialogData: null,

    Loading: true,

    sideFilterDialogOpen: false
  };

  officerMap = null;
  allOfficersData = [];
  mapForFilteringOfficerRole = new Map(hierarchy1);
  mapForSearchingOfficerRole = new Map(hierarchy1.map(e => e.slice().reverse()));
  
    
  doSearch = e => {
    let searchQuery = e.target.value.toLowerCase();

    console.log("doSearch => ",this.state.OfficerData,searchQuery);
    this.setState(oldState => {
        let newSearchedData;

        if(searchQuery.length < oldState.searchQuery.length){

          console.log(this.mapForSearchingOfficerRole);
          
            newSearchedData = this.allOfficersData.filter(complaint => {
                return complaint.officer_type
                    && oldState.OfficerMap.get(this.mapForSearchingOfficerRole.get(complaint.officer_type.toUpperCase()))
                    && Object.keys(complaint).some(k => {
                        let bool = false;
                        if(complaint[k] && complaint[k].includes && complaint[k].toLowerCase)
                            bool = complaint[k].toLowerCase().includes(searchQuery)

                        if(k === "officer_id"){

                          console.log(complaint[k]);
                          
                          bool = Object.keys(complaint[k]).some(x => {
          
                              let bool = false;
                              if(complaint[k][x] && complaint[k][x].includes && complaint[k][x].toLowerCase){
                                console.log("Gone inside ! => ",complaint[k][x].toLowerCase(),searchQuery)
                                bool = complaint[k][x].toLowerCase().includes(searchQuery)
                              }
                              return bool;
                          })
                      }
      
                        
                      console.log("Inside some : ",bool);
                      
                      return bool;
                    })
            })

        }else{
            newSearchedData = oldState.OfficerData.filter(c => {
                //console.log("Individual complaint :",c);
                //console.log("Keys : ", Object.keys(c));
                
                let b =  Object.keys(c).some(k => {
                    console.log("Keys : ", c[k], k);
                    
                    let bool = false;
                    if(c[k] && c[k].includes && c[k].toLowerCase){
                      console.log("Gone inside ! => ",c[k].toLowerCase(),searchQuery)
                      bool = c[k].toLowerCase().includes(searchQuery)
                    }

                    if(k === "officer_id"){

                        console.log(c[k]);
                        
                        bool = Object.keys(c[k]).some(x => {
        
                            let bool = false;
                            if(c[k][x] && c[k][x].includes && c[k][x].toLowerCase){
                              console.log("Gone inside ! => ",c[k][x].toLowerCase(),searchQuery)
                              bool = c[k][x].toLowerCase().includes(searchQuery)
                            }
                            return bool;
                        })
                    }

                    console.log("Inside some : ",bool);
                    
                    return bool;
                })

                console.log("inside filter : ",b);
                return b;    
            })

            console.log("newSearchedData",newSearchedData)
        }
        this.getTotalCountOfComplaintTypes(newSearchedData);
        return{searchQuery:searchQuery, OfficerData:newSearchedData }
    })
    
}

  handleChange = name => e => {
    this.setState({
      Loading: true
    });

    let value = e.target.value;
    console.log(value, name);

    this.setState(oldState => {
      let checked, newMap;
      newMap = new Map(oldState[name]);
      checked = !newMap.get(value);
      newMap.set(value, checked);

      value = this.mapForFilteringOfficerRole.get(value);
      console.log("nwer map ", newMap);
      console.log(value, name);

      let newFilteredOfficersDataArray = [];

      if (checked) {
        console.log(this.allOfficersData);

        newFilteredOfficersDataArray = this.allOfficersData.filter(
          complaint => {
            return (
              complaint.officer_type &&
              complaint.officer_type.toUpperCase() == value.toUpperCase()
            );
          }
        );

        newFilteredOfficersDataArray = newFilteredOfficersDataArray.concat(
          oldState.OfficerData
        );
        console.log("Added", newFilteredOfficersDataArray);
      } else {
        //Checked Else
        if (oldState.OfficerData == []) {
          oldState.OfficerData = this.allOfficersData;
        }
        let jsonName = "officer_type";
        newFilteredOfficersDataArray = oldState.OfficerData.filter(
          complaint =>
            complaint[jsonName] &&
            complaint[jsonName].toUpperCase() !== value.toUpperCase()
        );
      }
      this.getTotalCountOfComplaintTypes(newFilteredOfficersDataArray);
      return {
        [name]: newMap,
        Loading: false,
        OfficerData: newFilteredOfficersDataArray
      };
    });
  };

  handleExpandClick = Eventame => {
    console.log("event" + Eventame);

    this.setState(state => ({ [Eventame]: !state[Eventame] }));
  };

  // handleSearchFielde = event => {
  //   const value = event.target.value;
  //   const id = event.target.id;
  //   console.log("Search field" + value);
  //   this.setState({ searchFieldValue: value });
  // };

  //handling table pagination
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  //------------------

  handleComplaintDialogClose = () => {
    this.setState({
      OfficerDialogData: null,
      openComplaintDialogState: false
    });
  };

  handleOfficerDialogClose = () => {
    this.setState({
      OfficerDialogData: null,
      openOfficerDialogState: false
    });
  };

  handleChargeDialogClose = () => {
    console.log("Handle Charge Dialog called");
    this.setState({
      openChargeDialog: false
    });
  };

  componentDidUpdate(prevProps, prevState) {
    Object.entries(this.props).forEach(
      ([key, val]) =>
        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );
    Object.entries(this.state).forEach(
      ([key, val]) =>
        prevState[key] !== val && console.log(`State '${key}' changed`)
    );
  }
  handleOfficerDialogOpen = OfficerDialogData => {
    this.setState({
      OfficerDialogData: OfficerDialogData,
      openOfficerDialogState: true
    });
  };

  handleComplaintDialogOpen = OfficerDialogData => {
    let data = [];
    console.log("OfficerDialog ", OfficerDialogData, typeof OfficerDialogData);
    if (Array.isArray(OfficerDialogData)) {
      for (let i = 0; i < OfficerDialogData.length; i++)
        data.push(OfficerDialogData[i]["_id"]);
    } else {
      data.push(OfficerDialogData["_id"]);
    }

    this.setState({
      OfficerIdArray: data,
      openComplaintDialogState: true
    });
  };

  handleChargeDialogOpen = item => {
    console.log(item);

    this.setState({
      officetype: item.office_type,
      postId: item._id,
      officerId: item.officer_id._id,
      openChargeDialog: true
    });
  };

  handleDialogOpen = (dialogMsg, dialogTitle) => {
    this.setState({
      openErrorDialog: true,
      dialogMsg: dialogMsg,
      dialogTitle: dialogTitle
    });
  };

  handleClose = () => {
    this.setState({ openErrorDialog: false });
  };
  handleCheckBoxChange = name => {};
  componentWillMount() {
    this.officerMap = new Map();
    hierarchy1
      .map(e => e[0])
      .slice(0, hierarchy.indexOf(getCookie("roadGPortalRole")))
      .forEach(e => {
        this.officerMap.set(e, true);
        console.log("balue of e" + e);
      });
    console.log(this.officerMap);
    this.setState({
      OfficerMap: this.officerMap
    });
    this.getTotalCountOfComplaintTypes();
  }

  getTotalCountOfComplaintTypes(newFilteredOfficersDataArray) {
    let tTotal = 0,
      tPending = 0,
      tEmergency = 0,
      tCompleted = 0,
      tApproved = 0;

    if (newFilteredOfficersDataArray == undefined) {
      this.state.OfficerData.forEach(obj => {
        console.log("Total complaints ===>" + obj.complaint_data.total);
        tTotal += obj.complaint_data.total;
        tPending += obj.complaint_data.pending;
        tEmergency += obj.complaint_data.emergency;
        tCompleted += obj.complaint_data.completed;
        tApproved += obj.complaint_data.approved;
      });
    } else {
      newFilteredOfficersDataArray.forEach(obj => {
        console.log("Total complaints ===>" + obj.complaint_data.total);
        tTotal += obj.complaint_data.total;
        tPending += obj.complaint_data.pending;
        tEmergency += obj.complaint_data.emergency;
        tCompleted += obj.complaint_data.completed;
        tApproved += obj.complaint_data.approved;
      });
    }
    console.log(
      "total: " +
        tTotal +
        " Pending: " +
        tPending +
        " Emergency: " +
        tEmergency +
        " Completed: " +
        tCompleted +
        " Approved: " +
        tApproved
    );
    this.setState({ tTotal, tPending, tEmergency, tApproved, tCompleted });
  }
  componentDidMount() {
    let headers = new Headers();
    headers.append("origin", "*");
    headers.append("auth", "token " + getCookie("roadGPortalAuth"));

    let req = new Request(url + "getAllJrdIds", {
      method: "GET",
      headers: headers,
      mode: "cors"
    });

    this.setState(oldState => ({
      officerData: oldState.officerData
    }));
    fetch(req)
      .then(res => res.json())
      .then(res => {
        console.table(res.data);
        //console.log(res.data);
        res.data = res.data.reverse();
        this.allOfficersData = res.data;
        if (res.success) {
          this.setState({
            Loading: false,
            OfficerData: res.data
          });

          this.getTotalCountOfComplaintTypes(res.data);
        } else {
          this.handleDialogOpen(res.data, "Error");
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          Loading: false
        });
        this.handleDialogOpen(err.message, "Error");
      });
  }

  sideFilterHandleOpen = () => {
    this.setState({
      sideFilterDialogOpen: true
    });
  };

  sideFilterHandleClose = () => {
    this.setState({
      sideFilterDialogOpen: false
    });
  };
  handleReceive = () => {
    this.setState({
      openReceiveOfficerDialog: true
    });
  };
  handleAddnewOfficer = () => {
    this.setState({ openAddNewOfficerDialog: true });
  };

  handleReceiveOfficerDialogClose = () => {
    this.setState({
      openReceiveOfficerDialog: false
    });
  };

  handleAddNewOfficerDialogClose = () => {
    this.setState({
      openAddNewOfficerDialog: false
    });
  };

sideFilter = (classes, officerRoleRender) => (
    <div>                  
      <div className={classes.wrapperItem} style={{paddingRight:'0px'}}>
          
          <div className={classes.alignLeft}>
              <TextField
                      id="outlined-name"
                      style={{width:'100%'}}
                      label="Search"
                      className={classes.textField}
                      value={this.state.searchQuery}
                      onChange={this.doSearch}
                      margin="normal"
                      variant="outlined"
                      />
          </div>
          <br/>
          <Divider />
      </div>


      <div className={classes.wrapperItem}>
        <div className={classes.alignLeft}>
          <Typography variant="subheading">Officer Role</Typography>

          <IconButton
            style={{ padding: "0px" }}
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expandOfficerFilters
            })}
            onClick={() => this.handleExpandClick("expandOfficerFilters")}
            aria-expanded={this.state.expandOfficerFilters}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>

        </div>
        <br />
        <Divider />

        <Collapse in={this.state.expandOfficerFilters} timeout="auto">
          <FormGroup>{officerRoleRender}</FormGroup>
        </Collapse>
        <br />
        <Divider />
        <br />
        <Button
          style={{ width: "100%" }}
          onClick={() => {
            this.handleComplaintDialogOpen(this.allOfficersData);
          }}
          color="secondary"
          variant="outlined"
        >
          View All COMPLAINTS
        </Button>
        <br />
        <br />
        <Button
          style={{ width: "100%" }}
          onClick={this.handleReceive}
          color="secondary"
          variant="outlined"
        >
          RECEIVE OFFICER
        </Button>
        <br />
        <br />
        <Button
          style={{ width: "100%" }}
          onClick={this.handleAddnewOfficer}
          color="secondary"
          variant="outlined"
        >
          Add New OFFICER
        </Button>
      </div>
    </div>
  );

  render() {
    let { classes } = this.props;

    const { rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, this.state.OfficerData.length - page * rowsPerPage);
    const officerRoleRender = [];

    // console.log("Helo", this.officerMap);

    // this.state.OfficerMap.forEach((value, key) =>
    //  // console.log("hello", value, key)
    // );
    this.state.OfficerMap.forEach((value, key) =>
      officerRoleRender.push(
        <FormControlLabel
          key={key}
          checked={value}
          value={key}
          onChange={this.handleChange("OfficerMap")}
          control={<Checkbox />}
          label={key}
        />
      )
    );

    return (
      <div className={classes.wrapper}>
        <GeneralDialog
          openDialogState={this.state.openDialog}
          dialogTitle={this.state.dialogTitle}
          dialogMsg={this.state.dialogMsg}
          handleClose={this.handleClose}
          handleDialogOpen={this.handleDialogOpen}
        >
          {/* <Button>Hello</Button> */}
        </GeneralDialog>

        <GeneralDialog
          openDialogState={this.state.sideFilterDialogOpen}
          dialogTitle={"Filter"}
          dialogMsg={""}
          handleClose={this.sideFilterHandleClose}
          handleDialogOpen={this.sideFilterHandleOpen}
        >
          {this.sideFilter(classes, officerRoleRender)}
        </GeneralDialog>

        <Dialog
          fullScreen
          open={this.state.openReceiveOfficerDialog}
          onClose={this.handleReceiveOfficerDialogClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleReceiveOfficerDialogClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <ReceiveOfficer />
        </Dialog>

        <Dialog
          fullScreen
          open={this.state.openAddNewOfficerDialog}
          onClose={this.handleAddNewOfficerDialogClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleAddNewOfficerDialogClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <AddNewOfficer />
        </Dialog>

        <Dialog
          fullScreen
          open={this.state.openComplaintDialogState}
          onClose={this.handleComplaintDialogOpen}
          TransitionComponent={Transition}
        >
          <ManageComplaints
            manageOfficer
            OfficerIdArray={this.state.OfficerIdArray}
            handleComplaintDialogClose={this.handleComplaintDialogClose}
          />
        </Dialog>

        <Dialog
          fullScreen
          open={this.state.openChargeDialog}
          onClose={this.handleChargeDialogClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleChargeDialogClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <ManageCharge
            officetype={this.state.officetype}
            officerId={this.state.officerId}
            postId={this.state.postId}
            OnSave={this.handleChargeDialogClose}
            officerData={this.allOfficersData}
          />
        </Dialog>

        <Dialog
          fullScreen
          open={this.state.openOfficerDialogState}
          onClose={this.handleOfficerDialogClose}
          TransitionComponent={Transition}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleOfficerDialogClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Profile OfficerData={this.state.OfficerDialogData} />
        </Dialog>

        <Paper style={{ margin: "auto" }}>
          {this.state.Loading ? (
            <LinearProgress className={classes.progress} />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Grid container spacing={8} style={{ margin: "auto" }}>
                <Grid item md={3} xs={12} className={classes.sideFilter}>
                  {this.sideFilter(classes, officerRoleRender)}
                </Grid>
                <Grid item md={9} xs={12}>
                  <Grid>
                    <div className={classes.complaintChips}>
                      <span style={{ margin: "10px" }}>
                        <ComplaintChipCount
                          type="Total Complaints"
                          data={this.state.tTotal}
                        />
                      </span>
                      <span style={{ margin: "10px" }}>
                        <ComplaintChipCount
                          type="Pending"
                          data={this.state.tPending}
                        />
                      </span>
                      <span style={{ margin: "10px" }}>
                        <ComplaintChipCount
                          type="Emergency"
                          data={this.state.tEmergency}
                        />
                      </span>
                      <span style={{ margin: "10px" }}>
                        <ComplaintChipCount
                          type="Approved"
                          data={this.state.tApproved}
                        />
                      </span>
                      <span style={{ margin: "10px" }}>
                        <ComplaintChipCount
                          type="Completed"
                          data={this.state.tCompleted}
                        />
                      </span>
                    </div>
                  </Grid>

                  <TablePagination
                    style={{ padding: 0, flex: 1 }}
                    component="div"
                    count={this.state.OfficerData.length}
                    rowsPerPageOptions={[15, 30, 45]}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                      "aria-label": "Previous Page"
                    }}
                    nextIconButtonProps={{
                      "aria-label": "Next Page"
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />

                  <div style={{ overflowX: "auto" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell className={classes.centerStyle} > <Checkbox checked={this.state.checkBoxSelectAll} onChange={this.handleCheckBoxChange('all')} /> </TableCell> */}
                          <TableCell className={classes.centerStyle}>
                            Officer Name
                          </TableCell>
                          <TableCell className={classes.centerStyle}>
                            Officer Post
                          </TableCell>
                          {/* <TableCell className={classes.centerStyle} >Mobile</TableCell> */}
                          <TableCell className={classes.centerStyle}>
                            Analysis
                          </TableCell>
                          {/* <TableCell style={{ visibility: 'hidden' }}>Analysis</TableCell> */}
                          <TableCell className={classes.centerStyle}>
                            Actions
                          </TableCell>
                          {/* <TableCell className={classes.centerStyle} >Complaints</TableCell>
                          <TableCell className={classes.centerStyle} >Charge</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.OfficerData.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        ).map((item, index) => [
                          <TableRow key={index}>
                            {console.log("item", item)}
                            {/* <TableCell className={classes.centerStyle}><Checkbox checked={this.state.checkBoxes[index]} onChange={this.handleCheckBoxChange(item._id)} /> </TableCell> */}
                            <Tooltip title={item.officer_id.phoneNo}>
                              <TableCell className={classes.centerStyle}>
                                {item.officer_id.name}{" "}
                              </TableCell>
                            </Tooltip>
                            <Tooltip title={item.post_id}>
                              <TableCell className={classes.centerStyle}>
                                {item.office_type}{" "}
                              </TableCell>
                            </Tooltip>
                            {/* <TableCell className={classes.centerStyle}>{item.officer_id.phoneNo} </TableCell> */}
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Tooltip title="Total Complaint">
                                  <Avatar
                                    className={classes.avatar}
                                    style={{
                                      background: "rgba(0, 0, 255, 0.1)",
                                      color: "black"
                                    }}
                                  >
                                    {item.complaint_data.total}
                                  </Avatar>
                                </Tooltip>
                                <Tooltip title="Pending Complaint">
                                  <Avatar
                                    className={classes.avatar}
                                    style={{
                                      background: "rgba(155, 100, 0, 0.1)",

                                      color: "black"
                                    }}
                                  >
                                    {item.complaint_data.pending}
                                  </Avatar>
                                </Tooltip>
                                <Tooltip title="Emergency Complaint">
                                  <Avatar
                                    className={classes.avatar}
                                    style={{
                                      background: "rgba(255, 0, 0, 0.1)",
                                      color: "black"
                                    }}
                                  >
                                    {item.complaint_data.emergency}
                                  </Avatar>
                                </Tooltip>
                                <Tooltip title="Approved Complaint">
                                  <Avatar
                                    className={classes.avatar}
                                    style={{
                                      background: "rgba(128, 203, 196, 0.4)",
                                      color: "black"
                                    }}
                                  >
                                    {item.complaint_data.approved}
                                  </Avatar>
                                </Tooltip>
                                <Tooltip title="Completed Complaint">
                                  <Avatar
                                    className={classes.avatar}
                                    style={{
                                      background: "rgba(0, 255, 0, 0.1)",

                                      color: "black"
                                    }}
                                  >
                                    {item.complaint_data.completed}
                                  </Avatar>
                                </Tooltip>
                              </div>
                            </TableCell>
                            <TableCell className={classes.centerStyle}>
                              {/* <Button
                                onClick={() => {
                                  this.handleOfficerDialogOpen(item);
                                }}
                                color="secondary"
                                size="small"
                                variant="text"
                              >
                                Update
                              </Button> */}
                              {/* edit here */}
                              <Tooltip title="Shows complaints of selected officer">
                                <Button
                                  onClick={() => {
                                    this.handleComplaintDialogOpen(item);
                                  }}
                                  color="secondary"
                                  size="small"
                                  variant="text"
                                >
                                  View Complaints
                                </Button>
                              </Tooltip>
                              <Tooltip title="Transfers Charge of selected officer">
                                <Button
                                  onClick={() => {
                                    this.handleChargeDialogOpen(item, index);
                                  }}
                                  color="secondary"
                                  variant="text"
                                  size="small"
                                >
                                  Transfer Charge
                                </Button>
                              </Tooltip>
                            </TableCell>
                          </TableRow>

                          // <TableRow>
                          //         <TableCell colSpan={5} >
                          //             <div style={{display : "flex",justifyContent:"space-around"}}>
                          //                 <ComplaintChipCount type="" data={item.total} />
                          //                 <ComplaintChipCount type="Pending" data={item.pending} />
                          //                 <ComplaintChipCount type="Emergency" data={item.emergency} />
                          //                 <ComplaintChipCount type="Completed" data={item.completed} />
                          //             </div>
                          //         </TableCell>
                          // </TableRow>,

                          // <TableRow style={{height:"2px"}}>
                          //     <TableCell colSpan={5}></TableCell>
                          // </TableRow>
                        ])}
                      </TableBody>

                      {emptyRows > 0 && (
                        <TableRow style={{ height: 49 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </Table>
                  </div>
                </Grid>
              </Grid>
              <Button
                variant="extendedFab"
                color="secondary"
                onClick={this.sideFilterHandleOpen}
                className={classes.sideFilterButton}
              >
                <FilterIcon />
                &nbsp;Filter
              </Button>
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

ManageOfficer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ManageOfficer);
