/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

// rct theme provider
import RctThemeProvider from './RctThemeProvider';

//Horizontal Layout
import HorizontalLayout from './HorizontalLayout';

//Agency Layout
import AgencyLayout from './AgencyLayout';

//Main App
import RctDefaultLayout from './DefaultLayout';

// boxed layout
import RctBoxedLayout from './RctBoxedLayout';

// app signin
import AppSignIn from './SigninFirebase';
import AppSignUp from './SignupFirebase';

// async components
import {
  AsyncSessionLoginComponent,
  AsyncSessionRegisterComponent,
  AsyncSessionLockScreenComponent,
  AsyncSessionForgotPasswordComponent,
  AsyncSessionPage404Component,
  AsyncSessionPage500Component,
  AsyncTermsConditionComponent
} from 'Components/AsyncComponent/AsyncComponent';

//Auth0
import Auth from '../Auth/Auth';

import RctAppLayout from 'Components/RctAppLayout';

// callback component
import Callback from "Components/Callback/Callback";

import Compaign from "Routes/campaign/index";

import Offer from "Routes/offer/index";

import Lander from "Routes/lander/index";

import ChildLander from "Routes/campaign/ChildComponent/ChildLander";
import ChildOffer from "Routes/campaign/ChildComponent/ChildOffer";
import ChildIp from "Routes/campaign/ChildComponent/ChildIp";
import ChildCountry from "Routes/campaign/ChildComponent/ChildCountry";
import lastChildLander from "Routes/campaign/ChildComponent/lastChildLander";

import CompaignStats from "Routes/campaign/compaignStats";
import campaignSummaryPaginationStore from 'Storage/campaignSummaryPaginationStore';
import "Assets/css/index.css";

//Auth0 Handle Authentication
const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, ...rest, authUser }) =>
  <Route
    {...rest}
    render={props =>
      authUser
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />}
  />;

class App extends Component {
  render() {
    const { location, match, user } = this.props;
		if (location.pathname === '/') {
			if (user === null) {
				return (<Redirect to={'/signin'} />);
      }
      else {
				return (<Redirect to={'/campaign'} />);
			}
    }
    // this.props.location.pathname
    if(this.props.location.pathname == "/signin" || this.props.location.pathname == "/signup"){
      return (
        <RctThemeProvider>
          <NotificationContainer />
          <InitialPath
            path={`${match.url}app`}
            authUser={user}
            component={RctDefaultLayout}
          />
          <Route path="/signin" component={AppSignIn} />
          <Route path="/signup" component={AppSignUp} />
        </RctThemeProvider>
      );
    }
    else{
      return (
        <RctThemeProvider>
          <NotificationContainer />
          <InitialPath
            path={`${match.url}app`}
            authUser={user}
            component={RctDefaultLayout}
          />
          <RctAppLayout>
            <Route path="/campaign" exact component={Compaign} />
            <Route path="/offer" exact  component={Offer} />
            <Route path="/lander" exact component={Lander} />
            <Route path="/campaign/:campaign_id/:campaign_name/offer" exact component={ChildOffer} />
            <Route path="/campaign/:campaign_id/:campaign_name/lander" exact component={ChildLander} />
            <Route path="/campaign/:campaign_id/:campaign_name/ip" exact component={ChildIp} />
            <Route path="/campaign/:campaign_id/:campaign_name/country" exact component={ChildCountry} />
            <Route path="/campaign/:campaign_id/:path_id/:campaign_name/:offer_name/lastChildLander" exact component={lastChildLander} />
          </RctAppLayout>
        </RctThemeProvider>
      );
    }
  }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(App);
