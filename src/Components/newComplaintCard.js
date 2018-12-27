import React from 'react';
import classNames from 'classnames';
// import { Route, Switch, Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
// import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import CardIcon from '@material-ui/icons/ArrowForward';
// import CardIdcon2 from '@material-ui/icons/AddAPhoto';
import Typography from '@material-ui/core/Typography';

// import bgImage from '../res/newComplaint.png';


const styles = theme => ({
    imageClass: {

    },
    Card: { 
        minWidth: '250px',
        // display:'inline-block', 
        margin: '15px',
        height:'91%',
        position: 'relative',
        color: 'white',
        //  display: 'flex',
        display: 'inline-block',
        backgroundColor: 'black',
        [theme.breakpoints.down('sm')]: {
            // // marginTop: '-66px',
             display: 'inline-block',
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
        objectFit: 'cover',
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
    },
    uppderDiv: {
        width: '100%',
        height: "50%",
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        backgroundOpacity: '0.1',
        // backgroundImage: `url(${bgImage})`,
        // backgroundSize: 'cover'
        [theme.breakpoints.down('sm')]: {
            // marginTop: '-66px',
            display: 'none',
        },
    },
    lowerDiv: {
        width: '100%',
        height: "50%",
        textAlign: 'left',
        padding: '20px',
        [theme.breakpoints.down('sm')]: {
            // marginTop: '-66px',
            display: 'none',
        },
    },
    mobileCard: {
        [theme.breakpoints.down('sm')]: {
            // marginTop: '-66px',
            display: 'inline-block',
        },
        display: 'none'
    },
    numberWrapper: {
        display: 'flex',
        width: '100%'
    },
    iconWrapper: {
        display: 'flex',
        width: '100%'
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
            <Paper className={classNames(classes.Card, getClassName(props.CardColor))} >
                <Link to="/Dashboard/Complaints/Table" style={{textDecoration: 'none'}}>
                    <div className={classes.uppderDiv}>
                        <div className={classes.numberWrapper}>
                            <Typography variant="display2" style={{margin: 'auto auto 0px 0px', padding: '20px', color: 'white', textDecoration: ''}}>{props.CardValue}</Typography>
                        </div>
                        <div className={classes.iconWrapper} >
                            <Typography variant="display1" style={{margin: '0px 0px auto auto', padding: '20px', color: 'white'}}>{<CardIcon fontSize="large" />}</Typography>
                        </div>
                    </div>
                    <div className={classes.lowerDiv}>
                        <Typography variant="title" style={{color: 'rgba(0,0,0,0.54)'}}>{props.CardName} Complaints</Typography>
                        <br />
                        <Typography variant="Subheading" style={{color: 'rgba(0,0,0,0.54)'}}>Unseen <br />compaints</Typography>
                    </div>
                    <div style={{margin: 'auto'}} className={classes.mobileCard} >
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
                </Link>
            </Paper>
        </Zoom>
    )
}

CardBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardBox);