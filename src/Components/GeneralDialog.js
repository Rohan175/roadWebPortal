import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const GeneralDialog = props => {    
    return (
    <Dialog
        open={props.openDialogState || false}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {props.dialogTitle}
        </DialogTitle>
    
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.dialogMsg}
            </DialogContentText>
        </DialogContent>
    
        <DialogActions>
            {props.children}
        </DialogActions>
    </Dialog>)
}


export default GeneralDialog;