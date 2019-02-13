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
import lastLanderStore from 'Storage/lastLanderStore';
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
class lastChildLander extends Component {

  constructor(props) {
    super(props);
    this.countries = Countries;
    this.childoffer = '';
    this.openLanderModel = this.openLanderModel.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.state = {
      page:lastLanderStore.current_page,
      search_value : ''
    };
    this.onApplyTime = this.onApplyTime.bind(this);
    this.startDate = moment();
    this.endDate = moment();
    this.search_value='';
  }


  componentDidMount() {
    // const page = this.props.page || 1;
    // const {campaign_id,path_id} = this.props.match.params;
    // lastLanderStore.fetchChildLanderStats(page,campaign_id,path_id,this.search_value);
    // this.setState({page:lastLanderStore.current_page})
    const {campaign_id,path_id} = this.props.match.params;
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      lastLanderStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      lastLanderStore.fetchChildLanderStats(lastLanderStore.current_page,campaign_id,path_id);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      lastLanderStore.setDateRange(start_timestamp, end_timestamp);
      lastLanderStore.fetchChildLanderStats(lastLanderStore.current_page,campaign_id,path_id);
    }
  }

  openLanderModel(lander) {
    // console.log(`opening offer ${offer['id']} dialog`);
    lastLanderStore.setLander({...lander});
    lastLanderStore.openModal();
  }

  onDatesChange({startDate, endDate}) {
    console.log('parent start', startDate);
    console.log('parent end', endDate);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  onApplyTime() {
    const {campaign_id,path_id} = this.props.match.params;
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      lastLanderStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      lastLanderStore.fetchChildLanderStats(lastLanderStore.current_page,campaign_id,path_id);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      lastLanderStore.setDateRange(start_timestamp, end_timestamp);
      lastLanderStore.fetchChildLanderStats(lastLanderStore.current_page,campaign_id,path_id);
    }
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    this.search_value = vaule;
  }

  handleSearchSubmit(e){
    e.preventDefault();
    const search_value = this.search_value;
    const {campaign_id,path_id} = this.props.match.params;
    lastLanderStore.searchPage(lastLanderStore.current_page,campaign_id,path_id,search_value);
    if(search_value==''){
      lastLanderStore.fetchChildLanderStats(lastLanderStore.current_page,campaign_id,path_id,this.search_value);
    }
  }

  sweetClose(successSub){
    lastLanderStore.closeSweet();
  }


  handleChange(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    this.setState({ page : value })
    // console.log('value ===>',value)
    // lastLanderStore.current_page = value;
    // lastLanderStore.fetchChildLanderStats(value);
  };

  handleBlur(evt){
    evt.preventDefault();
    let value = evt.target.value;
    lastLanderStore.fetchChildLanderStats(value);
    // console.log('value ===>',value)
  }


  render() {
    const {campaign_id, campaign_name,offer_name} = this.props.match.params;
    const countries = this.countries;
    const { loaded, error } = lastLanderStore;
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
                <title>{AppConfig.brandName} - Lander</title>
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
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/offer` } className="activeLink">Offers</NavLink>
                      </h2>
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/lander` } >Landers</NavLink>
                      </h2>
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/ip` } >IP</NavLink>
                      </h2>
                      <h2 class="page-title-font text-link">
                        <NavLink to={ `/campaign/${campaign_id}/${campaign_name}/country` } >Country</NavLink>
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
                      <Chip label="Offer" className="chip-text" component="a" href={ `/campaign/${campaign_id}/${campaign_name}/offer` } clickable />
                      <Chip label={`${ offer_name }`} className="mr-5 chip-name" />
                      <div className="page-title text-icon">
                        <h2 class="page-title-font">
                          /
                        </h2>
                      </div>
                      <Chip label="Lander" className="chip-text chip-border-radius" />
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
                           <TableCell className="text-left tableTh lander_name ">Lander</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_url ">Url</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_visit ">Visit</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_click ">Click</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_ctr ">CTR</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_country ">Country</TableCell>
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
                         {lastLanderStore.childLanders.landers &&
                           lastLanderStore.childLanders.landers.map(lander => (
                             <React.Fragment>
                              <TableRow hover key={lander.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">
                                  { lander.name }
                                </TableCell>
                                <TableCell numeric className="text-left paddingTd"><a href={lander.url} target="_blank">{lander.url}</a></TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.ctr}</TableCell>
                                <TableCell numeric className="text-left paddingTd">
                                {
                                  countries.map(({value: country_code, label: country_label})=>{
                                    if(country_code == lander.country) {
                                      return(
                                        <span key={ `${lander.id}-${country_code}` }>
                                          { country_label }
                                        </span>
                                      )
                                    }
                                  })
                                }
                                </TableCell>
                              </TableRow>
                             </React.Fragment>
                           ))
                          }
                          {!lastLanderStore.childLanders.landers &&
                           lastLanderStore.childLanders.map(lander => (
                             <React.Fragment>
                              <TableRow hover key={lander.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">
                                  { lander.name }
                                </TableCell>
                                <TableCell numeric className="text-left paddingTd"><a href={lander.url} target="_blank">{lander.url}</a></TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.ctr}</TableCell>
                                <TableCell numeric className="text-left paddingTd">
                                {
                                  countries.map(({value: country_code, label: country_label})=>{
                                    if(country_code == lander.country) {
                                      return(
                                        <span key={ `${lander.id}-${country_code}` }>
                                          { country_label }
                                        </span>
                                      )
                                    }
                                  })
                                }
                                </TableCell>
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
                           <TableCell className="text-left tableTh lander_name ">Lander</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_url ">Url</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_visit ">Visit</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_click ">Click</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_ctr ">CTR</TableCell>
                           <TableCell className="text-left tableTh paddingTd lander_country ">Country</TableCell>
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
                         {lastLanderStore.childLanders.landers &&
                           lastLanderStore.childLanders.landers.map(lander => (
                             <React.Fragment>
                              <TableRow hover key={lander.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">
                                  { lander.name }
                                </TableCell>
                                <TableCell numeric className="text-left paddingTd"><a href={lander.url} target="_blank">{lander.url}</a></TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.ctr}</TableCell>
                                <TableCell numeric className="text-left paddingTd">
                                {
                                  countries.map(({value: country_code, label: country_label})=>{
                                    if(country_code == lander.country) {
                                      return(
                                        <span key={ `${lander.id}-${country_code}` }>
                                          { country_label }
                                        </span>
                                      )
                                    }
                                  })
                                }
                                </TableCell>
                              </TableRow>
                             </React.Fragment>
                           ))
                          }
                          {!lastLanderStore.childLanders.landers &&
                           lastLanderStore.childLanders.map(lander => (
                             <React.Fragment>
                              <TableRow hover key={lander.id}>
                                <TableCell numeric className="text-left paddingTd pl-20">
                                  { lander.name }
                                </TableCell>
                                <TableCell numeric className="text-left paddingTd"><a href={lander.url} target="_blank">{lander.url}</a></TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.ctr}</TableCell>
                                <TableCell numeric className="text-left paddingTd">
                                {
                                  countries.map(({value: country_code, label: country_label})=>{
                                    if(country_code == lander.country) {
                                      return(
                                        <span key={ `${lander.id}-${country_code}` }>
                                          { country_label }
                                        </span>
                                      )
                                    }
                                  })
                                }
                                </TableCell>
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
                    lastLanderStore.searched &&
                    <React.Fragment>
                      <div class="text-right page-action">
                        <Pagination
                          current={ lastLanderStore.current_page }
                          total={ lastLanderStore.total_page }
                          goToPage={ (page) => lastLanderStore.fetchChildLanderStats(page) }
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


export default lastChildLander;
