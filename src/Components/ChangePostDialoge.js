import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import {setCookie} from '../constants';

const styles = (theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  Wrap: {
    minWidth: '350px',
    [theme.breakpoints.down('xs')]: {
      minWidth: '150px',
    },
  }
});

class ChangePostDialoge extends React.Component {
  handleClose = () => {
    this.props.onClose(-1);
  };


  handleListItemClick = value => {
    if(this.props.selectedPost.post_id == value.post_id) {
        this.props.onClose(-1);
        return;
    }
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other} >
        <DialogTitle id="simple-dialog-title">Change Post</DialogTitle>
        <div className={classes.Wrap} >
          <List>
            {this.props.postLists.map(post => (
              <ListItem button style={{ background: this.props.selectedPost.post_id === post.post_id ? "rgba(0, 0, 255, 0.1)": "" }} onClick={() => this.handleListItemClick(post)} key={post}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={post.post_id} />
              </ListItem>
            ))}
          </List>
          <br/>
          <Button onClick={ () => {
                            setCookie("roadGPortalAuth", {}, -1);
                            window.location.reload();
                        } } variant="contained" color="secondary" style={{ minWidth: '100%', color: 'white' }}>LOGOUT</Button>
        </div>
      </Dialog>
    );
  }
}

ChangePostDialoge.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(ChangePostDialoge);