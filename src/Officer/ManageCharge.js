import ReactDOM from "react-dom";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import GeneralDialog from '../Components/GeneralDialog';
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import {
  griev_type,
  status_type,
  getCookie,
  url,hierarchy,
  hierarchy1
} from "../constants";
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: "flex",
    padding: 0
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 3
  },
  ProfileWrapper: {
    margin: "auto",
    padding: "20px",
    textAlign: "center",
    //padding: "",
    // background: 'white',
    // borderRadius: '2px',
    [theme.breakpoints.up("sm")]: {
      width: "40%"
    }
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class ManageCharge extends React.Component {
  state = {
    post: "",
    filterPost: "",
    errorStatus:false,
    saveButtondisable:false,
    officerName: "",
    openDialog : false,
  };

  
  handleDialogOpen = (dialogMsg, dialogTitle) => {        
    this.setState({ 
        openDialog: true,
        dialogMsg: dialogMsg,
        dialogTitle: dialogTitle
    });
};

  chargeTransfer = () =>{
    if(this.state.officerName.value==null || this.props.officerId==null || this.props.postId==null){
      this.handleDialogOpen("Please select all data","Error");  
      this.setState({
        openDialog:true,
            errorStatus:true,
        })
        return;
    } 
    this.setState({
      openDialog:false,
        errorStatus:false,
        saveButtondisable:true,
    })

    fetch(url + "chargeTransfer/", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'auth': 'token ' + getCookie("roadGPortalAuth")
        },
        method: "POST",
        body: JSON.stringify({selectedFromListPostId:this.props.postId,
                              selectedFromListOfficerId:this.props.officerId,
                              selectedFromUIOfficerId:this.state.officerName.value[0],
                              selectedFromListOfficeType:this.props.officetype})
    }
)
.then(res => res.json())
.then(res => {
 
    if(res.success){
      this.handleDialogOpen("Officer transfer successfully !!","");  
      //this.props.saveChanges(this.state.officerName.value[2]);
    }else{
    //here
    this.handleDialogOpen("Officer transfer successfully !!","");  
    }
    this.setState({
      openDialog:true,
    })
})
.catch(err => {
    console.log(err);   
    //here       
    this.handleDialogOpen(err,"Error Occur");        
    this.setState({
      openDialog:true,
        saveButtondisable:false,
    })
});

        
    
    // this.props.onSave();
  }

  handlePostChange = value => {
    let filterPostValue;
    if (value == null) {
      filterPostValue = "";
    } else {
      filterPostValue = value.value;
    }

    this.setState({
      post: value,
      filterPost: filterPostValue,
      officerName: ""
    });
  };

  handleOfficerChange = (value) => {
    console.log("check",value);
    if (value == null) {
      value = { value: "" };
    }

    this.setState({
      officerName: value
    });
  };


handleClose = () => {
    this.setState({ openDialog: false });
};


  render() {
    const { classes, theme } = this.props;
    const officerPost = hierarchy1
      .slice(0, hierarchy.indexOf(getCookie("roadGPortalRole")))
      .map(op => ({
        value: op[1],
        label: op[0]
      }));
    // const officer = this.props.officerData
    //   .filter(officer => {
    //     return officer.officer_type == this.state.post;
    //   })
    //   .map(officer => ({
    //     value: officer.officer_id.name + officer.officer_id.phoneNo,
    //     label: officer.officer_id.name + officer.officer_id.phoneNo
    //   }));

    //console.log("Officer --->" + officer.officer_id);
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
      <Paper className={classes.ProfileWrapper} >
        <Toolbar>
          <Typography
            variant="headline"
            style={{ textAlign: "center", width: "100%" }}
          >
            Manage Officer Charge Here
          </Typography>
        </Toolbar>
        <div className={classes.divider} />
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            options={officerPost}
            components={components}
            value={this.state.post}
            onChange={this.handlePostChange}
            placeholder="Select Post"
            isClearable
          />

          <div className={classes.divider} />
          <Select
            classes={classes}
            styles={selectStyles && {marginTop:"200dp"}}
            
            options={
              // officer
              this.props.officerData
                .filter(officer => {
                  return officer.officer_type == this.state.filterPost;
                })
                .map(officer => ({
                  value: [officer.officer_id._id,officer.officer_type],
                  label:
                    officer.officer_id.name +
                    "   No. - " +
                    officer.officer_id.phoneNo +
                    "  ( Office : " +
                    officer.office_type +
                    " ) "
                }))
            }
            components={components}
            value={this.state.officerName}
            onChange={this.handleOfficerChange}
            placeholder="Select Officer"
          />
          <div className={classes.divider} /><br/>
          <Button
            style={{width:"100%"}}
            onClick={this.chargeTransfer}
            disabled={this.state.saveButtondisable}
            color="secondary"
            variant="outlined"
          >
            Save
          </Button>
        </NoSsr>

        <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                <Button onClick={this.handleClose}>OK</Button>
            </GeneralDialog>
      </Paper>
    );
  }
}

ManageCharge.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ManageCharge);