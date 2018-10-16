import React from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({

})

const MobileDrawer = props => {
    return (
        <Drawer anchor="top" open={props.openDrawer}>
            <ClickAwayListener onClickAway={props.handleClickAway}>
                <List component="nav">
                    {
                        props.menuItems.map((item, index) => (
                            <NavLink to={item.path} key={index} style={{ textDecoration: 'none' }} onClick={props.handleClickAway} >
                                <ListItem button disableRipple>
                                    <ListItemIcon>
                                        {<item.icon />}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            </NavLink>
                        ))
                    }
                </List>
            </ClickAwayListener>
        </Drawer>
    )
}

MobileDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MobileDrawer);