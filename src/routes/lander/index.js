/**
 * About Us Page
 */
import React, { Component,Fragment } from 'react';
import { findDOMNode } from 'react-dom';
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
import {
  Input,Form
} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
// import TestimonialSlider from './components/testimonial-slider';
// import Clientslider from './components/client-slider';

import { observer } from 'mobx-react';
// app default layout
import RctAppLayout from 'Components/RctAppLayout';

// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import { RctCard } from 'Components/RctCard';

import Login from 'Container/SigninFirebase';
import AppConfig from 'Constants/AppConfig';

import MUIDataTable from "mui-datatables";

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import SearchForm from 'Components/Header/SearchForm';
import MobileSearchForm from 'Components/Header/MobileSearchForm';
import moment from 'moment';
import Pagination from "../components/pagination/Pagination";
import landerPageStore from 'Storage/landerPageStore';
import landerModelStore from 'Storage/landerModelStore';
import utcStore from 'Storage/utcStore';
import LanderModal from './landerModel';
import DatePicker from 'Assets/js/PresetDateRangePicker';

import Countries from 'Constants/countries';
import "Assets/css/index.css";

const styles = theme => ({
  trFullFill: {
    'height': 'unset',
  },
  tdFullFill: {
    'padding': 0,
  },
  addLanderBtn:{
    'position': 'absolute',
    'right': 0,
    'top': '12px'
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
class Lander extends Component {

  constructor(props) {
    super(props);
    this.countries = Countries;
    this.openLanderModel = this.openLanderModel.bind(this);
    this.state = {
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
      landerPageStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      landerPageStore.fetchLanderStats(landerPageStore.current_page);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      landerPageStore.setDateRange(start_timestamp, end_timestamp);
      landerPageStore.fetchLanderStats(landerPageStore.current_page);
    }
  }

  openLanderModel(lander) {
    landerModelStore.setLander({...lander});
    landerModelStore.openModal();
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
      landerPageStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      landerPageStore.fetchLanderStats(landerPageStore.current_page);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      landerPageStore.setDateRange(start_timestamp, end_timestamp);
      landerPageStore.fetchLanderStats(landerPageStore.current_page);
    }
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    this.search_value = vaule;
  }

  handleSearchSubmit(e){
    e.preventDefault();
    const search_value = this.search_value;
    landerPageStore.searchPage(landerPageStore.current_page,search_value);
    if(search_value==''){
      landerPageStore.fetchLanderStats(landerPageStore.current_page,this.search_value);
    }
  }

  sweetClose(successSub){
    landerModelStore.closeSweet();
  }

  render() {
    const countries = this.countries;

    const { loaded, error } = landerPageStore;

    const { classes } = this.props;
    const offsetHeight = document.body.offsetHeight;
    const sub = offsetHeight - 240;
    const max_height = sub + "px";
    const styleObj = {
      maxHeight : max_height
    }

    // landerPageStore.landers.map(({id}) => {
    //   console.log(`rendering lander ${id}`);
    // });

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
                <title>{AppConfig.brandName} - Lander</title>
              </Helmet>
              <div className="about-detail">
                <RctCollapsibleCard heading={
                  <div className="row no-gutters row-eq-height align-items-center">
                    <PageTitleBar title={<IntlMessages id="Lander" />}  />
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
                      onClick={ (evt) => { return this.openLanderModel({}) } }
                      className="text-white btn-icon addLanderBtn">
                      <i className="zmdi zmdi-plus"></i> Add Lander</MatButton>
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
                            <TableCell className="text-left tableTh lander_name ">Name</TableCell>
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
                          {
                            landerPageStore.landers.map(lander => (
                              <TableRow hover key={lander.id}>
                                <TableCell numeric className="text-left paddingTd">
                                  {
                                    (landerModelStore.lander && landerModelStore.lander['id'] == lander.id && landerModelStore.open)? (
                                      <LinearProgress />
                                    ): (
                                      <Button onClick={ () => { this.openLanderModel(lander) } }>
                                        { lander.name }
                                      </Button>
                                    )
                                  }
                                </TableCell>
                                <TableCell numeric className="text-left paddingTd"><a href={lander.url} target="_blank">{lander.url}</a></TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit == 0 ? '' : ((lander.click / lander.visit)*100).toFixed(2) + '%'}</TableCell>
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
                            <TableCell className="text-left tableTh lander_name ">Name</TableCell>
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
                          {
                            landerPageStore.landers.map(lander => (
                              <TableRow hover key={lander.id}>
                                <TableCell numeric className="text-left paddingTd">
                                  {
                                    (landerModelStore.lander && landerModelStore.lander['id'] == lander.id && landerModelStore.open)? (
                                      <LinearProgress />
                                    ): (
                                      <Button onClick={ () => { this.openLanderModel(lander) } }>
                                        { lander.name }
                                      </Button>
                                    )
                                  }
                                </TableCell>
                                <TableCell numeric className="text-left paddingTd"><a href={lander.url} target="_blank">{lander.url}</a></TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.click}</TableCell>
                                <TableCell numeric className="text-left paddingTd">{lander.visit == 0 ? '' : ((lander.click / lander.visit)*100).toFixed(2) + '%'}</TableCell>
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
                            ))
                          }
                          </Fragment>
                        </TableBody>
                      </Table>
                    </div>
                  </React.Fragment>
                  }
                  {landerPageStore.searched &&
                    <React.Fragment>
                      <div class="text-right page-action">
                        {/* <span class="pagecurrent-txt">Page: { landerPageStore.current_page } / { landerPageStore.total_page }</span> */}
                        <Pagination
                          current={ landerPageStore.current_page }
                          total={ landerPageStore.total_page }
                          goToPage={ (page) => landerPageStore.fetchLanderStats(page) }
                        >
                        </Pagination>
                      </div>
                    </React.Fragment>
                  }
                </RctCollapsibleCard>
              </div>
            </div>
            <LanderModal></LanderModal>
            <SweetAlert
              success
              show={ landerModelStore.successSub }
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


export default Lander;
