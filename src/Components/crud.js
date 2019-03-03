import React, { Component } from 'react'
import PropTypes from 'prop-types';

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

import {url} from 'constants.js';

class CRUD extends Component {

    static propTypes = {
        tableName: PropTypes.string.isRequired,
        crudUrl: PropTypes.string.isRequired,
        columns: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, 
                                                    api : PropTypes.string, 
                                                    type: PropTypes.oneOf(['text', 'number'])  }).isRequired),
    };

    state = {
        _id: '',
        updateDialogOpen: false,
        update: false,  // Used for difference between Update and Add dialog ui/api calls
        currentPage: 0,
        rowsPerPage: 5,
        lists: []
    };

    //Crud functions
    handleAdd = (event) => {
        let states ={}
        this.props.columns.map(c => states[c.api] = "")
        this.setState({
            update: false,
            updateDialogOpen: true,
            ...states
        })
    };

    handleUpdate = (item) => {

        console.log(item, Object.keys(item));

        this.setState({
            update: true,
            updateDialogOpen: true,
            _id: item._id,
            name: item.name,
        })
    };


    handleFetchAll() {

        fetch(url + this.props.crudUrl, {
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

    
    handlePush = async () => {
    
    try{
        
        let res;

        if(!this.state.update) {
            res = await fetch(url + this.props.crudUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({name: this.state.name})
            })
            
        } else {
            res = await fetch(url + this.props.crudUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify({_id: this.state._id, name: this.state.name})
            })
        }

        res = await res.json()
            
        if(res.success){
            this.handleFetchAll();
            this.handleClose();                
        }else {
            console.log("Err", res);
            alert(res.data);                
        }
    }catch(e){ console.log(e) };
    
    }


    componentWillMount() {
        this.handleFetchAll()
    }


    //Dialog Functions
    handleUpdateDialogClose = () => {
        this.setState({ updateDialogOpen: false });
    };

    handleDialogOpen = () => {
        this.setState({ updateDialogOpen: true });
    }

    //Table functions
    handleChangePage = (event, currentPage) => {
        this.setState({ currentPage });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render() {


        const { rowsPerPage, currentPage } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, 10 - currentPage * rowsPerPage);

        return (

            <div>
                <Dialog
                    open={this.state.updateDialogOpen}
                    onClose={this.handleUpdateDialogClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{this.state.update ? "Update" : "Add"} {this.props.tableName}</DialogTitle>
                    <DialogContent>

                        {this.props.columns.map(c => (
                            <TextField
                                margin="dense"
                                id="name"
                                label={c.name}
                                type={c.type}
                                value={this.state[c.api] ? this.state[c.api] : ""}
                                onChange={(e) => {
                                    this.setState({
                                        [c.api] : e.target.value
                                    })
                                }}
                                
                                fullWidth
                            />
                        ))}
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleUpdateDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handlePush} color="primary">
                            {this.state.update ? "Update" : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <div style={{ overflowX: 'auto', }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>index</TableCell>
                                {this.props.columns.map(c => (
                                    <TableCell>{c.name}</TableCell>
                                ))}
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
                                    .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                                    .map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" >{currentPage * rowsPerPage + index + 1}</TableCell>

                                            {this.props.columns.map(c => (
                                                <TableCell>{item[c.api]}</TableCell>
                                            ))}         
                                    
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
                        style={{ 'padding': 0, 'flex': 1 }}
                        component="div"
                        count={this.state.lists.length}
                        rowsPerPageOptions={[5]}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
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
        )
    }
}


export default CRUD;
