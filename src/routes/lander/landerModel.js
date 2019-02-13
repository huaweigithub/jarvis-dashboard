import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import { UniversalStyle as Style } from 'react-css-component';
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

import landerModelStore from 'Storage/landerModelStore';
import landerApi from 'Api/landerApi';
import Countries from 'Constants/countries';
import landerPageStore from 'Storage/landerPageStore';
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
  ProgressBtn:{
    top:"50%",
    left:"50%"
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
class LanderModal extends React.Component {

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
      selected : false,
      // successSub: false,
    }
  }

  componentWillUnmount() {
    // console.log('landerModelStore.lander===',landerModelStore.lander)
  }

  // handleOpen = () => {
  //   // this.setState({
  //   //   open: true,
  //   //  });
  //   // offerPageStore.updateDialog({'open': true})
  //   landerModelStore.
  // };

  handleClose() {
    if(landerModelStore.submitting) {
      landerModelStore.updateSubmitStatus({'submit_error': 'Please wait for submitting to finish'})
      return;
    };
    landerModelStore.closeModal();
  };


  // onConfirm(key) {
	// 	this.setState({ [key]: false })
	// }

  // openAlert(key) {
	// 	this.setState({ [key]: true });
  // }

  // onCancel(key) {
	// 	this.setState({ [key]: false })
	// }

  handleChange(evt) {
    evt.preventDefault();
    const { name } = evt.target;
    let value = evt.target.value;
    if(name == 'country') {
      value = parseInt(value);
    }
    landerModelStore.updateLanderField(name, value);
  };

  handleSubmit(evt) {
    evt.preventDefault();
    if (landerModelStore.submitting) {
      landerModelStore.updateSubmitStatus({'submit_error': 'Please wait for previous submitting to finish'})
      return;
    };

    if(landerModelStore.lander.id) {
      const {id: lander_id} = landerModelStore.lander;
      landerModelStore.updateSubmitStatus({'submitting': true, 'submit_error': null})

      landerApi.patch(lander_id, landerModelStore.lander)
        .then(lander => {
          landerModelStore.setLander(lander);
          landerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': null});
          const page = this.props.page || 1;
          landerPageStore.fetchLanderStats(page);
          landerModelStore.closeModal();
          landerModelStore.openSweet();
        })
        .catch(({friendly, message}) => {
          const error = friendly? message: `Unhandled error (${message})`;
          landerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': error});
        });
    } else {
      landerApi.post(landerModelStore.lander)
        .then(lander => {
          landerModelStore.setLander(lander);
          landerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': null});
          const page = this.props.page || 1;
          landerPageStore.fetchLanderStats(page);
          landerModelStore.closeModal();
          landerModelStore.openSweet();
          campaignDialogStore.initLoadLanders(false);

        })
        .catch(({friendly, message}) => {
          const error = friendly? message: `Unhandled error (${message})`;
          landerModelStore.updateSubmitStatus({'submitting': false, 'submit_error': error});
        });
    };
  }


  render() {
    const { classes } = this.props;
    const { loading, success, selected  } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    let lightbox_css = `
      .root {
        top: 50%;
        left:50%
      }`;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={ landerModelStore.open }
          onClose={ this.handleClose }
          className="modelBox"
        >
          <div style={getModalStyle()} className={classes.paper} className="modal-body">
            { landerModelStore.lander &&
            <RctCollapsibleCard heading={ landerModelStore.lander['name'] || "Lander Form" } className={classes.modelHeader}>
              <Form onSubmit={this.handleSubmit.bind(this)} className="modal-form">
                <FormGroup className="col-sm-12 col-md-12 col-xl-12">
                  <h4>Lander Name</h4>
                  <Input
                      type="text"
                      name="name"
                      placeholder="Lander Name"
                      value={ landerModelStore.lander['name'] }
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
                    value={ `${landerModelStore.lander['country'] }`}  // we need string here
                    onChange={ this.handleChange.bind(this) }
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    // helperText="Please select your country"
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
                  landerModelStore.lander['country'] &&
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
                            selected = { value == landerModelStore.lander['country'] }
                          >
                            { label }
                          </option>
                        ))
                      }
                    </Input>
                  </React.Fragment>
                }
                {
                  !landerModelStore.lander['country'] &&
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
                  <h4>Lander Url</h4>
                  <Input type="text" name="url"  placeholder="Lander Url" value={ landerModelStore.lander['url'] } onChange={ this.handleChange.bind(this) } required />
                </FormGroup>
                {
                  landerModelStore.submit_error && <p>{ landerModelStore.submit_error  }</p>
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
                    disabled={landerModelStore.submitting}>Save</MatButton>
                  { landerModelStore.submitting && <CircularProgress size={24}  className={classes.buttonProgress} /> }
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


export default LanderModal;
