import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import SweetAlert from 'react-bootstrap-sweetalert';
import MatButton from '@material-ui/core/Button';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  FormFeedback
} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

import { observer } from 'mobx-react';

import offerModelStore from 'Storage/offerModelStore';
import offerApi from 'Api/offerApi';
import Countries from 'Constants/countries';
import offerPageStore from 'Storage/offerPageStore';
import campaignDialogStore from 'Storage/campaignDialogStore';



function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    width:'80%',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  subtransform:{
    textTransform:"initial",
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    right: '52px',
    marginTop: -12,
    marginLeft: -12,
  },
  selectBorder:{
    margin:0,
    display: 'block',
    width: '100%',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    lineHeight: 1.5,
    color: '#464D69',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #EBEDF2',
    borderRadius: '0.25rem',
    boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    boxSizing: 'inherit',
  }
});


@withStyles(styles)
@observer
class OfferModal extends React.Component {

  constructor(props) {
    super(props);
    // const country = this.props.current_offer.country.toString();
    // console.log(this.props.current_offer.country)
    this.state = {
      // loading: false,
      // success: false,
      // submitting: false,
      // error: null,
      // open: false,
      // // country:country
      selected : false
    }
  }

  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  // }

  // handleOpen = () => {
  //   // this.setState({
  //   //   open: true,
  //   //  });
  //   // offerPageStore.updateDialog({'open': true})
  //   offerModelStore.
  // };

  handleClose() {
    if(offerModelStore.submitting) {
      offerModelStore.updateSubmitStatus({'submit_error': 'Please wait for submitting to finish'})
      return;
    };
    offerModelStore.closeModal();
  };

  handleChange(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    if(name == 'country') {
      value = parseInt(value);
    }
    offerModelStore.updateOfferField(name, value);
  };

  handleSubmit(evt) {
    evt.preventDefault();
    if (offerModelStore.submitting) {
      offerModelStore.updateSubmitStatus({'submit_error': 'Please wait for previous submitting to finish'})
      return;
    };

    if(offerModelStore.offer.id) {
      const {id: offer_id} = offerModelStore.offer;
      offerModelStore.updateSubmitStatus({'submitting': true, 'submit_error': null})

      offerApi.patch(offer_id, offerModelStore.offer)
        .then(offer => {
          offerModelStore.setOffer(offer);
          offerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': null});
          const page = this.props.page || 1;
          offerPageStore.fetchOfferStats(page);
          offerModelStore.closeModal();
          offerModelStore.openSweet();
        })
        .catch(({friendly, message}) => {
          const error = friendly? message: `Unhandled error (${message})`;
          offerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': error});
        });
    } else {
      offerApi.post(offerModelStore.offer)
        .then(offer => {
          offerModelStore.setOffer(offer);
          offerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': null});
          const page = this.props.page || 1;
          offerPageStore.fetchOfferStats(page);
          offerModelStore.closeModal();
          offerModelStore.openSweet();
          campaignDialogStore.initLoadOffers(false);
        })
        .catch(({friendly, message}) => {
          const error = friendly? message: `Unhandled error (${message})`;
          offerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': error});
        });
    };
  }


  render() {
    const { classes } = this.props;
    console.log('offerModelStore.offer ---->',offerModelStore.offer)
    console.log(' this.props --->', this.props)
    const { loading, success } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={ offerModelStore.open }
          onClose={ this.handleClose }
          className="modelBox"
        >
          <div style={getModalStyle()} className={classes.paper} className="modal-body">
          { offerModelStore.offer &&
            <RctCollapsibleCard  heading={ offerModelStore.offer['name'] || 'Offer Name' }>
              <Form onSubmit={ this.handleSubmit.bind(this) } className="modal-form">
                <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                  <h4>Offer Name</h4>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Offer Name"
                    value={ offerModelStore.offer['name'] }
                    onChange={ this.handleChange.bind(this) }
                    required
                  />
                </FormGroup>
                <FormGroup className="col-sm-12 col-md-12 col-xl-12 country-tag">
                  <h4>Country Tag</h4>
                  {/* <TextField
                    className={classes.selectBorder}
                    select
                    name="country"
                    value={ `${offerModelStore.offer['country'] }`}  // we need string here
                    onChange={ this.handleChange.bind(this) }
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    margin="normal"
                    fullWidth
                    required
                  >
                  {
                    Countries.map(({value, label}) => (
                      <MenuItem key={ value } value={ value }>
                        { label }
                      </MenuItem>
                    ))
                  }
                  </TextField> */}
                  {
                  offerModelStore.offer['country'] &&
                  <React.Fragment>
                    <Input
                      className="col-sm-12 col-md-12 col-xl-12"
                      type="select"
                      bsSize="sm"
                      name="country"
                      onChange={ this.handleChange.bind(this) }
                    >
                      {
                        Countries.map( ({value, label}) => (
                          <option  key={value}
                            value={ value }
                            selected = { value == offerModelStore.offer['country'] }
                          >
                            { label }
                          </option>
                        ))
                      }
                    </Input>
                  </React.Fragment>
                }
                {
                  !offerModelStore.offer['country'] &&
                  <React.Fragment>
                    <Input
                      className="col-sm-12 col-md-12 col-xl-12"
                      type="select"
                      bsSize="sm"
                      name="country"
                      onChange={ this.handleChange.bind(this) }
                    >
                      <option>---Select Country---</option>
                      {
                        Countries.map( ({value, label}) => (
                          <option  key={value}
                            value={ value }
                          >
                            { label }
                          </option>
                        ))
                      }
                    </Input>
                  </React.Fragment>
                }
                </FormGroup>
                <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                  <h4>Offer Url</h4>
                  <Input type="text" name="url"  placeholder="Offer Url" value={ offerModelStore.offer['url'] } onChange={ this.handleChange.bind(this) } required />
                </FormGroup>
                <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                  <h4>Offer Payout</h4>
                  <Input type="number" min="0.0" step="0.01" name="payout"  placeholder="Offer Payout" value={ offerModelStore.offer['payout'] } onChange={ this.handleChange.bind(this) } required />
                </FormGroup>

                {
                  offerModelStore.submit_error && <p>{ offerModelStore.submit_error  }</p>
                }

                <div className={classes.wrapper} class="SubmitProgress">
                  <Button
                    variant="raised"
                    className="btn-secondary text-white mr-10"
                    onClick={ this.handleClose.bind(this) }>Cancel</Button>
                  <MatButton
                    type="submit"
                    variant="raised"
                    color="primary"
                    className="mr-10 text-white"
                    className={buttonClassname}
                    className={classes.subtransform}
                    disabled={offerModelStore.submitting}>Save</MatButton>
                  { offerModelStore.submitting && <CircularProgress size={24} className={classes.buttonProgress} /> }
                </div>
              </Form>
            </RctCollapsibleCard>
            }
          </div>
        </Modal>
      </div>
    );
  }
}


export default OfferModal;
