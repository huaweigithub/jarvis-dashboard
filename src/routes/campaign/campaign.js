import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from "react-helmet";
import { Form,Input } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MatButton from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom';
// import TestimonialSlider from './components/testimonial-slider';
// import Clientslider from './components/client-slider';

import { observer } from 'mobx-react';
import moment from 'moment';
import AppConfig from 'Constants/AppConfig';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import { RctCard } from 'Components/RctCard';

// app default layout
import RctAppLayout from 'Components/RctAppLayout';

import MUIDataTable from "mui-datatables";

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import SearchForm from 'Components/Header/SearchForm';
import QueueAnim from 'rc-queue-anim';

import CampaignDialog from './campaignDialog';

import utcStore from 'Storage/utcStore';
import campaignSummaryPaginationStore from 'Storage/campaignSummaryPaginationStore';
import campaignDialogStore from 'Storage/campaignDialogStore';
import campaign from 'Api/campaign';

import DatePicker from 'Assets/js/PresetDateRangePicker';

import Pagination from "../components/pagination/Pagination";

import StatusListSimple from './components/StatusListSimple';

import Login from 'Container/SigninFirebase';

import "Assets/css/index.css";

import SearchInput from 'Assets/js/SearchInput';

const styles = theme => ({
  tableHead:{
    background: '#7a7e93',
  },
  pd_10:{
    padding:'10px'
  },
  tableBodyNone:{
    display:'none',
  },

})

@withStyles(styles)
@observer
class CompaignHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search_value : ''
    };
    this.status_list = [
      {
        value:"block_all",
        label:"zmdi zmdi-pause-circle zmd-fw"
      },
      {
        value:"active",
        label:"zmdi zmdi-play-circle zmd-fw"
      },
      {
        value:"allow_all",
        label:"zmdi zmdi-dot-circle zmd-fw"
      },
      {
        value:"under_review",
        label:"zmdi zmdi-search-in-page zmd-fw"
      }
    ]
    this.onApplyTime = this.onApplyTime.bind(this);
    this.startDate = moment();
    this.endDate = moment();
    this.search_value='';
    this.changeSettings = this.changeSettings.bind(this);
    this.openCampaignDialog = this.openCampaignDialog.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      campaignSummaryPaginationStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      campaignSummaryPaginationStore.fetchCampaignSummary(campaignSummaryPaginationStore.current_page);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      campaignSummaryPaginationStore.setDateRange(start_timestamp, end_timestamp);
      campaignSummaryPaginationStore.fetchCampaignSummary(campaignSummaryPaginationStore.current_page);
    }
  }

  changeSettings(campaign_id, settings) {
    let setting_list = [];
    let campaign_list = campaignSummaryPaginationStore.campaign_summary;

    campaign_list.map( (campaign) =>{
      // console.log(campaign.campaign_id)

      if(campaign.campaign_id == campaign_id){
        for (let key in settings) {
          if(key == 'allowed_status' ){
            campaignSummaryPaginationStore.statusLoad(campaign_id,true);
          }
          setting_list.push({'name': key, 'content': settings[key]})
        };
      }
    })

    // for (let key in settings) {
    //   if(key == 'allowed_status' ){
    //     campaignSummaryPaginationStore.statusLoad(campaign_id,true);
    //   }
    //   setting_list.push({'name': key, 'content': settings[key]})
    // };
    // console.log('setting_list', setting_list);
    campaign.patch(
      campaign_id,
      {
        'settings': setting_list
      }
    )
    .then(({id: campaign_id, settings: settings}) => {
      console.log('updating store', settings);
      campaignSummaryPaginationStore.setCampaignSettings(
        campaign_id,
        settings
      );
      campaignSummaryPaginationStore.statusLoad(false);
    })
    .catch(err => {
      console.log(err);
    })
  }

  openCampainDialog(campaign_id) {
    console.log('this campaign_id',campaign_id)
    campaignDialogStore.fetchCampaign(campaign_id, true);
  }

  openCampaignDialog(){
    campaignDialogStore.openDialog({
      "host": "",
      "name": "",
      // "cluster_ip": "",
      "settings": [  // 配置
        {
          "name": "on_off",
          "content": "on"
        },
        {
          "name": "allowed_status",
          "content": "active"
        }
      ],
      "conditions": [
        {
          "name": "country",  // 国家
          "content": [
            6252001
          ]
        },
        {
          "name": "platform",  // 平台
          "content": "mobile"
        }
      ],
      "publish": [  // 发布模式(参看上面的两种格式)
        {
          "url": "",
          "name": "safe_page",
          "mode": "reverse_proxy"
        },
        {
          "url": "",
          "name": "money_page",
          "mode": "direct_link"
        }
      ],
      "pathes": [
        {
          "name": "Path Name",
          "weight": 50,  // 该path的权重
          "landers": [
            {
              "weight": 50,  // lander的权重
            },
          ],
          "offers": [
            {
              "weight": 50,  // offer的权重
            },
          ]
        },
      ]
        },true);
    }

  onDatesChange({startDate, endDate}) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  onApplyTime() {
    if(utcStore.utc == "utc-8"){
      const start_timestamp_utc = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' -08:00').unix();
      const end_timestamp_utc = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' -08:00').unix();
      campaignSummaryPaginationStore.setDateRange(start_timestamp_utc, end_timestamp_utc);
      campaignSummaryPaginationStore.fetchCampaignSummary(campaignSummaryPaginationStore.current_page);
    }
    else{
      const start_timestamp = moment(this.startDate.format('YYYY MM DD 00:00:00') + ' +08:00').unix();
      const end_timestamp = moment(this.endDate.format('YYYY MM DD 23:59:59') + ' +08:00').unix();
      campaignSummaryPaginationStore.setDateRange(start_timestamp, end_timestamp);
      campaignSummaryPaginationStore.fetchCampaignSummary(campaignSummaryPaginationStore.current_page);
    }
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    this.search_value = vaule;
  }

  handleSearchSubmit(e){
    e.preventDefault();
    const search_value = this.search_value;
    campaignSummaryPaginationStore.searchPage(campaignSummaryPaginationStore.current_page,search_value);
    if(search_value==''){
      campaignSummaryPaginationStore.fetchCampaignSummary(campaignSummaryPaginationStore.current_page,this.search_value);
    }
  }

  sweetClose(successSub){
    campaignDialogStore.closeSweet();
  }

  render() {
    const { classes } = this.props;
    const { loaded, error, disabled} = campaignSummaryPaginationStore;
    const status_list = this.status_list;
    const offsetHeight = document.body.offsetHeight;
    const sub = offsetHeight - 240;
    const max_height = sub + "px";
    const styleObj = {
      maxHeight : max_height
    }

    console.log("campaignSummaryPaginationStore",campaignSummaryPaginationStore)

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
              <title>{AppConfig.brandName} - Campaign</title>
            </Helmet>
            <div className="about-detail">
              <RctCollapsibleCard heading={
                <div className="row no-gutters row-eq-height align-items-center">
                  <PageTitleBar title={<IntlMessages id="Campaign" />}  />
                  <div className="searchform search-icon d-inline-block">
                    <Form className="search-wrapper" onSubmit={this.handleSearchSubmit}>
                      <Input
                      type="search"
                      className="search-input-lg"
                      placeholder="Search.."
                      onChange={this.handleChangeSearch}
                      />
                      {/* <SearchInput handleChangeSearch={this.handleChangeSearch}></SearchInput> */}
                      <IconButton className="search-button" type="submit" aria-label="Search" >
                        <i className="zmdi zmdi-search zmdi-hc-sm"></i>
                      </IconButton>
                    </Form>
                  </div>
                  <div className="datePicker-box">
                    {/* <Input className="date-utc" type="select" bsSize="sm">
                      <option selected value="utc+8">UTC+08:00</option>
                      <option value="utc-8">UTC-08:00</option>
                    </Input> */}
                    <DatePicker onDatesChange={ this.onDatesChange.bind(this) }></DatePicker>
                    <MatButton variant="raised" color="primary" className="text-white" onClick={ this.onApplyTime }>Apply</MatButton>
                  </div>
                  <div className="add-new">
                    <MatButton variant="raised"
                    color="primary"
                    onClick={ (evt) => { return this.openCampaignDialog({}) } }
                    className="text-white btn-icon addOfferBtn">
                    <i className="zmdi zmdi-plus"></i> Add Campaign</MatButton>
                  </div>
                </div>
              }
              fullBlock>
                {/* <MatButton variant="raised"
                  color="primary"
                  onClick={ (evt) => { return this.openCampaignDialog({}) } }
                  className="text-white btn-icon addOfferBtn">
                  <i className="zmdi zmdi-plus"></i> Add Campaign</MatButton> */}
                  { !loaded && <LinearProgress /> }
                  { error && <p>{ error }</p> }
                  { loaded && !error &&
                  <React.Fragment>
                    <div className="table-responsive table-topfix" style={styleObj}>
                      <Table>
                        <TableHead classes={{ root:classes.tableHead }}>
                          <TableRow hover>
                            <TableCell className="text-left tableTh paddingTd pathNameTh campaign_name">Name</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_profit">Profit</TableCell>
                            <TableCell className="text-left tableTh paddingTd sp_visit">SP Visit</TableCell>
                            <TableCell className="text-left tableTh paddingTd lp_visit">LP Visit</TableCell>
                            <TableCell className="text-left tableTh paddingTd lp_click">LP Click</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_ctr">CTR</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_cr">CR</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_roi">ROI</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_epv">EPV</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_epc">EPC</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_show">Expand</TableCell>
                            <TableCell className="text-left tableTh paddingTd pathStatusTh campaign_status">Status</TableCell>
                            <TableCell className="text-center tableTh paddingTd campaign_switch">Switch</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody classes={{ root:classes.tableBodyNone }}>
                          <Fragment>
                            {campaignSummaryPaginationStore.campaign_summary.map(campaign =>
                              (
                                <TableRow hover key={ campaign.campaign_id }>
                                  <TableCell numeric className="text-left paddingTd pathNameTd">
                                    <Button onClick={ () => { this.openCampainDialog(campaign.campaign_id) } }>
                                      { campaign.name }
                                    </Button>
                                  </TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.profit}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.safe_page_count}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.money_page_count}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.money_page_click}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.ctr }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.cr }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.roi }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.epv }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.epc }</TableCell>
                                  <TableCell numeric className="text-left paddingTd">
                                    <Link to={ `/campaign/${campaign.campaign_id}/${campaign.name}/offer` } >
                                      <IconButton className={classes.pd_10}>
                                        <i className="zmdi zmdi-eye zmdi-hc-lg"></i>
                                      </IconButton>
                                    </Link>
                                  </TableCell>
                                  <TableCell numeric className="text-left paddingTd pathStatusTh ">
                                    <StatusListSimple
                                      currentAllowedStatus={ campaign.allowed_status }
                                      switchStatus={ (new_status) => { this.changeSettings(campaign.campaign_id, {'allowed_status': new_status}) } }
                                    />
                                  </TableCell>
                                  <TableCell numeric className="text-center paddingTd">
                                    <MatButton className="mr-10" style={ campaign.on_off == "on" ? {'color': 'green'} : {'color': 'rgba(0, 0, 0, 0.54)'}}
                                      onClick={ () => { this.changeSettings(campaign.campaign_id, {'on_off': campaign.on_off == "on"? 'off': 'on'}) } }
                                    >
                                      { campaign.on_off.toUpperCase() }
                                    </MatButton>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </Fragment>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="table-responsive" style={styleObj}>
                      <Table>
                        <TableHead classes={{ root:classes.tableHead }}>
                          <TableRow hover>
                            <TableCell className="text-left tableTh paddingTd pathNameTh campaign_name">Name</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_profit">Profit</TableCell>
                            <TableCell className="text-left tableTh paddingTd sp_visit">SP Visit</TableCell>
                            <TableCell className="text-left tableTh paddingTd lp_visit">LP Visit</TableCell>
                            <TableCell className="text-left tableTh paddingTd lp_click">LP Click</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_ctr">CTR</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_cr">CR</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_roi">ROI</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_epv">EPV</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_epc">EPC</TableCell>
                            <TableCell className="text-left tableTh paddingTd campaign_show">Expand</TableCell>
                            <TableCell className="text-left tableTh paddingTd pathStatusTh campaign_status">Status</TableCell>
                            <TableCell className="text-center tableTh paddingTd campaign_switch">Switch</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody classes={{ root:classes.tableBody }}>
                          <Fragment>
                            {campaignSummaryPaginationStore.campaign_summary.map(campaign =>
                              (
                                <TableRow hover key={ campaign.campaign_id }>
                                  <TableCell numeric className="text-left paddingTd pathNameTd">
                                    <Button onClick={ () => { this.openCampainDialog(campaign.campaign_id) } }>
                                      { campaign.name }
                                    </Button>
                                  </TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.profit}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.safe_page_count}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.money_page_count}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{campaign.money_page_click}</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.ctr }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.cr }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.roi }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.epv }</TableCell>
                                  <TableCell numeric className="text-left paddingTd ">{ campaign.epc }</TableCell>
                                  <TableCell numeric className="text-left paddingTd">
                                    <Link to={ `/campaign/${campaign.campaign_id}/${campaign.name}/offer` } >
                                      <IconButton className={classes.pd_10}>
                                        <i className="zmdi zmdi-eye zmdi-hc-lg"></i>
                                      </IconButton>
                                    </Link>
                                  </TableCell>
                                  <TableCell numeric className="text-left paddingTd pathStatusTh ">
                                    <StatusListSimple
                                      currentAllowedStatus={ campaign.allowed_status }
                                      switchStatus={ (new_status) => { this.changeSettings(campaign.campaign_id, {'allowed_status': new_status}) } }
                                    />
                                  </TableCell>
                                  <TableCell numeric className="text-center paddingTd">
                                    <MatButton className="mr-10" style={ campaign.on_off == "on" ? {'color': 'green'} : {'color': 'rgba(0, 0, 0, 0.54)'}}
                                      onClick={ () => { this.changeSettings(campaign.campaign_id, {'on_off': campaign.on_off == "on"? 'off': 'on'}) } }
                                    >
                                      { campaign.on_off.toUpperCase() }
                                    </MatButton>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </Fragment>
                        </TableBody>
                      </Table>
                    </div>
                </React.Fragment>
                }
                {
                  campaignSummaryPaginationStore.searched &&
                  <React.Fragment>
                    <div className="text-right page-action">
                      <Pagination
                        current={ campaignSummaryPaginationStore.current_page }
                        total={ campaignSummaryPaginationStore.total_page }
                        goToPage={ (page) => campaignSummaryPaginationStore.fetchCampaignSummary(page) }
                      >
                      </Pagination>
                    </div>
                  </React.Fragment>
                }
                <SweetAlert
                  success
                  show={ campaignDialogStore.successSub }
                  title="Good Job!"
                  btnSize="sm"
                  onConfirm={ this.sweetClose.bind(this) } >
                  You have saved successfully!
                </SweetAlert>
              </RctCollapsibleCard>
            </div>
          </div>
          <CampaignDialog></CampaignDialog>
        </React.Fragment>
        }
      </div>
    );
  }
}


export default CompaignHome;
