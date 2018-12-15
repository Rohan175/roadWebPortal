import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';

import Login from './Authentication/';
import Dasboard from './Officer';
import AdminDasboard from './Admin';

import { getCookie } from './constants';

class App extends Component {

  //state of root app
  

  setLogin = () => {
    this.setState({
      isLoggedIn: true,
      userType: 'officer'
    })     
  }

  constructor(props) {
    super(props);
    let value = getCookie("roadGPortalAuth");
    if(value !== -1) {
      this.state = {
        isLoggedIn: true,
        userType: 'officer',
        token: value
      }
    } else {
      this.state = {
        isLoggedIn: false,

      }
    }

    console.log("App ",this.state);
  }

  //checking login status for login route
  checkLoginStatus = () => {
    if(this.state.isLoggedIn) {
      if(this.state.userType === 'officer') return (<Redirect to="/" />)
      else if(this.state.userType === 'admin') return (<Redirect to="/Admin" />)
    }
    return (<Login setLogin={this.setLogin} />)
  }

  //checking login status for office dashboard
  redirectIfNotLoggedInOfficer = () => {
    return this.state.isLoggedIn && this.state.userType === 'officer' ? (<Dasboard />) : <Redirect to="/Login" />;
  }

  //checking login status for admin dashboard
  redirectIfNotLoggedInAdmin = () => {
    return this.state.isLoggedIn && this.state.userType === 'admin' ? (<AdminDasboard />) : <Redirect to="/Login" />;
  }

  //main render method
  render() {
    return (
      <HashRouter>
        <div>
          {/* main routes for app */}
          <Switch>
            <Route exact path="/Login" render={this.checkLoginStatus} />
            <Route exact path="/Dashboard*" render={this.redirectIfNotLoggedInOfficer} />
            <Route path="/Admin" render={this.redirectIfNotLoggedInAdmin} />
            <Route exact path="/">
              <Redirect to="/Dashboard/" />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
