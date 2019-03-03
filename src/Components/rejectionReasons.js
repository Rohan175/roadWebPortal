import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';

import { url } from "../constants";

const styles = theme => ({

})

class RejectionReasons extends Component {

    state = {
        _id: '',
        open: false,
        update: false,
        page: 0,
        rowsPerPage: 5,
        lists: []
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    //----------------------------------------------
    //handling CRUD
    handleClose = () => {
        this.setState({ open: false });
    };

    handleDialougeOpen = () => {
        this.setState({ open: true });
    }

    //read
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
                    lists: res.data
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
        this.read()
    }

    handleAdd = (event) => {
        this.setState({
            update: false,
            name: "",
        })
        this.handleDialougeOpen()
    };

    handlePush = () => {
        if(!this.state.update) {
            fetch(url + "manage/rejections/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({name: this.state.name})
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    this.read();
                    this.handleClose();                
                }else {
                    console.log(res);

                    console.log("Err", res.data);
                    alert(res.data);                
                }
            })
            .catch(err => {
                console.log("new errre",err);
            });
        } else {
            fetch(url + "manage/rejections/", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify({_id: this.state._id, name: this.state.name})
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    this.read();
                    this.handleClose();                
                }else {
                    console.log("Err", res.data);
                    alert(res.data);                
                }
            })
            .catch(err => {
                console.log("new errre",err);
            });
        }
    }

    handleUpdate = (item) => {

        console.log(item, Object.keys(item));
        
        this.setState({
            update: true,
            _id: item._id,
            name: item.name,
        })
        this.handleDialougeOpen()
    };

    handleDelete = (item) => {
        fetch(url + "manage/rejections/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify({_id: item._id})
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.setState({
                    lists: this.state.lists.filter(listItem => {
                        return listItem._id != item._id
                    })
                })
                // this.handleClose();                
            }else {
                console.log("Err", res.data);
                alert(res.data);                
            }
        })
        .catch(err => {
            console.log("new errre",err);
        });
    };
    //----------------------------------------------

    //----------------------------------------------
    //handling table pagination
    handleChangePage = (event, page) => {
        this.setState({ page });
      };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };
    //----------------------------------------------

    render() {
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, 10 - page * rowsPerPage);
        let { classes } = this.props; 

        return (
            <div className={classes.wrapper}>
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{this.state.update ? "Update" : "Add" } Reason</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="name"
                            label="Rejection Reason"
                            type="text"
                            value={this.state.name}
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value
                                })
                            }}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                        <Button onClick={this.handlePush} color="primary">
                        {this.state.update ? "Update" : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <div style={{overflowX: 'auto',}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>index</TableCell>
                                <TableCell>Rejection Reason</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="raised" 
                                        size="small" 
                                        color="secondary"
                                        onClick={
                                            () => {
                                                this.handleAdd();
                                            }
                                        }
                                    >
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.lists
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" >{page * rowsPerPage + index+1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Button 
                                                onClick={
                                                    () => {
                                                        this.handleUpdate(item);
                                                    }
                                                }
                                                color="primary"
                                                variant="text"
                                                size="small"
                                            >update</Button>
                                            <Button 
                                                onClick={
                                                    () => {
                                                        this.handleDelete(item);
                                                    }
                                                }
                                                color="secondary"
                                                variant="text"
                                                size="small"
                                            >delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Toolbar>
                    <TablePagination
                        style={{'padding' : 0,'flex' : 1}}
                        component="div"
                        count={this.state.lists.length}
                        rowsPerPageOptions={[5]}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                        'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                        'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Toolbar>
            </div>  
        );
    }
}

RejectionReasons.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RejectionReasons);