/**
 * About Us Page
 */
import React, { Component,Fragment } from 'react';
import { Helmet } from "react-helmet";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MatButton from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import { Link, NavLink } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withStyles } from '@material-ui/core/styles';
// import TestimonialSlider from './components/testimonial-slider';
// import Clientslider from './components/client-slider';
import AppConfig from 'Constants/AppConfig';
import { observer } from 'mobx-react';
// app default layout
import RctAppLayout from 'Components/RctAppLayout';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import SearchForm from 'Components/Header/SearchForm';
// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import { RctCard } from 'Components/RctCard';
import {
  Input,Form
} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';

import MUIDataTable from "mui-datatables";
import Chip from '@material-ui/core/Chip';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import moment from 'moment';
import Pagination from "../../components/pagination/Pagination";
import childIpStore from 'Storage/childIpStore';
import landerModelStore from 'Storage/landerModelStore';

import DatePicker from 'Assets/js/PresetDateRangePicker';
import utcStore from 'Storage/utcStore';

import Login from 'Container/SigninFirebase';

import Countries from 'Constants/countries';
import "Assets/css/index.css";

const styles = (theme) => ({
  trFullFill: {
    'height': 'unset',
  },
  tdFullFill: {
    'padding': 0,
  },
  tableHead:{
    background: '#7a7e93',
  },
  tableBodyNone:{
    display:'none',
  },
});


@withStyles(styles)
@observer
class ChildLander extends Component {

  constructor(props) {
    super(props);
    this.countries = Countries;
    this.childoffer = '';
    this.state = {
      page:childIpStore.current_page,
      search_value : ''
    };
    this.onApplyTime = this.onApplyTime.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.startDate = moment();
    this.endDate = moment();
    this.search_value='';
  }


  componentDidMount() {
    // const page = this.props.page || 1;
    // const campaign_id = this.props.match.params.campaign_id;
    // childIpStore.fetchChildIpStats(page,campaign_id,this.search_value);
    // this.setState({page:childIpStore.current_page})
    const campaign_id = this.props.match.params.campaign_id;
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      childIpStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      childIpStore.fetchChildIpStats(childIpStore.current_page,campaign_id);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      childIpStore.setDateRange(start_timestamp, end_timestamp);
      childIpStore.fetchChildIpStats(childIpStore.current_page,campaign_id);
    }
  }

  onDatesChange({startDate, endDate}) {
    console.log('parent start', startDate);
    console.log('parent end', endDate);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  onApplyTime() {
    const campaign_id = this.props.match.params.campaign_id;
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      childIpStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      childIpStore.fetchChildIpStats(childIpStore.current_page,campaign_id);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      childIpStore.setDateRange(start_timestamp, end_timestamp);
      childIpStore.fetchChildIpStats(childIpStore.current_page,campaign_id);
    }
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    this.search_value = vaule;
  }

  handleSearchSubmit(e){
    e.preventDefault();
    const search_value = this.search_value;
    const campaign_id = this.props.match.params.campaign_id;
    childIpStore.searchPage(childIpStore.current_page,campaign_id,search_value);
    if(search_value ==''){
      childIpStore.fetchChildIpStats(childIpStore.current_page,campaign_id,this.search_value);
    }
  }

  render() {
    const {campaign_id, campaign_name} = this.props.match.params;
    const countries = this.countries;

    const { loaded, error } = childIpStore;
    const { classes } = this.props;
    const offsetHeight = document.body.offsetHeight;
    const sub = offsetHeight - 240;
    const max_height = sub + "px";
    const styleObj = {
      maxHeight : max_height
    }

    return (
      <div>
        {!localStorage.getItem('user_id') &&
          <React.Fragment>
            <Login />
          </React.Fragment>
        }
        {localStorage.getItem('user_id') &&
          <React.Fragment>
            <div className="about-wrapper campaign-child">
              <Helmet>
                <title>{AppConfig.brandName} - IP</title>
              </Helmet>
              <div className="about-detail campaign-childpage-header">
                <RctCollapsibleCard heading={
                  <div className="row no-gutters row-eq-height align-items-center">
                    {/* <PageTitleBar title={<IntlMessages id="Campaign" />}  /> */}
                    {/* <div className="page-title">
                      <h2 class="page-title-font text-link childnav-first">
                        <NavLink to="/campaign">Campaign</NavLink>
                      </h2>
                    </div>
                    <div className="page-title text-icon">
                      <h2 class="page-title-font">
                        /
                      </h2>
                    </div> */}
                    <div className="page-title">
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/offer` } activeClassName="activeLink">Offers</NavLink>
                      </h2>
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/lander` } activeClassName="activeLink">Landers</NavLink>
                      </h2>
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/ip` } activeClassName="activeLink">IP</NavLink>
                      </h2>
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/country` } activeClassName="activeLink">Country</NavLink>
                      </h2>
                    </div>
                    <div className="searchform search-icon d-inline-block">
                      <Form className="search-wrapper" onSubmit={this.handleSearchSubmit}>
                        <Input
                        type="search"
                        className="search-input-lg"
                        placeholder="Search.."
                        onChange={this.handleChangeSearch}
                        />
                        <IconButton className="search-button" type="submit" aria-label="Search" >
                          <i className="zmdi zmdi-search zmdi-hc-sm"></i>
                        </IconButton>
                      </Form>
                    </div>
                    <div className="datePicker-box">
                      <DatePicker onDatesChange={ this.onDatesChange.bind(this) }></DatePicker>
                      <MatButton variant="raised" color="primary" className="text-white" onClick={ this.onApplyTime }>Apply</MatButton>
                    </div>
                    <div className="child-chip">
                      <Chip label="Campaign" className="chip-text" component="a" href="/campaign" clickable />
                      <Chip label={`${ campaign_name }`} className="mr-5 chip-name" />
                      <div className="page-title text-icon">
                        <h2 class="page-title-font">
                          /
                        </h2>
                      </div>
                      <Chip label="IP" className="chip-text chip-border-radius" component="a" href={ `/campaign/${campaign_id}/${campaign_name}/ip` } clickable />
                    </div>
                  </div>
                } fullBlock>
                  { !loaded && <LinearProgress /> }
                  { error && <p>{ error }</p> }
                  { loaded && !error &&
                   <React.Fragment>
                   <div className="table-responsive table-topfix" style={styleObj}>
                     <Table>
                       <TableHead classes={{ root:classes.tableHead }}>
                         <TableRow hover>
                           <TableCell className="text-left tableTh lander_name ">IP</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_visit ">Visit</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_click ">Click</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_ctr ">CTR</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody classes={{ root:classes.tableBodyNone }}>
                         <Fragment>
                         { !loaded && <TableRow classes={ {root: classes.trFullFill} }>
                           <TableCell classes={ {root: classes.tdFullFill} } colSpan={ 7 }>
                             <LinearProgress />
                           </TableCell>
                         </TableRow>
                         }
                         { error && <p>{ error }</p> }
                         {childIpStore.Ips.ips &&
                           childIpStore.Ips.ips.map(ip => (
                             <React.Fragment>
                              <TableRow hover key={ip.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">{ip.ip}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.ctr}</TableCell>
                              </TableRow>
                             </React.Fragment>
                           ))
                         }
                         {!childIpStore.Ips.ips &&
                           childIpStore.Ips.map(ip => (
                             <React.Fragment>
                              <TableRow hover key={ip.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">{ip.ip}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.ctr}</TableCell>
                              </TableRow>
                             </React.Fragment>
                           ))
                         }
                         </Fragment>
                       </TableBody>
                     </Table>
                   </div>
                   <div className="table-responsive" style={styleObj}>
                     <Table>
                       <TableHead classes={{ root:classes.tableHead }}>
                         <TableRow hover>
                           <TableCell className="text-left tableTh lander_name ">IP</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_visit ">Visit</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_click ">Click</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_ctr ">CTR</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody>
                         <Fragment>
                         { !loaded && <TableRow classes={ {root: classes.trFullFill} }>
                           <TableCell classes={ {root: classes.tdFullFill} } colSpan={ 7 }>
                             <LinearProgress />
                           </TableCell>
                         </TableRow>
                         }
                         { error && <p>{ error }</p> }
                         {childIpStore.Ips.ips &&
                           childIpStore.Ips.ips.map(ip => (
                             <React.Fragment>
                              <TableRow hover key={ip.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">{ip.ip}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.ctr}</TableCell>
                              </TableRow>
                             </React.Fragment>
                           ))
                         }
                         {!childIpStore.Ips.ips &&
                           childIpStore.Ips.map(ip => (
                             <React.Fragment>
                              <TableRow hover key={ip.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">{ip.ip}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{ip.ctr}</TableCell>
                              </TableRow>
                             </React.Fragment>
                           ))
                         }
                         </Fragment>
                       </TableBody>
                     </Table>
                   </div>
                 </React.Fragment>
                  }
                  {
                    childIpStore.searched &&
                    <React.Fragment>
                      <div class="text-right page-action">
                        <Pagination
                          current={ childIpStore.current_page }
                          total={ childIpStore.total_page }
                          goToPage={ (page) => childIpStore.fetchOfferStats(page) }
                        >
                        </Pagination>
                      </div>
                    </React.Fragment>
                  }
                </RctCollapsibleCard>
              </div>
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
}


export default ChildLander;
