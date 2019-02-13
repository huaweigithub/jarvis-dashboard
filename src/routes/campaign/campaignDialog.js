import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import classNames from 'classnames';
import { Alert } from 'reactstrap';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Scrollbars } from 'react-custom-scrollbars';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import { observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
// intl messages
import IntlMessages from 'Util/IntlMessages';
import {
  Card,
  CardBody,
  CardColumns,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  FormFeedback
} from 'reactstrap';

import {default as MuiInput} from '@material-ui/core/Input';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import MatButton from '@material-ui/core/Button';
import SweetAlert from 'react-bootstrap-sweetalert';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import campaignSummaryPaginationStore from 'Storage/campaignSummaryPaginationStore';
// import { observer } from 'mobx-react';
import {default as campaignApi} from 'Api/campaign';
// import clusterApi from 'clusterApi';
import campaignDialogStore from 'Storage/campaignDialogStore';
import Countries from 'Constants/countries';

import PathWeight from './components/PathWeight';

import "Assets/css/index.css";
import { values } from 'mobx';
import { func } from 'prop-types';


function TabContainer({ children }) {
  return (
    <Typography component="div">
      {children}
    </Typography>
  );
}

function getModalStyle() {
  const top = 50 ;
  const left = 50;
  return {
    width:'80%',
    height:'560px',
    overflow:'auto',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    margin:0
  };
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const styles = theme => ({
  centerDiv: {
    'width': '100%',
    'text-align': 'center',
  },
  dialogtext:{
    fontSize:"12px",
    marginBottom:0,
    backgroundColor:"#fafafa",
    padding: "0.375rem 0",
  },
  pagination: {
    'display': 'inline-block',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    right: '30px',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  divider: {
    // 'height': 1,
    // 'border': 'none',
    'margin-left': '-20px',
    'margin-right': '-20px',
  },
  clearPadding:{
    'padding':'0 0 60px 0',
    'overflow-x': 'hidden',
    'overflow-y': 'scroll',
    'maxHeight': '450px',
  },
  tabText:{
    "fontSize":"14px",
    'fontWeight':'bold!important',
  },
  clearstyle:{
    "padding":"0!important",
    "margin":"0!important"
  },
  defaulcheck:{
    "marginLeft":"4px",
    "marginTop":"2px",
    "width":"30px",
    "height":"30px",
    "minHeight":"30px",
  },
  tabscroll:{
    'overflow-x': 'hidden',
    'overflow-y': 'scroll',
    'max-height': '250px',
  },
  selectBorder:{
    margin:0,
    display: 'block',
    width: '100%',
    padding: '0rem 0.75rem',
    fontSize: '0.8rem',
    lineHeight: 1.5,
    color: '#464D69',
    backgroundColor: '#fafafa',
    backgroundClip: 'padding-box',
    border: '1px solid #EBEDF2',
    borderRadius: '0.25rem',
    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    boxSizing: 'inherit',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  subtransform:{
    textTransform:"initial",
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  pathEditIcon:{
    'padding':'0.3rem',
    'marginLeft':'4px'
  },
});

function getStyles(country, that) {
  return {
    fontWeight:
      condition_dict.indexOf(country) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}


@withStyles(styles)
@observer
class CampaignDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: null,
      campaign: null,
      cluster:null,
      activeIndex: 0,
      selected : false,
      on_off_switch:false,
      focus_path_index: 0,
    };
    this.changeValue = '';
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
    this.changeSettings = this.changeSettings.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleChangePublish = this.handleChangePublish.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.handleChangeRender = this.handleChangeRender.bind(this);
    this.handleChangePathesOffersWeight = this.handleChangePathesOffersWeight.bind(this);
    this.handleChangePathesLandersWeight = this.handleChangePathesLandersWeight.bind(this);
    this.handleChangeOffer = this.handleChangeOffer.bind(this);
    this.handleChangeLander = this.handleChangeLander.bind(this);
    this.handleCampaignUrlChange = this.handleCampaignUrlChange.bind(this);
  }

  changeSettings(value) {
    campaignDialogStore.setCampaignSetting('allowed_status', value);
  }

  handleSwitchChange(value){
    campaignDialogStore.setCampaiginSwitch("on_off",value);
  }

  handleCampaignUrlChange(to_status){
    const money_page_url = to_status
      ? ''
      : campaignDialogStore.campaign['url'];

    // console.log(`handleCampaignUrlChange`, to_status, money_page_url);
    campaignDialogStore.updateCampaignPublishMoneypage('url', money_page_url);
  }

  handleChangePublish(page, key, value){
    // console.log('change publish ===>', page, key, value);
    switch (page) {
      case 'safe_page':
        campaignDialogStore.updateCampaignPublishSafepage(key, value);
        break;
      case 'money_page':
        campaignDialogStore.updateCampaignPublishMoneypage(key, value);
        break;
      case 'other_page':
        campaignDialogStore.updateCampaignPublishOtherpage(key, value);
        break;
      default:
        console.log('error', page, key, value);
    };
  }

  handleChangeOffer(path_index,offer_index,value){
    campaignDialogStore.updatePathOffer(path_index,offer_index,value)
  }

  handleChangeLander(path_index,lander_index,value){
    console.log('value',value)
    campaignDialogStore.updatePathLander(path_index,lander_index,value)
  }

  componentWillMount() {
    campaignDialogStore.initLoadLanders();
    campaignDialogStore.initLoadOffers();
    campaignDialogStore.initLoadCluster();
  }

  handleChangeIndex(index) {
    this.setState({ activeIndex: index });
  }

  handleChangeTab(event, value) {
    this.setState({ activeIndex: value });
  }

  handleChangeRadio(name, value) {
    campaignDialogStore.updateCampaignDevice(name, value);
  }
  handleChangeRender(name, value) {
    campaignDialogStore.updateCampaignRender(name, value);
  }

  handleChange(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    if(name == 'country') {
      value = parseInt(value);
    }
    setTimeout(this.changeValue = value,1000);
    // this.changeValue = value;
    // setTimeout(campaignDialogStore.updateCampaignField(name, this.changeValue),500)
    campaignDialogStore.updateCampaignField(name, this.changeValue);
  };

  handleChangeCampaignCountry(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    campaignDialogStore.updateCampaignCountry(name, value);
  };

  addPath(){
    campaignDialogStore.pushPath({
      weight: 100,
      name: '',
      offers: [],
      landers: [],
      _new: true,
      _key_id: (new Date()).getTime()
    });
    this.setState({
      focus_path_index: campaignDialogStore.campaign.pathes.length - 1
    })
  }

  onCancelPath(index) {
    if(campaignDialogStore.campaign.pathes[index]._new) {
      console.log(`cancel new path ${index}`);
      campaignDialogStore.deleteCampaignPath(index);
      campaignDialogStore.campaign.pathes.map((path, index) => {
        console.log(index, path._new);
      })
    };
  }

  addOffer(){
    let index = this.state.focus_path_index;
    campaignDialogStore.pushOffer({
      weight:100,
      url:'',
      name:'',
      mode:'',
      host:'',
      country:'',
    },index)
  }

  addLander(){
    let index = this.state.focus_path_index;
    campaignDialogStore.pushLandr({
      weight:100,
      url:'',
      name:'',
      country:'',
    },index)
  }

  handleChangePathesOffersWeight(path_index,offer_weight_index,value){
    campaignDialogStore.updateCampaignPathOffersWeight(path_index,offer_weight_index, value)
  }

  handleChangePathesLandersWeight(path_index,path_lander_index,value){
    campaignDialogStore.updateCampaignPathLandersWeight(path_index,path_lander_index, value)
  }

  // onSubmitPathName({path_name: path_name, path_weight:path_weight, index: index_str}) {
  //   const index = parseInt(index_str);
  //   campaignDialogStore.updatePathAt(index, {name: path_name,weight:path_weight });
  // }

  // onSubmitPath(index, name, weight) {
  //
  // }

  onSubmitOfferName({offer_name: offer_name, offer_weight:offer_weight, index: index_str }) {
    const index = parseInt(index_str);
    campaignDialogStore.updateOfferAt(index, {name: offer_name, weight: offer_weight });
  }

  onSubmitLanderName({lander_name: lander_name, lander_weight:lander_weight, index: index_str}) {
    const index = parseInt(index_str);
    campaignDialogStore.updateLanderAt(index, {name: lander_name, weight:lander_weight });
  }

  onFocusPath(path_index) {
    if(this.state.focus_path_index != path_index) {
      console.log(`focus path on ${path_index}`);
      this.setState({focus_path_index: path_index});
    };
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if (campaignDialogStore.submitting) {
      campaignDialogStore.updateSubmitStatus({'submit_error': 'Please wait for previous submitting to finish'})
      return;
    };
    // console.log("campaign_id  ===>",campaignDialogStore.campaign.id)

    if(campaignDialogStore.campaign.id) {
      const {id: campaign_id} = campaignDialogStore.campaign;
      campaignDialogStore.updateSubmitStatus({'submitting': true, 'submit_error': null})

      campaignApi.patch(campaign_id, campaignDialogStore.campaign)
        .then(campaign => {
          // console.log("campaign ...",campaign)
          campaignDialogStore.setCampaign(campaign);
          campaignDialogStore.updateSubmitStatus({'submitting': false, 'submit_error': null});
          const page = this.props.page || 1;
          campaignSummaryPaginationStore.fetchCampaignSummary(page);
          campaignDialogStore.closeDialog();
          campaignDialogStore.openSweet();
        })
        .catch(({friendly, message}) => {
          const error = friendly? message: `Unhandled error (${message})`;
          campaignDialogStore.updateSubmitStatus({'submitting': false, 'submit_error': error});
        });
    }
    else {
      campaignApi.post(campaignDialogStore.campaign)
        .then(campaign => {
          // console.log("campaign new...",campaign)
          campaignDialogStore.setCampaign(campaign);
          campaignDialogStore.updateSubmitStatus({'submitting': false, 'submit_error': null});
          const page = this.props.page || 1;
          campaignSummaryPaginationStore.fetchCampaignSummary(page);

          campaignDialogStore.closeDialog();
          campaignDialogStore.openSweet();
        })
        .catch(({friendly, message}) => {
          const error = friendly? message: `Unhandled error (${message})`;
          campaignDialogStore.updateSubmitStatus({'submitting': false, 'submit_error': error});
        });
    };
  }

  render() {
    if(!campaignDialogStore.campaign || !campaignDialogStore.open) {
      return <React.Fragment></React.Fragment>
    };
    const { classes } = this.props;
    const { success } = this.state;
    const { loaded, error } = campaignDialogStore;

    if(!loaded) {
      return <Dialog
        open
        onClose={ () => { campaignDialogStore.closeDialog() } }
        maxWidth='lg'
        className="modelBox"
        fullWidth
      >
        <LinearProgress></LinearProgress>
      </Dialog>
    };
    if(error) {
      return <Dialog
        open
        onClose={ () => { campaignDialogStore.closeDialog() } }
        maxWidth='lg'
        className="modelBox"
        fullWidth
      >
        <p>{ error }</p>
      </Dialog>
    };

    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    const status_list = this.status_list;
    let condition_dict = {};
    let setting_dict = {};
    let safe_page ={};
    let money_page = {};
    let platform_dict = {};
    let other_page = null;
    let on_off_switch = false;
    if(campaignDialogStore.campaign) {
      campaignDialogStore.campaign.conditions.map(({name, content}) => {
        if (name == 'country') {
          content = content;
          condition_dict[name] = content;
        }
        if (name == 'platform') {
          platform_dict[name] = content;
        }
      });
      campaignDialogStore.campaign.settings.map(({name, content}) => {
        setting_dict[name] = content;
        if(setting_dict['on_off'] == 'on'){
          on_off_switch = true
        }
      });
      campaignDialogStore.campaign.publish.map((page, _index) => {
        const name = page['name'];
        if(name == 'safe_page') {
          safe_page = page;
        } else if (name == 'money_page') {
          money_page = page;
        } else if (name == 'other_page') {
          other_page = page;
        };
      });

    }

    let focus_path_index = this.state.focus_path_index;
    if(focus_path_index > campaignDialogStore.campaign.pathes.length - 1) {
      focus_path_index = 0;
    };
    const active_path = campaignDialogStore.campaign.pathes[focus_path_index];

    const customize_campaign_url = (campaignDialogStore.campaign['url'] != money_page['url']);
    // console.log('customize_campaign_url', campaignDialogStore.campaign['url'], money_page['url'], customize_campaign_url);
    // if (money_page['mode'] == 'static_html') {
    //   customize_campaign_url = true;
    // } else {
    //   customize_campaign_url = (money_page['url'] == campaignDialogStore.campaign['url'])
    // };

    return (
      <div>

      <Dialog
        open={ campaignDialogStore.open }
        onClose={ () => { campaignDialogStore.closeDialog() } }
        maxWidth='lg'
        className="modelBox"
        fullWidth
      >
        <Form onSubmit={ this.handleSubmit.bind(this) }>
          <div className="model-main">
          { campaignDialogStore.campaign &&
            <RctCollapsibleCard
              heading={ campaignDialogStore.campaign['name'] || 'Campaign Name' }
            >
              <AppBar position="static" className="tab-top">
                <Tabs
                  value={ this.state.activeIndex }
                  onChange={(e, value) => this.handleChangeTab(e, value)}
                  indicatorColor='primary'
                  textColor='inherit'
                  fullWidth>
                  <Tab classes={{ root: classes.tabText }} label="Cloak"  />
                  <Tab classes={{ root: classes.tabText }} label="Destination" />
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={'x'}
                index={this.state.activeIndex}
                onChangeIndex={(index) => this.handleChangeIndex(index)}>
                <TabContainer className={classes.clearPadding}>
                  <Form className="dialog-body">
                    <FormGroup >
                      <h4 >Switch</h4>
                      <Switch color="secondary" checked={ on_off_switch } onClick={ () => { this.handleSwitchChange(setting_dict['on_off']) } }  />
                      <b>({ setting_dict['on_off'].toUpperCase() })</b>
                    </FormGroup>
                    <FormGroup >
                      <h4>Status</h4>
                      {
                        status_list.map((allowed_status, index) =>{
                          return(
                            <span class="mr-20 status-box"
                              onClick={ () => { this.changeSettings(allowed_status.value) } }
                            >
                              <IconButton className="text-default" key={ `${campaignDialogStore.campaign['id']}-${index}` }>
                                <i className={allowed_status.label} title={allowed_status.value}
                                  style={ allowed_status.value == setting_dict['allowed_status'] ? {'color': 'green'}: {} }
                                  // onClick={ () => { this.changeSettings(allowed_status.value) } }
                                >
                                </i>
                              </IconButton>
                              <b>{allowed_status.value}</b>
                            </span>
                          )
                        })
                      }
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4>Campaign Name</h4>
                      <Input type="text" required name="name" ref={(input) => this.input = input}  placeholder="Campaign name" onChange={ this.handleChange.bind(this) } value={ campaignDialogStore.campaign['name'] } />
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4>Cluster</h4>
                      <Input
                        className="col-sm-12 col-md-12 col-xl-12"
                        type="select"
                        bsSize="sm"
                        name="cluster_ip"
                        required
                        onChange={ this.handleChange.bind(this) }
                      >
                      {
                        campaignDialogStore.campaign.cluster_ip &&
                        <React.Fragment>
                          {
                            campaignDialogStore.cluster.map( cluster_ip => (
                              <option  key={cluster_ip.ip}
                                value={ cluster_ip.ip }
                                selected = { cluster_ip.ip == campaignDialogStore.campaign['cluster_ip'] }
                              >
                                {`${cluster_ip.ip}`} (name:{`${cluster_ip.name}`}, version:{`${cluster_ip.version}`})
                              </option>
                            ))
                          }
                        </React.Fragment>
                      }
                      {
                        !campaignDialogStore.campaign.cluster_ip &&
                        <React.Fragment>
                          <option selected>---Select Cluster---</option>
                          {
                            campaignDialogStore.cluster.map( cluster_ip => (
                              <option  key={cluster_ip.ip}
                                value={ cluster_ip.ip }
                                selected = { cluster_ip.ip == campaignDialogStore.campaign['cluster_ip'] }
                              >
                                {`${cluster_ip.ip}`} (name:{`${cluster_ip.name}`}, version:{`${cluster_ip.version}`})
                              </option>
                            ))
                          }
                        </React.Fragment>
                      }
                      </Input>
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4>Host</h4>
                      <Input type="text" name="host" required  placeholder="Host name" onChange={ this.handleChange.bind(this) } value={ campaignDialogStore.campaign['host'] } />
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12 country-tag">
                      <h4>Country Tag</h4>
                      <Select
                        className={classes.selectBorder}
                        multiple
                        value={ condition_dict['country'] }
                        name="country"
                        required
                        onChange={ this.handleChangeCampaignCountry.bind(this) }
                        input={<MuiInput id="country-tag" />}
                        renderValue={selected => Countries.filter(({value}) => selected.indexOf(parseInt(value)) > -1 ).map(({label}) => label).join(', ') }
                        MenuProps={MenuProps}
                      >
                        {Countries.map(option => (
                          // <MenuItem key={option.value} value={`${option.value}`}>
                          //   {option.label}
                          // </MenuItem>
                          <MenuItem key={`${campaignDialogStore.campaign.id}-${option.value}`} value={parseInt(option.value)}>
                            <Checkbox checked={ condition_dict['country'].indexOf(parseInt(option.value)) > -1} />
                            <ListItemText primary={option.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4>Device Type</h4>
                      {<RadioGroup row className={classes.group} value={ platform_dict['platform'] || 'any' }
                        name="platform"
                        onChange={ (evt) => this.handleChangeRadio('platform', evt.target.value) }
                      >
                        <FormControlLabel value="any" control={<Radio color="secondary" />} label="All" />
                        <FormControlLabel value="pc" control={<Radio color="secondary" />} label="PC" />
                        <FormControlLabel value="mobile" control={<Radio color="secondary" />} label="Mobile" />
                      </RadioGroup>}
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4>Safepage Mode</h4>
                        <Input
                          type="select"
                          required
                          className="fs-24"
                          name="safe_page_mode"
                          onChange={ (evt) => {
                            this.handleChangePublish('safe_page', 'mode', evt.target.value);
                          }}
                          value={ safe_page['mode'] }
                          bsSize="sm"
                        >
                          <option value="static_html">Static HTML</option>
                          <option value="reverse_proxy">WordPress</option>
                        </Input>
                    </FormGroup>
                    { safe_page['mode'] == 'static_html' &&
                      <React.Fragment>
                        <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                          <h4>Safepage File</h4>
                          <Input type="text" required name="safe_page_value" placeholder=".html"
                            onChange={ (evt) => {
                              this.handleChangePublish('safe_page', 'path', evt.target.value)
                            }}
                            value={ safe_page['path'] }
                          />
                        </FormGroup>
                      </React.Fragment>
                    }
                    { safe_page['mode'] == 'reverse_proxy' &&
                      <React.Fragment>
                        <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                          <h4>Safepage Entrance Point</h4>
                          <Input type="text" required name="safe_page_value" placeholder=".http://"
                            onChange={ (evt) => {
                              this.handleChangePublish('safe_page', 'url', evt.target.value)
                            }}
                            value={ safe_page['url'] }
                          />
                        </FormGroup>
                      </React.Fragment>
                    }
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4>Moneypage Mode</h4>
                      {/* <Input type="text" name="money_page_mode"  placeholder="Safepage Mode"
                        onChange={ (evt) => {
                          this.handleChangePublish('money_page', 'mode', evt.target.value);
                        }}
                        value={ money_page['mode'] }
                      />     */}
                      <Input
                        type="select"
                        required
                        className="fs-24"
                        name="money_page_mode"
                        onChange={ (evt) => {
                          this.handleChangePublish('money_page', 'mode', evt.target.value);
                        }}
                        value={ money_page['mode'] }
                        bsSize="sm"
                        >
                        <option value="direct_link">URL</option>
                      </Input>
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <h4 component="legend">Moneypage Render Method</h4>
                      <RadioGroup row className={classes.group} value={ money_page['render'] || 'direct_iframe' }
                        name="render"
                        onChange={ (evt) => this.handleChangeRender('render', evt.target.value) }
                      >
                        <FormControlLabel value="direct_iframe" control={<Radio color="secondary" />} label="Direct iframe (fast)" />
                        <FormControlLabel value="remote_js_obfs_iframe" control={<Radio color="secondary" />} label="Remote JS obfs iframe (slow but secure)" />
                        <FormControlLabel value="302" control={<Radio color="secondary" />} label="302 redirect (fast but will lead to url change)" />
                      </RadioGroup>
                    </FormGroup>
                    <FormGroup>
                      <h4>Campaign Url / Moneypage URL (track)</h4>
                      <Switch color="secondary" checked={ customize_campaign_url } onClick={ () => { this.handleCampaignUrlChange(!customize_campaign_url) } }  />
                      <span class="fontSize-12">Customize Moneypage URL</span>
                      {
                        !customize_campaign_url &&
                        <React.Fragment>
                          <p className={classes.dialogtext}>{campaignDialogStore.campaign['url'] || 'http://...'}</p>
                        </React.Fragment>
                      }
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      {/* <h4>Moneypage URL (track)</h4> */}
                      {/* {!customize_campaign_url &&
                        <React.Fragment>
                          <p className={classes.dialogtext}>{campaignDialogStore.campaign['url'] || 'http://...'}</p>
                        </React.Fragment>
                      } */}
                      {customize_campaign_url &&
                      <React.Fragment>
                        <Input type="text" required name="money_page_url"  placeholder="http://..."
                          onChange={ (evt) => {
                            safe_page['mode'] == 'reverse_proxy' ?
                            this.handleChangePublish('money_page', 'url', evt.target.value) :
                            this.handleChangePublish('money_page', 'path', evt.target.value)
                          }}
                          value={ safe_page['mode'] == 'reverse_proxy' ? money_page['url'] : money_page['path'] }
                        />
                      </React.Fragment>
                      }
                    </FormGroup>
                    { other_page &&
                      <React.Fragment>
                        <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                          <h4>Unrelated Page/File Mode</h4>
                          {/* <Input type="text" name="other_page_mode"  placeholder="Unrelated page/file mode"
                            onChange={ (evt) => {
                              this.handleChangePublish('other_page', 'mode', evt.target.value);
                            }}
                            value={ other_page['mode'] }
                          />                   */}
                          <Input
                            type="select"
                            required
                            className="fs-24"
                            name="other_page_mode"
                            onChange={ (evt) => {
                              this.handleChangePublish('other_page', 'mode', evt.target.value);
                            }}
                            value={ other_page['mode'] }
                            bsSize="sm"
                            >
                            <option value="static_file">Static HTML</option>
                          </Input>
                        </FormGroup>
                        <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                          <h4>Unrelated Page/File Root</h4>
                          <Input type="text" required name="other_page_url"  placeholder="/home/wwwroot/${host}"
                            onChange={ (evt) => {
                              this.handleChangePublish('other_page', 'root', evt.target.value);
                            }}
                            value={ other_page['root'] }
                          />
                        </FormGroup>
                      </React.Fragment>
                    }
                  </Form>
                </TabContainer>
                <TabContainer className="paths_box" >
                  <Card className={classes.clearPadding} className="card-scroll col-sm-12 col-md-12 col-xl-6 dialog-body float-left clear-border paths_box">
                    <FormGroup className="path_body_left">
                      <Alert color="secondary" className="path-title">
                        <h4 class="inline-block">Path</h4>
                        <MatButton variant="raised"
                          onClick={ this.addPath.bind(this) }
                          className="text-primary btn-icon add-path-btn">
                          <i className="zmdi zmdi-plus"></i>
                          <span>Add Path</span>
                        </MatButton>
                      </Alert>
                      <List>
                      {
                        campaignDialogStore.campaign.pathes.map((path, index) => {
                          return (
                            <PathWeight
                              key={ `${campaignDialogStore.campaign.id}-${path.id || path._key_id}-${index}` }
                              name={ path.name }
                              weight={ path.weight }
                              editing={ path._new }
                              highlight={ index == focus_path_index }
                              onComfirm={ ({name, weight}) => { campaignDialogStore.updateCampaignPath(index, {'name': name, 'weight': weight, '_new': undefined, '_key_id': undefined}) } }
                              onCancel={ () => { this.onCancelPath(index) } }
                              onFocus={ () => { this.onFocusPath(index) } }
                              onDelete={ () => { console.log(`delete path ${path.id}`); campaignDialogStore.deleteCampaignPath(index); } }
                            >
                            </PathWeight>
                          );
                          // if(el.name) {
                          //   return (
                          //     <ListItem button className="pathName" key={ `${el.id}-${index}` }>
                          //       <Input type="text" className="col-sm-12 col-md-12 col-xl-10" value={ el.name } />
                          //       <Input type="text" className="col-sm-12 col-md-12 col-xl-2 text-right" value={ `${el.weight}` } />
                          //     </ListItem>
                          //   );
                          // };
                          // return (
                          //   <form key={ `${el.id}-${index}` } onSubmit={ (evt) => {
                          //     evt.preventDefault();
                          //     const path_name = evt.target['path_name'].value;
                          //     const path_weight = evt.target['path_weight'].value;
                          //     const index_str = evt.target['index'].value;
                          //     const index = parseInt(index_str);
                          //     campaignDialogStore.updatePathAt(index, {name: path_name,weight:path_weight});
                          //   } }>
                          //     <FormGroup className="col-sm-12 col-md-12 col-xl-12" className={classes.clearstyle}>
                          //       <Input type="text" className="col-sm-12 col-md-12 col-xl-10 float-left paths_box"  placeholder="Path Name" name="index" value={ `${index}` } hidden></Input>
                          //       <Input type="text" required="required" className="col-sm-12 col-md-12 col-xl-8 float-left paths_box"  placeholder="Path Name" name="path_name" defaultValue=""></Input>
                          //       <Input type="text" required="required" className="col-sm-12 col-md-12 col-xl-3 float-left paths_box"  placeholder="Path Weight" name="path_weight" defaultValue=""></Input>
                          //       <MatButton type="submit" variant="fab" mini color="primary" className="text-white mr-15"  className={classes.defaulcheck}>
                          //         <i className="zmdi zmdi-check"></i>
                          //       </MatButton>
                          //     </FormGroup>
                          //   </form>
                          // )
                        // <Input type="text" name="path_name" placeholder="Path name" defaultValue={ el.name } />
                        })
                      }
                      </List>
                    </FormGroup>
                  </Card>
                  <Card className={classes.clearPadding} className="card-scroll col-sm-12 col-md-12 col-xl-6 dialog-body float-left clear-border paths_box">
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <Alert color="secondary" className="path-title">
                        <h4 class="inline-block">Offer</h4>
                        <MatButton variant="raised"
                          onClick={ this.addOffer.bind(this) }
                          className="text-primary btn-icon add-path-btn">
                          <i className="zmdi zmdi-plus"></i>
                        <span>Add Offer</span>
                        </MatButton>
                      </Alert>
                      {  active_path && active_path.offers &&
                        active_path.offers.map((offer, path_offer_index) => (
                          <React.Fragment key={ `${active_path.id}-${path_offer_index}` }>
                            <div class="addBox">
                              <Input
                                className="col-sm-8 col-md-8 col-xl-8 float-left paths_box"
                                type="select"
                                bsSize="sm"
                                required
                                onChange={ (evt) => {
                                  this.handleChangeOffer(focus_path_index,path_offer_index,evt.target.value);
                                }}
                              >
                                {
                                  offer.id &&
                                  <React.Fragment>
                                    {
                                      campaignDialogStore.offers.map(({name, id: each_offer_id}, offer_index) => (
                                        <option key={ `${path_offer_index}-${offer_index}` }
                                          value={ each_offer_id }
                                          selected = { offer.id == each_offer_id }
                                        >
                                          { name }
                                        </option>
                                      ))
                                    }
                                  </React.Fragment>
                                }
                                {
                                  !offer.id &&
                                  <React.Fragment>
                                    <option selected>---select offer---</option>
                                    {
                                      campaignDialogStore.offers.map(({name, id: each_offer_id}, offer_index) => (
                                        <option key={ `${path_offer_index}-${offer_index}` }
                                          value={ each_offer_id }
                                          // selected = { offer.id == each_offer_id }
                                        >
                                          { name }
                                        </option>
                                      ))
                                    }
                                  </React.Fragment>
                                }
                              </Input>
                              <Input type="number" name="offer_weight"
                                onChange={ (evt) => {
                                  this.handleChangePathesOffersWeight(focus_path_index, path_offer_index, evt.target.value);
                                }}
                                min="0"
                                step="1"
                                required
                                className="col-sm-2 col-md-2 col-xl-2 float-left paths_box"
                                placeholder="OfferWeight"
                                value={ offer.weight } />
                              <IconButton aria-label="Delete" classes={{ root:classes.pathEditIcon }} onClick={ () => { console.log(`delete offer ${offer.id}`); campaignDialogStore.deleteCampaignOffer(focus_path_index, path_offer_index) } }>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </React.Fragment>
                        ))
                      }
                    </FormGroup>
                    <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                      <Alert color="secondary" className="path-title">
                        <h4 class="inline-block">Lander</h4>
                        <MatButton variant="raised"
                          onClick={ this.addLander.bind(this) }
                          className="text-primary btn-icon add-path-btn">
                          <i className="zmdi zmdi-plus"></i>
                          <span>Add Lander</span>
                        </MatButton>
                      </Alert>
                      {  active_path && active_path.landers &&
                        active_path.landers.map((lander, path_lander_index) => (
                          <React.Fragment key={ `${active_path.id}-${path_lander_index}` }>
                            <div class="addBox">
                              <Input
                                onChange={ (evt) => {
                                  this.handleChangeLander(focus_path_index,path_lander_index,evt.target.value);
                                }}
                                className="col-sm-8 col-md-8 col-xl-8 float-left paths_box"
                                type="select"
                                required
                                bsSize="sm">
                                {
                                  lander.id &&
                                  <React.Fragment>
                                    {
                                      campaignDialogStore.landers.map(({name, id: each_lander_id}, lander_index) => (
                                        <option key={ `${path_lander_index}-${lander_index}` }
                                          value={ each_lander_id }
                                          selected = { lander.id == each_lander_id }>
                                          { name }
                                        </option>
                                      ))
                                    }
                                  </React.Fragment>
                                }
                                 {
                                  !lander.id &&
                                  <React.Fragment>
                                    <option selected>---select lander---</option>
                                    {
                                      campaignDialogStore.landers.map(({name, id: each_lander_id}, lander_index) => (
                                        <option key={ `${path_lander_index}-${lander_index}` }
                                          value={ each_lander_id }
                                          // selected = { lander.id == each_lander_id }
                                        >
                                          { name }
                                        </option>
                                      ))
                                    }
                                  </React.Fragment>
                                }
                              </Input>
                              <Input
                                type="number"
                                name="lander_weight"
                                min="0"
                                step="1"
                                required
                                className="col-sm-2 col-md-2 col-xl-2 float-left paths_box"
                                onChange={ (evt) => {
                                  this.handleChangePathesLandersWeight(focus_path_index, path_lander_index, evt.target.value);
                                }}
                                placeholder="LanderWeight"
                                value={ lander.weight } />
                              <IconButton aria-label="Delete" classes={{ root:classes.pathEditIcon }} onClick={ () => { console.log(`delete lander ${lander.id}`); campaignDialogStore.deleteCampaignLander(focus_path_index, path_lander_index) } }>
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </React.Fragment>
                        ))
                      }
                    </FormGroup>
                  </Card>
                </TabContainer>
              </SwipeableViews>
            </RctCollapsibleCard>
          }
          </div>
          <RctCollapsibleCard colClasses="text-right model-submit">
            {/* <MatButton variant="raised" className="btn-danger text-white mr-10 " onClick={ () => { campaignDialogStore.closeDialog() } }>Cancel</MatButton>
            <MatButton type="submit" variant="raised" color="primary" className="mr-10  text-white" disabled={campaignDialogStore.submitting}>Save</MatButton>
            { campaignDialogStore.submitting && <CircularProgress size={24} className={classes.buttonProgress} /> }                 */}
            <div className={classes.wrapper} class="SubmitProgress">
              <Button
                variant="raised"
                className="btn-secondary text-white mr-10"
                onClick={ () => { campaignDialogStore.closeDialog() } }
              >Cancel</Button>
              <MatButton
                type="submit"
                variant="raised"
                color="primary"
                className="mr-10 text-white"
                className={buttonClassname}
                className={classes.subtransform}
                disabled={campaignDialogStore.submitting}
              >Save</MatButton>
              { campaignDialogStore.submitting && <CircularProgress size={24} className={classes.buttonProgress} /> }
            </div>
          </RctCollapsibleCard>
        </Form>
      </Dialog>
      </div>
    );
  }
}


export default CampaignDialog;
