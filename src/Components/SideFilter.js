import React, { Component } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DatePicker from 'material-ui-pickers/DatePicker';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';


const styles = theme => ({
    
})


class SideFilter extends Component {


    render() {

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
                <div style={{margin: '10px', padding: '10px', textAlign: 'center'}}>
                    <Typography variant="subheading">Complaint Status</Typography>
                    <br />
                    <Divider />
                    <FormGroup>
                        {statusTypeRender}
                    </FormGroup>
                </div>
                <div style={{margin: '10px', padding: '10px', textAlign: 'center'}}>
                    <Typography variant="subheading">Grievance Type</Typography>
                    <br />
                    <Divider />
                    <FormGroup>
                        {grievTypeRender}
                    </FormGroup>
                </div>
                <div style={{margin: '10px', padding: '10px'}}>
                    <Typography variant="subheading" style={{textAlign: 'center'}}>Officers</Typography>
                    <br />
                    <Divider />
                    {/* <FormGroup>
                        {this.officers.map((name, index) => (
                            <FormControlLabel key={index} checked={this.state.officers.value} control={<Checkbox />} label={name.data} />
                        ))}
                    </FormGroup> */}
                </div>
                <div style={{margin: '10px', padding: '10px'}}>
                    <Typography variant="subheading" style={{textAlign: 'center'}}>Date</Typography>
                    <br />
                    <Divider />
                    <br />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Typography variant="caption">Starting Date</Typography>
                        <DatePicker 
                            value={this.props.EndingDate}
                            onChange={this.props.handleEndingDateChange}
                        />
                    </MuiPickersUtilsProvider>
                    <br /><br />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Typography variant="caption">Ending Date</Typography>
                        <DatePicker
                            value={this.props.StartingDate}
                            onChange={this.props.handleStartingDateChange}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <Divider />
            </div>
        )
    }
}

SideFilter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideFilter);