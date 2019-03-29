import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DatePicker from 'material-ui-pickers/DatePicker';

import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const styles = theme => ({
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
          marginRight: -8,
        },
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      alignLeft: {
        display:'flex',justifyContent :'space-between',verticalAlign :'middle'
      },
      wrapperItem: {
        marginLeft: '10px', marginRight:'10px',paddingLeft: '10px',paddingRight: '10px',paddingTop:'10px',paddingBottom:'10px', textAlign: 'left'
      }
})

class SideFilter extends Component {

    state = {
        name: [],
        expandedDate : false,
        expandedStatus : false,
        expandedGriev : false,
    };
    
    handleExpandClick = Eventame => {
        this.setState(state => ({ [Eventame] : !state[Eventame] }));
    };

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };

    
    render() {

        const { classes } = this.props;
        const statusTypeRender = [];
        this.props.status_type_map.forEach((value, key) => statusTypeRender.push(
            <FormControlLabel key={key} checked={value} value={key} 
                            onChange={this.props.handleChange('status_type_map')} control={<Checkbox/>} label={key} />
        ))

        const grievTypeRender = [];
        this.props.griev_type_map.forEach((value, key) => grievTypeRender.push(
            <FormControlLabel key={key} checked={value} value={key} 
                            onChange={this.props.handleChange('griev_type_map')} control={<Checkbox/>} label={key} />
        ))


        return (
            <div>                        
                <div className={classes.wrapperItem} style={{paddingRight:'0px'}}>
                    
                    <div className={classes.alignLeft}>
                        <TextField
                                id="outlined-name"
                                style={{width:'100%'}}
                                label="Search"
                                className={classes.textField}
                                value={this.props.searchQuery}
                                onChange={this.props.doSearch}
                                margin="normal"
                                variant="outlined"
                                />
                    </div>
                    <br/>
                    <Divider />
                </div>

                <div className={classes.wrapperItem} style={{paddingRight:'0px'}}>

                    <div className={classes.alignLeft}>
                        <Typography variant="subheading">Only Emergency Complaints</Typography>
                        
                        <Checkbox
                            style={{padding:'0px'}}
                            checked={!this.props.emergency_state}
                            onChange={this.props.handleChange('emergency_state')}
                            value="emergency"/>
                    </div>
                    <br/>
                    <Divider />
                </div>
                

                <div className={classes.wrapperItem}>

                    <div className={classes.alignLeft}>
                        <Typography variant="subheading">Complaint Status</Typography>
                        <IconButton
                            style={{padding:'0px'}}
                            className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expandedStatus,
                            })}
                            onClick={this.handleExpandClick.bind(this,'expandedStatus')}
                            aria-expanded={this.state.expandedStatus}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                    <br />
                    <Divider />
                    <Collapse in={this.state.expandedStatus} timeout="auto">
                        <FormGroup>
                            {statusTypeRender}
                        </FormGroup>
                    </Collapse>
                </div>


                <div className={classes.wrapperItem}>
                    <div className={classes.alignLeft}>
                        <Typography variant="subheading">Grievance Type</Typography>
                        <IconButton
                            style={{padding:'0px'}}
                            className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expandedGriev,
                            })}
                            onClick={() => this.handleExpandClick('expandedGriev')}
                            aria-expanded={this.state.expandedGriev}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                    <br />
                    <Divider />
                    <Collapse in={this.state.expandedGriev} timeout="auto">
                        <FormGroup>
                            {grievTypeRender}
                        </FormGroup>
                    </Collapse>
                </div>


                <div className={classes.wrapperItem}>
                    <div className={classes.alignLeft}>
                        <Typography variant="subheading" style={{textAlign: 'left'}}>Date</Typography>
                        <IconButton
                            style={{padding:'0px'}}
                            className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expandedDate,
                            })}
                            onClick={() => this.handleExpandClick('expandedDate')}
                            aria-expanded={this.state.expandedDate}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                    <br />
                    <Divider />
                    <br />
                    <Collapse in={this.state.expandedDate} timeout="auto">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Typography variant="caption">Starting Date</Typography>

                            <DatePicker
                                value={this.props.StartingDate}
                                onChange={this.props.handleStartingDateChange}
                            />
                        </MuiPickersUtilsProvider>
                        <br /><br />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Typography variant="caption">Ending Date</Typography>
                            <DatePicker 
                                value={this.props.EndingDate}
                                onChange={this.props.handleEndingDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Collapse>
                    <br /><br />
                    <Button onClick={this.props.exportExcel} href=""> Export Selected Data to Excel </Button>
                </div>
                
                {/* <Divider /> */}
            </div>
        )
    }
}

SideFilter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideFilter);