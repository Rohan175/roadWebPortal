import React from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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
                    <Tooltip title={item.name} key={index}>
                        <IconButton color="inherit" component={NavLink} to={item.path}>{<item.icon />}</IconButton>
                    </Tooltip>
                ))
            }
        </div>
    )
}

DesktopMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DesktopMenu);