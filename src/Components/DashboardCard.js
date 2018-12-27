import React from 'react';
import classNames from 'classnames';
// import { Route, Switch, Redirect } from 'react-router-dom';
 import {NavLink} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
// import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    Card: { 
        // minWidth: '150px',
        // display:'inline-block', 
        margin: '15px',
        height:'92%',
        position: 'relative',
        color: 'white',
        display: 'flex',
        backgroundColor: 'black',
        [theme.breakpoints.down('sm')]: {
            // marginTop: '-66px',
            // display: 'flex',
            minWidth: '150px'
        },
    },
    CardButton: {
        width:'100%',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    media: {
        // ⚠️ object-fit is not supported by IE 11.
        objectFit: 'cover',
    },
    topLeft: {
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        height: '30px',
        width: '30px'
    },
    bottomRight: {
        position: 'absolute',
        bottom: '-5px',
        right: '-5px',
        borderBottom: '1px solid black',
        borderRight: '1px solid black',
        height: '30px',
        width: '30px'
    },
    primary: {
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
    },
    danger: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    alert: {
        backgroundColor: 'rgba(155, 100, 0, 0.1)',
    },
    success: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
    }
})

const CardBox = props => {
    let { classes } = props;

    function getClassName(CardColor) {
        switch (CardColor) {
            case 'primary': return classes.primary
            case 'danger': return classes.danger
            case 'alert': return classes.alert
            case 'success': return classes.success
            default: return -1;
        }
    }

    return (
        <Zoom in={props.startAnimation}>
            <Paper className={classNames(classes.Card, getClassName(props.CardColor))} component={NavLink} to={{ pathname: '/Dashboard/Complaints/Table', state: {dashboardButton : props.CardName} }}>
                {/* <div className={classes.topLeft}></div> */}
                    <div style={{margin: 'auto'}} >
                        <CardContent>
                            <Typography variant="display1">{<props.CardIcon fontSize="large" />}</Typography>
                            <Typography variant="caption">{props.CardName}</Typography>
                            <Typography variant="caption">Complaints</Typography>
                            {/* <Typography variant="display2">{props.CardValue}</Typography> */}
                        </CardContent>
                        <CardActions>
                            {/* <Button className={classes.CardButton} size="small" component={NavLink} to={{ pathname: '/Dashboard/Complaints/Table', state: {dashboardButton : props.CardName} }}>view</Button> */}
                        </CardActions>
                    </div>
                    {/* </Grid> */}
                {/* </Grid> */}
                {/* <div className={classes.bottomRight}></div> */}
            </Paper>
        </Zoom>
    )
}

CardBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardBox);