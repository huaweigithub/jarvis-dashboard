/**
 * Ecommerce Routes
 */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CampaiginHome from './campaign';
import CompaignStats from "./compaignStats";

class Home extends Component{
  render(){
    return(
      <Switch>
        <Route path="/campaign" component={CampaiginHome} />
        <Route path="/campaign" component={CompaignStats} />
		  </Switch>
    )
  }
}


export default Home;
