import React, { Component } from 'react'

export default class complaintCount extends Component {
  
    static defaultProps = {
        data : 0,    
    }
    
    render() {

    return (
      <span style={{"display":"block",paddingTop:'10px',fontSize:'12px'}}>{this.props.type} : {this.props.data}</span>
    )
  }

}
