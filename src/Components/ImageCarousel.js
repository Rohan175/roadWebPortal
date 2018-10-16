import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


const styles = theme => ({
  root: {
    maxWidth: '80%',
    // flexGrow: 1,
    margin: 'auto',
    textAlign: 'center'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.default,
    textAlign: 'center'
  },
  img: {
    height: 'auto',
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
});

class ImageCarousel extends React.Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    render() {
        if(!this.props.postedUsers) {
            return (<h1>Sorry</h1>)
        }

        const { classes, theme } = this.props;
        const { activeStep } = this.state;
        const maxSteps = this.props.postedUsers.length;

        return (
            <div className={classes.root}>
                {/* <Paper square elevation={0} className={classes.header}>
                    <Typography style={{textAlign: 'center'}}>{this.props.postedUsers[activeStep].time.slice(0, 10)}</Typography>
                </Paper> */}
                <img
                    className={classes.img}
                    src={this.props.postedUsers[activeStep].url}
                    // src={"http://192.168.43.149:3003/api/android/getImage?url=IMG_20181012_182531.jpg"}
                    alt={this.props.postedUsers[activeStep].userId}
                />
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                        </Button> 
                    } />
            </div>
        );
    }
}

ImageCarousel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ImageCarousel);