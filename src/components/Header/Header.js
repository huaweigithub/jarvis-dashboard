/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import { Media, Badge, Input } from 'reactstrap';
import $ from 'jquery';
import { observer } from 'mobx-react';
// actions
import { collapsedSidebarAction,logoutUserFromFirebase } from 'Actions';

// helpers
import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from './Notifications';
import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import utcStore from 'Storage/utcStore';
import LanguageProvider from './LanguageProvider';
import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm';
import Cart from './Cart';

// intl messages
import IntlMessages from 'Util/IntlMessages';

@observer
class Header extends Component {

	state = {
		customizer: false,
		isMobileSearchFormVisible: false
	}
	constructor(props) {
		super(props);
		this.logoutUser = this.logoutUser.bind(this);
		// this.onUTCChange = this.onUTCChange.bind(this);
	}

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		const val = !this.props.navCollapsed;
		this.props.collapsedSidebarAction(val);
	}

	onUTCChange(evt){
		evt.preventDefault();
		const value = evt.target.value;
		console.log('data val',value)
		utcStore.ChangeUTC(value)
	}

	// open dashboard overlay
	openDashboardOverlay() {
		$('.dashboard-overlay').toggleClass('d-none');
		$('.dashboard-overlay').toggleClass('show');
		if ($('.dashboard-overlay').hasClass('show')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
	}

	// close dashboard overlay
	closeDashboardOverlay() {
		$('.dashboard-overlay').removeClass('show');
		$('.dashboard-overlay').addClass('d-none');
		$('body').css('overflow', '');
	}

	// toggle screen full
	toggleScreenFull() {
		screenfull.toggle();
	}

		/**
	 * Logout User
	 */
	logoutUser() {
		this.props.logoutUserFromFirebase();
	}

	// mobile search form
	openMobileSearchForm() {
		this.setState({ isMobileSearchFormVisible: true });
	}

	render() {
		const { isMobileSearchFormVisible } = this.state;
		const campaign = props => <Link to="/campaign" active {...props} />
		const offer = props => <Link to="/offer" activeClassName="active" {...props} />
		const lander = props => <Link to="/lander" activeClassName="active" {...props} />
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		const { horizontalMenu, agencyMenu, location } = this.props;
		return (
			<AppBar position="static" className="rct-header">
				<Toolbar className="d-flex justify-content-between w-100 pl-0 clear-height">
					<div className="d-flex align-items-center">
						{/* {(horizontalMenu || agencyMenu) &&
							<div className="site-logo">
								<Link to="/" className="logo-mini">
									<img src={require('Assets/img/appLogo.png')} className="mr-15" alt="site logo" width="35" height="35" />
								</Link>
								<Link to="/" className="logo-normal">
									<img src={require('Assets/img/appLogoText.png')} className="img-fluid" alt="site-logo" width="67" height="17" />
								</Link>
							</div>
						} */}
						<div className="site-logo">
							<Link to="/" className="logo-mini">
								<img src={require('Assets/img/appLogo.png')} className="mr-5" alt="site logo" />
								{/* <h2 className="appLogoText">Jarvis</h2> */}
							</Link>
							{/* <Link to="/" className="logo-normal">
								<img src={require('Assets/img/appLogoText.png')} className="img-fluid" alt="site-logo" width="67" height="17" />

							</Link> */}
						</div>
							<ul className="list-inline mb-0 navbar-left">
								<li className="list-inline-item font-menu">
									<Button className="menu-button" className={ this.props.location.pathname == "/campaign" && "active" } component={campaign}><i className="zmdi zmdi-flare mr-5 "></i><IntlMessages id="Campaigns" /></Button>
								</li>
								<li className="list-inline-item font-menu">
									<Button className="menu-button" className={ this.props.location.pathname == "/offer" && "active" } component={offer}><i className="zmdi zmdi-flag mr-5 "></i><IntlMessages id="Offers" /></Button>
								</li>
								<li className="list-inline-item font-menu">
									<Button className="menu-button" className={ this.props.location.pathname == "/lander" && "active" } component={lander}><i className="zmdi zmdi-view-web mr-5 "></i><IntlMessages id="Landers" /></Button>
								</li>
								{/* {!horizontalMenu ?
									<li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
										<Tooltip title="Sidebar Toggle" placement="bottom">
											<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
												<MenuIcon />
											</IconButton>
										</Tooltip>
									</li> :
									<li className="list-inline-item">
										<Tooltip title="Sidebar Toggle" placement="bottom">
											<IconButton color="inherit" aria-label="Menu" className="humburger p-0" component={Link} to="/">
												<i className="ti-layout-sidebar-left"></i>
											</IconButton>
										</Tooltip>
									</li>
								} */}
								{/* {!horizontalMenu && <QuickLinks />} */}
								{/* <li className="list-inline-item search-icon d-inline-block">
									<SearchForm />
									<IconButton mini="true" className="search-icon-btn" onClick={() => this.openMobileSearchForm()}>
										<i className="zmdi zmdi-search"></i>
									</IconButton>
									<MobileSearchForm
										isOpen={isMobileSearchFormVisible}
										onClose={() => this.setState({ isMobileSearchFormVisible: false })}
									/>
								</li> */}
							</ul>
					</div>
					<ul className="navbar-right list-inline mb-0">
						{/* <li className="list-inline-item summary-icon">
							<Tooltip title="Summary" placement="bottom">
								<a href="javascript:void(0)" className="header-icon tour-step-3" onClick={() => this.openDashboardOverlay()}>
									<i className="zmdi zmdi-info-outline"></i>
								</a>
							</Tooltip>
						</li> */}
						{/* {!horizontalMenu &&
							<li className="list-inline-item">
								<Tooltip title="Upgrade" placement="bottom">
								<Button component={Link} to={`/${getAppLayout(location)}/pages/pricing`} variant="raised" className="upgrade-btn tour-step-4 text-white" color="primary">
										<IntlMessages id="widgets.upgrade" />
									</Button>
								</Tooltip>
							</li>
						} */}
						{/* <LanguageProvider />
						<Notifications />
						<Cart /> */}
						{/* <li className="list-inline-item setting-icon">
							<Tooltip title="Chat" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.setState({ customizer: true })}>
									<i className="zmdi zmdi-comment"></i>
								</IconButton>
							</Tooltip>
						</li> */}

						{/* <li className="list-inline-item setting-icon date-list">
							<h5 className="date-title">Time Zone</h5>
							<Input className="date-utc" type="select" bsSize="sm" onChange={ this.onUTCChange.bind(this)}>
								<option selected value="utc+8">(UTC+08:00) Beijing</option>
								<option value="utc-8">(UTC-08:00) PacificTime</option>
              </Input>
						</li> */}
						<li className="list-inline-item">
							<Tooltip title="Full Screen" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.toggleScreenFull()}>
									<i className="zmdi zmdi-crop-free"></i>
								</IconButton>
							</Tooltip>
						</li>
						<li className="list-inline-item">
							<Tooltip title="Login Out" placement="bottom">
								<IconButton aria-label="settings" onClick={() => this.logoutUser()}>
									<i className="zmdi zmdi-power text-danger"></i>
								</IconButton>
							</Tooltip>
						</li>
					</ul>
					<Drawer
						anchor={'right'}
						open={this.state.customizer}
						onClose={() => this.setState({ customizer: false })}
					>
						<ChatSidebar />
					</Drawer>
				</Toolbar>
				<DashboardOverlay
					onClose={() => this.closeDashboardOverlay()}
				/>
			</AppBar>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
};

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction,logoutUserFromFirebase
})(Header));
