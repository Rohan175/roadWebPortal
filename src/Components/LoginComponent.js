import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from '../res/emblem.svg';

const styles = theme => ({
    Card: {
        margin: 'auto',
        textAlign: 'center',
        minWidth: '270px'
    },
    logoWrapper: {
        position: 'relative'
    },
    logo: {
        width: '70px',
        height: 'auto',
    },
    loginBtn: {
        marginTop: '20px',
        width: '200px'
    },
    forgotPasswordBtn: {
        marginTop: '20px',
        width: '200px'
    },
    textField: {
        // width: '100%'
    }
})

let LoginComponent = (props) => {
    let { classes } = props;
    
    
    return (
        <div className={classes.Card}>
            {/* <CardContent> */}
                <div className={classes.logoWrapper}>
                    <img src={logo} className={classes.logo} alt="Road and Building" />
                </div>
                <form
                    onSubmit={(e) => { 
                        e.preventDefault();
                        props.handleLogin(
                            document.getElementById('phoneNo').value,
                            document.getElementById('password').value) 
                }}>
                    <div>
                        <TextField
                            id="phoneNo"
                            label="Phone Number"
                            fullWidth
                            type="text"
                            min="1000000000"
                            max="9999999999"
                            className={classes.textField}
                            margin="normal" />
                    </div>
                    <div>
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            error={false}
                            className={classes.textField}
                            margin="small" />
                    </div>
                    <div>
                        <Button
                        type="submit"
                        variant="contained" 
                        disabled={props.disableLogin}
                        className={classes.loginBtn}
                        >
                        {props.loginText}
                        </Button>
                    </div>
                </form>
                <div>
                    <Button 
                        variant="flat" 
                        className={classes.forgotPasswordBtn}
                        onClick={props.toForgotPassTab}
                    >
                        Forgot Password?
                    </Button>
                </div>
            {/* </CardContent> */}
        </div>
    )
}

LoginComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginComponent);