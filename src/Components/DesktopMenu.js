import React from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

// import Tooltip from '@material-ui/core/Tooltip';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    appDesktop: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    }
})

const DesktopMenu = props => {
    let { classes } = props;
    return (
        <div className={classes.appDesktop}>
            {
                props.menuItems.map((item, index) => (
                    <div title={item.name} key={index}>
                        <Button variant="text" color="inherit" component={NavLink} to={item.path}>{<item.icon />} &nbsp;&nbsp;<Typography variant="body2" color="inherit" >{item.name}</Typography></Button>
                        {/* <IconButton color="inherit" component={NavLink} to={item.path}>{<item.icon />}</IconButton> */}
                    </div>
                ))
            }
        </div>
    )
}

DesktopMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DesktopMenu);