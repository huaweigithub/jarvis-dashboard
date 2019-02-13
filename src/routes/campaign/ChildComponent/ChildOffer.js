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
import Chip from '@material-ui/core/Chip';
// rct card box
import { RctCard } from 'Components/RctCard';
import {
  Input,Form
} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';

import MUIDataTable from "mui-datatables";

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import moment from 'moment';
import Pagination from "../../components/pagination/Pagination";
import childOfferStore from 'Storage/childOfferStore';
import offerModelStore from 'Storage/offerModelStore';
import DatePicker from 'Assets/js/PresetDateRangePicker';
import Login from 'Container/SigninFirebase';
import utcStore from 'Storage/utcStore';

import Countries from 'Constants/countries';
import "Assets/css/index.css";
import OfferModal from './modal/offerModel';

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
class ChildOffer extends Component {
  constructor(props) {
    super(props);
    this.countries = Countries;
    this.childoffer = '';
    this.openOfferModel = this.openOfferModel.bind(this);
    this.state = {
      page:childOfferStore.current_page,
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
    // childOfferStore.fetchChildOfferStats(page,campaign_id,this.search_value);
    // this.setState({page:childOfferStore.current_page})
    const campaign_id = this.props.match.params.campaign_id;
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      childOfferStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      childOfferStore.fetchChildOfferStats(childOfferStore.current_page,campaign_id);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      childOfferStore.setDateRange(start_timestamp, end_timestamp);
      childOfferStore.fetchChildOfferStats(childOfferStore.current_page,campaign_id);
    }
  }

  openOfferModel(offer,id) {
    offerModelStore.setOffer({...offer});
    offerModelStore.openModal();
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
      childOfferStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      childOfferStore.fetchChildOfferStats(childOfferStore.current_page,campaign_id);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      childOfferStore.setDateRange(start_timestamp, end_timestamp);
      childOfferStore.fetchChildOfferStats(childOfferStore.current_page,campaign_id);
    }
  }

  sweetClose(successSub){
    offerModelStore.closeSweet();
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    this.search_value = vaule;
  }

  handleSearchSubmit(e){
    e.preventDefault();
    const search_value = this.search_value;
    const campaign_id = this.props.match.params.campaign_id;
    childOfferStore.searchPage(childOfferStore.current_page,campaign_id,search_value);
    if(search_value == ''){
      childOfferStore.fetchChildOfferStats(childOfferStore.current_page,campaign_id,this.search_value);
    }
  }


  handleChange(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    this.setState({ page : value })
    // console.log('value ===>',value)
    // childOfferStore.current_page = value;
    // childOfferStore.fetchChildOfferStats(value);
  };

  handleBlur(evt){
    evt.preventDefault();
    let value = evt.target.value;
    childOfferStore.fetchChildOfferStats(value);
    // console.log('value ===>',value)
  }


  render() {
    const {campaign_id, campaign_name} = this.props.match.params;
    const countries = this.countries;
    const { loaded, error } = childOfferStore;
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
                <title>{AppConfig.brandName} - Offer</title>
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
                      {/* <Chip label="Campaign" className="chip-text" component="link" href="/campaign" clickable /> */}
                      <Link to={ `/campaign` } activeClassName="activeLink">
                        <Chip label="Campaign" className="chip-text"  clickable />
                      </Link>
                      <Chip label={`${ campaign_name }`} className="mr-5 chip-name" />
                      <div className="page-title text-icon">
                        <h2 class="page-title-font">
                          /
                        </h2>
                      </div>
                      <Chip label="Offer" className="chip-text chip-border-radius" component="a" href={ `/campaign/${campaign_id}/${campaign_name}/offer` } clickable />
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
                            <TableCell className="text-left tableTh offer_name">Offer</TableCell>
                            <TableCell className="text-left tableTh offer_visit paddingTd">Visit</TableCell>
                            <TableCell className="text-left tableTh offer_click paddingTd">Click</TableCell>
                            <TableCell className="text-left tableTh offer_ctr paddingTd">CTR</TableCell>
                            <TableCell className="text-left tableTh offer_country paddingTd">Country</TableCell>
                            <TableCell className="text-left tableTh offer_payout paddingTd">Payout Sum</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_show">Expand</TableCell>
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
                            {childOfferStore.childOffers.offers &&
                              childOfferStore.childOffers.offers.map(offer => (
                                <React.Fragment>
                                  <TableRow hover key={offer.id}>
                                    <TableCell numeric className="text-left paddingTd">
                                      {
                                        (offerModelStore.offer && offerModelStore.offer['id'] == offer.id && offerModelStore.open)? (
                                          <LinearProgress />
                                        ): (
                                          <Button onClick={ () => { this.openOfferModel(offer,campaign_id) } }>
                                            { offer.name }
                                          </Button>
                                        )
                                      }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.visit}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.click}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.ctr}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">
                                    {
                                      countries.map(({value: country_code, label: country_label})=>{
                                        if(country_code == offer.country) {
                                          return(
                                            <span key={ `${offer.id}-${country_code}` }>
                                              { country_label }
                                            </span>
                                          )
                                        }
                                      })
                                    }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{(offer.payout_sum).toFixed(2)}</TableCell>
                                    <TableCell numeric className="text-left paddingTd">
                                      <Link to={ `/campaign/${campaign_id}/${offer.path_id}/${campaign_name}/${offer.name}/lastChildLander` }>
                                        <IconButton className={classes.pd_10}>
                                          <i className="zmdi zmdi-eye zmdi-hc-lg"></i>
                                        </IconButton>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              ))
                            }
                            {!childOfferStore.childOffers.offers &&
                              childOfferStore.childOffers.map(offer => (
                                <React.Fragment>
                                  <TableRow hover key={offer.id}>
                                    <TableCell numeric className="text-left paddingTd">
                                      {
                                        (offerModelStore.offer && offerModelStore.offer['id'] == offer.id && offerModelStore.open)? (
                                          <LinearProgress />
                                        ): (
                                          <Button onClick={ () => { this.openOfferModel(offer,campaign_id) } }>
                                            { offer.name }
                                          </Button>
                                        )
                                      }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.visit}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.click}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.ctr}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">
                                    {
                                      countries.map(({value: country_code, label: country_label})=>{
                                        if(country_code == offer.country) {
                                          return(
                                            <span key={ `${offer.id}-${country_code}` }>
                                              { country_label }
                                            </span>
                                          )
                                        }
                                      })
                                    }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{(offer.payout_sum).toFixed(2)}</TableCell>
                                    <TableCell numeric className="text-left paddingTd">
                                      <Link to={ `/campaign/${campaign_id}/${offer.path_id}/${campaign_name}/${offer.name}/lastChildLander` }>
                                        <IconButton className={classes.pd_10}>
                                          <i className="zmdi zmdi-eye zmdi-hc-lg"></i>
                                        </IconButton>
                                      </Link>
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
                            <TableCell className="text-left tableTh offer_name">Offer</TableCell>
                            <TableCell className="text-left tableTh offer_visit paddingTd">Visit</TableCell>
                            <TableCell className="text-left tableTh offer_click paddingTd">Click</TableCell>
                            <TableCell className="text-left tableTh offer_ctr paddingTd">CTR</TableCell>
                            <TableCell className="text-left tableTh offer_country paddingTd">Country</TableCell>
                            <TableCell className="text-left tableTh offer_payout paddingTd">Payout Sum</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_show">Expand</TableCell>
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
                            {childOfferStore.childOffers.offers &&
                              childOfferStore.childOffers.offers.map(offer => (
                                <React.Fragment>
                                  <TableRow hover key={offer.id}>
                                    <TableCell numeric className="text-left paddingTd">
                                      {
                                        (offerModelStore.offer && offerModelStore.offer['id'] == offer.id && offerModelStore.open)? (
                                          <LinearProgress />
                                        ): (
                                          <Button onClick={ () => { this.openOfferModel(offer,campaign_id) } }>
                                            { offer.name }
                                          </Button>
                                        )
                                      }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.visit}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.click}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.ctr}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">
                                    {
                                      countries.map(({value: country_code, label: country_label})=>{
                                        if(country_code == offer.country) {
                                          return(
                                            <span key={ `${offer.id}-${country_code}` }>
                                              { country_label }
                                            </span>
                                          )
                                        }
                                      })
                                    }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{(offer.payout_sum).toFixed(2)}</TableCell>
                                    <TableCell numeric className="text-left paddingTd">
                                      <Link to={ `/campaign/${campaign_id}/${offer.path_id}/${campaign_name}/${offer.name}/lastChildLander` }>
                                        <IconButton className={classes.pd_10}>
                                          <i className="zmdi zmdi-eye zmdi-hc-lg"></i>
                                        </IconButton>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              ))
                            }
                            {!childOfferStore.childOffers.offers &&
                              childOfferStore.childOffers.map(offer => (
                                <React.Fragment>
                                  <TableRow hover key={offer.id}>
                                    <TableCell numeric className="text-left paddingTd">
                                      {
                                        (offerModelStore.offer && offerModelStore.offer['id'] == offer.id && offerModelStore.open)? (
                                          <LinearProgress />
                                        ): (
                                          <Button onClick={ () => { this.openOfferModel(offer,campaign_id) } }>
                                            { offer.name }
                                          </Button>
                                        )
                                      }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.visit}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.click}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{offer.ctr}</TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">
                                    {
                                      countries.map(({value: country_code, label: country_label})=>{
                                        if(country_code == offer.country) {
                                          return(
                                            <span key={ `${offer.id}-${country_code}` }>
                                              { country_label }
                                            </span>
                                          )
                                        }
                                      })
                                    }
                                    </TableCell>
                                    <TableCell numeric className="text-left paddingTd pl-5">{(offer.payout_sum).toFixed(2)}</TableCell>
                                    <TableCell numeric className="text-left paddingTd">
                                      <Link to={ `/campaign/${campaign_id}/${offer.path_id}/${campaign_name}/${offer.name}/lastChildLander` }>
                                        <IconButton className={classes.pd_10}>
                                          <i className="zmdi zmdi-eye zmdi-hc-lg"></i>
                                        </IconButton>
                                      </Link>
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
                    childOfferStore.searched &&
                    <React.Fragment>
                      <div class="text-right page-action">
                        <Pagination
                          current={ childOfferStore.current_page }
                          total={ childOfferStore.total_page }
                          goToPage={ (page) => childOfferStore.fetchChildOfferStats(page) }
                        >
                        </Pagination>
                      </div>
                    </React.Fragment>
                  }
                </RctCollapsibleCard>
              </div>
            </div>
            <OfferModal></OfferModal>
            <SweetAlert
              success
              show={ offerModelStore.successSub }
              title="Good Job!"
              btnSize="sm"
              onConfirm={ this.sweetClose.bind(this) } >
              You have saved successfully!
            </SweetAlert>
          </React.Fragment>
        }
      </div>
    );
  }
}


export default ChildOffer;
