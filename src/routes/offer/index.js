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

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import moment from 'moment';
import Pagination from "../components/pagination/Pagination";
import offerPageStore from 'Storage/offerPageStore';
import offerModelStore from 'Storage/offerModelStore';
import utcStore from 'Storage/utcStore';
import OfferModal from './offerModel';
import DatePicker from 'Assets/js/PresetDateRangePicker';

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
class Offer extends Component {

  constructor(props) {
    super(props);
    this.countries = Countries;
    this.openOfferModel = this.openOfferModel.bind(this);
    this.state = {
      page:offerPageStore.current_page,
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
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      offerPageStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      offerPageStore.fetchOfferStats(offerPageStore.current_page);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      offerPageStore.setDateRange(start_timestamp, end_timestamp);
      offerPageStore.fetchOfferStats(offerPageStore.current_page);
    }
  }

  openOfferModel(offer) {
    console.log(`opening offer ${offer['id']} dialog`);
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
    console.log('utcStore.utc--->',utcStore.utc)
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      offerPageStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      offerPageStore.fetchOfferStats(offerPageStore.current_page);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      offerPageStore.setDateRange(start_timestamp, end_timestamp);
      offerPageStore.fetchOfferStats(offerPageStore.current_page);
    }
  }

  sweetClose(successSub){
    offerModelStore.closeSweet();
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    // this.setState({ search_value : vaule})
    this.search_value = vaule;
  }

  handleSearchSubmit(e){
    e.preventDefault();
    // const {search_value} = this.state;
    const search_value = this.search_value;
    console.log('search_value',search_value)
    offerPageStore.searchPage(offerPageStore.current_page,search_value);
    if(search_value == ''){
      offerPageStore.fetchOfferStats(offerPageStore.current_page,this.search_value);
    }
  }

  handleChange(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    this.setState({ page : value })
    console.log('value ===>',value)
    // offerPageStore.current_page = value;
    // offerPageStore.fetchOfferStats(value);
  };

  handleBlur(evt){
    evt.preventDefault();
    let value = evt.target.value;
    offerPageStore.fetchOfferStats(value);
    console.log('value ===>',value)
  }


  render() {
    const countries = this.countries;

    const { loaded, error } = offerPageStore;

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
            <div className="about-wrapper">
              <Helmet>
                <title>{AppConfig.brandName} - Offer</title>
              </Helmet>
              <div className="about-detail">
                <RctCollapsibleCard heading={
                  <div className="row no-gutters row-eq-height align-items-center">
                    <PageTitleBar title={<IntlMessages id="Offer" />}  />
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
                    <div className="add-new">
                      <MatButton variant="raised"
                      color="primary"
                      onClick={ (evt) => { return this.openOfferModel({}) } }
                      className="text-white btn-icon addOfferBtn">
                      <i className="zmdi zmdi-plus"></i> Add Offer</MatButton>
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
                            <TableCell className="text-left tableTh offer_name">Name</TableCell>
                            <TableCell className="text-left tableTh offer_url paddingTd">Url</TableCell>
                            <TableCell className="text-left tableTh offer_visit paddingTd">Visit</TableCell>
                            <TableCell className="text-left tableTh offer_click paddingTd">Click</TableCell>
                            <TableCell className="text-left tableTh offer_ctr paddingTd">CTR</TableCell>
                            <TableCell className="text-left tableTh offer_country paddingTd">Country</TableCell>
                            <TableCell className="text-left tableTh offer_payout paddingTd">Payout</TableCell>
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
                            {
                              offerPageStore.offers.map(offer => (
                                <TableRow hover key={offer.id}>
                                  <TableCell numeric className="text-left paddingTd">
                                    {
                                      (offerModelStore.offer && offerModelStore.offer['id'] == offer.id && offerModelStore.open)? (
                                        <LinearProgress />
                                      ): (
                                        <Button onClick={ () => { this.openOfferModel(offer) } }>
                                          { offer.name }
                                        </Button>
                                      )
                                    }
                                  </TableCell>
                                  <TableCell numeric className="text-left paddingTd"><a href={offer.url} target="_blank">{offer.url}</a></TableCell>
                                  <TableCell numeric className="text-left paddingTd pl-5">{offer.visit}</TableCell>
                                  <TableCell numeric className="text-left paddingTd pl-5">{offer.click}</TableCell>
                                  <TableCell numeric className="text-left paddingTd pl-5">{offer.visit == 0 ? '' : ((offer.click / offer.visit)*100).toFixed(2) + '%'}</TableCell>
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
                                  <TableCell numeric className="text-left paddingTd pl-5">{ offer.payout }</TableCell>
                                </TableRow>
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
                            <TableCell className="text-left tableTh offer_name">Name</TableCell>
                            <TableCell className="text-left tableTh offer_url paddingTd">Url</TableCell>
                            <TableCell className="text-left tableTh offer_visit paddingTd">Visit</TableCell>
                            <TableCell className="text-left tableTh offer_click paddingTd">Click</TableCell>
                            <TableCell className="text-left tableTh offer_ctr paddingTd">CTR</TableCell>
                            <TableCell className="text-left tableTh offer_country paddingTd">Country</TableCell>
                            <TableCell className="text-left tableTh offer_payout paddingTd">Payout</TableCell>
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
                            {
                              offerPageStore.offers.map(offer => (
                                <TableRow hover key={offer.id}>
                                  <TableCell numeric className="text-left paddingTd">
                                    {
                                      (offerModelStore.offer && offerModelStore.offer['id'] == offer.id && offerModelStore.open)? (
                                        <LinearProgress />
                                      ): (
                                        <Button onClick={ () => { this.openOfferModel(offer) } }>
                                          { offer.name }
                                        </Button>
                                      )
                                    }
                                  </TableCell>
                                  <TableCell numeric className="text-left paddingTd"><a href={offer.url} target="_blank">{offer.url}</a></TableCell>
                                  <TableCell numeric className="text-left paddingTd pl-5">{offer.visit}</TableCell>
                                  <TableCell numeric className="text-left paddingTd pl-5">{offer.click}</TableCell>
                                  <TableCell numeric className="text-left paddingTd pl-5">{offer.visit == 0 ? '' : ((offer.click / offer.visit)*100).toFixed(2) + '%'}</TableCell>
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
                                  <TableCell numeric className="text-left paddingTd pl-5">{ offer.payout }</TableCell>
                                </TableRow>
                              ))
                            }
                          </Fragment>
                        </TableBody>
                      </Table>
                    </div>
                  </React.Fragment>
                  }
                  {
                    offerPageStore.searched &&
                    <React.Fragment>
                      <div class="text-right page-action">
                        <Pagination
                          current={ offerPageStore.current_page }
                          total={ offerPageStore.total_page }
                          goToPage={ (page) => offerPageStore.fetchOfferStats(page) }
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


export default Offer;
