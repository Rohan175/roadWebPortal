import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

const styles = theme => ({
  dialog: {
    // width: "100%",
    // marginTop: theme.spacing.unit * 3,
    // overflowX: "auto"
  },
  table: {
    // minWidth: 700
    // width: '80%'
  },
});
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class History extends Component {

  componentWillReceiveProps() {
    console.log("--------------------------------------------------");
    console.log("History", this.props.open);
  }

  render() {
    const { classes, data } = this.props;

    return (
      <Dialog open={this.props.open} maxWidth="lg" className={classes.dialog} onClose={this.props.onClose} TransitionComponent={Transition}>
        <div style={{ overflowX: 'auto' }}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Operation</TableCell>
                <TableCell>Comment By Officer</TableCell>
                <TableCell>Under</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => [
                <TableRow>
                  <TableCell>{item.time}</TableCell>
                  <TableCell style={{ maxWidth: '200px' }}>{item.complaint_operation}</TableCell>
                  <TableCell>{item.complaint_comment}</TableCell>
                  <TableCell>{item.changes_by.name}</TableCell>
                </TableRow>
              ])}
            </TableBody>
          </Table>
        </div>
      </Dialog>
    );
  }
}

History.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(History);
