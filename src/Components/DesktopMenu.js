import React from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
// import { th } from 'date-fns/esm/locale';

const styles = theme => ({
    appDesktop: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    activeLink: {
        background: theme.palette.secondary.main,
        color: 'white',
        '&:hover': {
            background: 'white',
            color: 'black'
        }
    },
})

const DesktopMenu = props => {
    let { classes } = props;
    return (
        <div className={classes.appDesktop}>
            {
                props.menuItems.map((item, index) => (
                    <div title={item.name} key={index} style={{marginRight: '4px'}}>
                        <Button variant="text" size="small" color="inherit" activeClassName={classes.activeLink} component={NavLink} to={item.path}>
                            <Typography variant="body2" color="inherit" >{item.name}</Typography>
                        </Button>
                    </div>
                ))
            }
                <Button variant="text" size="small" color="inherit" onClick={props.handleOpenPostDialog}>Change Post</Button>
        </div>
    )
}

DesktopMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DesktopMenu);