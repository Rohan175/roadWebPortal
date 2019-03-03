import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    Total: {
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        
    },
    Emergency: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        
    },
    Pending: {
        backgroundColor: 'rgba(155, 100, 0, 0.1)',
        
    },
    Completed: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        
    }
});




const complaintChipCount = props => {

    
    function getClassName(CardColor) {
        
        switch (CardColor) {
            case 'Total Complaints': return props.classes.Total
            case 'Emergency': return props.classes.Emergency
            case 'Pending': return props.classes.Pending
            case 'Completed': return props.classes.Completed
            default: return -1;
        }
    }

    return (
      <Chip
        className={getClassName(props.type)}
        avatar={<Avatar className={getClassName(props.type)}>{props.data ? props.data : 0}</Avatar>}
        // label={props.type}
        variant="outlined"
      />
      
    )
  
}


export default withStyles(styles)(complaintChipCount);
