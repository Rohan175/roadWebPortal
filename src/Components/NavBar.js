import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu/';
import AccountCircle from '@material-ui/icons/AccountCircle';

import ChangePostDialoge from './ChangePostDialoge';
import MobileDrawer from './MobileDrawer';
import DesktopMenu from './DesktopMenu';
import GeneralDialog from '../Components/GeneralDialog';
import { getCookie, url ,setCookie} from '../constants';

const styles = theme => ({
    Toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    appNavbar: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    }
})

class NavBar extends Component {
    state = {
        openDrawer: false,
        selectedPost: "",
        openPostDialog: getCookie("firstTimeLogin") == "true"? true : false,   
        Redirect: false,
        postList: JSON.parse(getCookie("roadGPortalPosts")),
        selectedPost: JSON.parse(getCookie("roadGPortalCurrentPosts")),
        openDialog : false,
    }


    handleMenuClick = () => {
        this.setState({
            openDrawer: true
        });
    };

    handleClickAway = () => {
        this.setState({
            openDrawer: false
        });
    };

    //dialogs
    handleDialogOpen = (dialogMsg, dialogTitle) => {        
        this.setState({ 
            openDialog: true,
            dialogMsg: dialogMsg,
            dialogTitle: dialogTitle
        });
    };

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };
    //end dialog

    handleClosePostDialog = (postValue) => {
        this.setState({
            openPostDialog: false
        })
        setCookie("firstTimeLogin",false, 1);

        console.log("Post value",postValue);

        if(postValue != -1) {
            //change post here
            //network call
            //set new cookie
            //reload page

            fetch(url + "changePost/", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'auth': 'token ' + getCookie("roadGPortalAuth")
                    },
                    method: "POST",
                    body: JSON.stringify({post_id:postValue})
                }
            )
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    console.log("cookie" , postValue);
                    setCookie("roadGPortalAuth", res.data, 1);
                    setCookie("roadGPortalUserType", res.loginType, 1);
                    setCookie("roadGPortalRole", res.role, 1);
                    setCookie("roadGPortalPosts", JSON.stringify(res.posts), 1);
                    setCookie("roadGPortalCurrentPosts",JSON.stringify(postValue),1);
                    setCookie("firstTimeLogin",false, 1);
                    this.setState({
                        selectedPost: JSON.parse(getCookie("roadGPortalCurrentPosts")),
                    })
                    this.props.history.push('/');
                }else{
                    this.handleDialogOpen(res.data, "Error");
                    this.setState({
                        loginText:"Login",
                        disableLogin:false
                    })
                }
            })
            .catch(err => {
                console.log(err);                
                this.handleDialogOpen(err+"", "Error")
                this.setState({
                    loginText:"Login",
                    disableLogin:false
                })
            });
        }
    }

    handleOpenPostDialog = () => {
        this.setState({
            openPostDialog: true
        })
    }

    // componentWillMount = () => {
    //     this.setState({
    //         openDialogState: getCookie("firstTimeLogin") == "true"? true : false
    //     })
    // }

    
    render() {
        let { classes } = this.props;
        let { navBarItems } = this.props;

        console.log("Fuck off : ",typeof getCookie("firstTimeLogin"), getCookie("firstTimeLogin") == "true" ? true : false);
        
        return (
            <AppBar position="fixed" color="inherit">
                <Toolbar variant="dense" className={classes.Toolbar}>
                    <Typography variant="subheading" color="inherit" className={classes.grow}>
                        <Button component={Link} style={{color: 'black'}} to="/">Road {'&'} Building</Button>
                    </Typography>
                    <div>
                        <DesktopMenu menuItems={navBarItems} handleOpenPostDialog={this.handleOpenPostDialog} />
                        {/* <Button variant="text" size="small" color="inherit" onClick={this.handleOpenPostDialog}>Change Post</Button> */}
                        {this.state.postList.length > 1 && ( 
                        <IconButton size="small" color="inherit" onClick={this.handleOpenPostDialog}>
                            <AccountCircle />
                        </IconButton>)}
                        <IconButton className={classes.appNavbar} color="inherit" onClick={this.handleMenuClick}><MenuIcon /></IconButton>
                    </div>
                </Toolbar>
                <MobileDrawer menuItems={navBarItems} openDrawer={this.state.openDrawer} handleClickAway={this.handleClickAway} />

                <ChangePostDialoge
                    postLists={this.state.postList}//{['username@gmail.com', 'user02@gmail.com']}
                    selectedPost={this.state.selectedPost}
                    open={this.state.postList.length > 1 ? this.state.openPostDialog : false}
                    onClose={this.handleClosePostDialog}
                />
                <GeneralDialog 
                    openDialogState = {this.state.openDialog}
                    dialogTitle = {this.state.dialogTitle}
                    dialogMsg = {this.state.dialogMsg}  
                    handleClose={this.handleDialogClose}
                    handleDialogOpen={this.handleDialogOpen}
                >
                    <Button onClick={this.handleDialogClose}>OK</Button>
                </GeneralDialog>
            </AppBar>
        )
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(NavBar));