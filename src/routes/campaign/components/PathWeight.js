import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import MatButton from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
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

const style = theme => ({
  // firstActionBtn: {
  //   marginRight: theme.spacing.unit / 4,
  //   position: 'absolute',
  // }   
  pathEditIcon:{
    'padding':'10px'
  },
  onComfirm:{
    'right':'7px'
  },
  rowBox:{
    "paddingRight":0
  },
  inputLeft:{
    'flex': '0 0 66.66667%'
  }
});


@withStyles(style)
class PathWeight extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name || '',
      weight: this.props.weight || 100,
      editing: this.props.editing,
      disabled: true,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onComfirm = this.onComfirm.bind(this);
    this.onToEdit = this.onToEdit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onFieldChange(evt) {
    let { name, value } = evt.target;
    if(name == 'weight') {
      value = parseInt(value);
    };

    if(value!==''){
      this.setState({disabled : false})
    }else{
      this.setState({disabled : true})
    }

    this.setState({
      [name]: value,     
    });
    this.props.onFocus && this.props.onFocus();
  }

  onComfirm(_evt) { 
    this.setState({editing: false});
    this.props.onComfirm && this.props.onComfirm({
      name: this.state.name,
      weight: this.state.weight,
    });
    this.props.onFocus && this.props.onFocus();
  }

  onToEdit(_evt) {  
    this.setState({
      editing: true,
      disabled : false
    });
    this.props.onFocus && this.props.onFocus();
  }

  onCancel(_evt) {
    this.setState({editing: false});
    this.props.onCancel && this.props.onCancel();
  }

  render() {

    const { classes } = this.props;

    return (
      <React.Fragment>
        {
          this.state.editing
            ? <ListItem className="row rowBox" key={ `${this.state.editing}` }>             
                <Input 
                  className="col-sm-8 col-md-8 col-xl-8 mr-15 inputLeft"
                  required  
                  name="name" 
                  defaultValue="Path Name" 
                  value={ this.state.name } 
                  onChange={ this.onFieldChange } 
                  placeholder="Path Name"></Input>
                <Input 
                  className="col-sm-2 col-md-2 col-xl-2 mr-15 inputRight"  
                  name="weight" 
                  type="number" 
                  min="0" 
                  step="1" 
                  required
                  value={ this.state.weight } 
                  onChange={ this.onFieldChange } 
                  placeholder="Path Weight"></Input>                   
                <ListItemSecondaryAction classes={{ root:classes.onComfirm }}>
                  <MatButton 
                    variant="fab" mini 
                    color="primary" 
                    disabled={ this.state.disabled } 
                    style={ this.state.disabled ? {'background': 'rgba(0, 0, 0, 0.26)'} : {'background': '#00D014 linear-gradient(180deg, #25d637, #00D014) repeat-x'} } 
                    className="btn-success text-white mr-5" onClick={ this.onComfirm }>
                    <i className="zmdi zmdi-check"></i>
                  </MatButton>
                  <MatButton variant="fab" mini color="primary" className="btn-danger text-white" onClick={ this.onCancel }>
                    <i className="zmdi zmdi-close"></i>
                  </MatButton>                                
                </ListItemSecondaryAction>
              </ListItem>
            : <ListItem button selected={ this.props.highlight } onClick={ () => { this.props.onFocus && this.props.onFocus() } }>
                <ListItemText className="pathNameSize" primary={ `${ this.props.name }  --  ${ this.props.weight }` }>
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Edit" classes={{ root:classes.pathEditIcon }} onClick={ this.onToEdit }>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="Delete" classes={{ root:classes.pathEditIcon }} onClick={ this.props.onDelete }>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
        }
      </React.Fragment>
    );
  }

}

export default PathWeight;
