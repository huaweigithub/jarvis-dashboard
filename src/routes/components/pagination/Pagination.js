import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import MatButton from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import {
  Input,
} from 'reactstrap';


const activeBtn = {
  // backgroundColor:"rgba(0, 0, 0, 0.08)"
  colors:"red"
}


const styles = theme => ({
  pageBtn:{
    padding:'4px'
  }
})

@withStyles(styles)
class Pagination extends Component{
  constructor(props) {
    super(props);
    this.state = {
      // current: this.props.current, //当前页码
      display_range: this.props.display_range || 5,
      auto_left: this.props.auto_left,
      auto_right: this.props.auto_right,
    };
    this.goToPage = this.goToPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  goToPage(num) {
    console.log('pagination goes to page', num);
    this.props.goToPage(num);  // parent call
  }

  handleChange(evt) {
    evt.preventDefault();  
    let value =parseInt(evt.target.value); 

    this.props.handleChange(value)
   
  
    // offerPageStore.current_page = value;
    // offerPageStore.fetchOfferStats(value);    
  };

  renderPageNumber(page_number, current, page_display, this_disabled, key) {
    const { classes } = this.props;

    if(page_number == '...') {      
      return <span className={ classes.disabledText }>...</span>;
    };

    if(this_disabled === undefined) {
      this_disabled = (page_number == current);
    };
      
    return (
      <IconButton
        key={ key }
        variant="raised"
        size='small'
        mini='true'
        classes={{ root:classes.pageBtn }}
        onClick={ (evt) => {
          evt.preventDefault();
          if(!this_disabled) {
            this.goToPage(page_number);
          };
        }}
        disabled = { page_number == current ? true : false }
        // style = { page_number == current ? { 'background' : 'rgba(0, 0, 0, 0.08)' } : null }
        className="text-default pagecurrent-btn"
        // className="btn-secondary mr-10 mb-10 text-white btn-icon"
      >
        {/* <i className="zmdi zmdi-mail-send">
          { page_display || page_number }
        </i> */}

        { page_display || page_number }
      </IconButton>
    );
  }

  render() {
    let current = this.props.current;   
    let display_range = this.state.display_range;
    let total = this.props.total;


    let display_left_right = Math.trunc(display_range / 2);

    let page_numbers = [];
    let start_page_number = 1;
    let left_omit = false;
    if(current - 1 > display_left_right) {
      start_page_number = current - display_left_right;
      left_omit = true;
    };

    let end_page_num = current + display_left_right;
    let right_omit = true;
    if(end_page_num > total - 1) {
      end_page_num = total;
      right_omit = false;
    };

    for(var page_number = start_page_number; page_number <= end_page_num; page_number++)
    {
      page_numbers.push(page_number);
    };

    console.log('page numbers:', page_numbers);

    const {auto_left, auto_right} = this.state;

    return (
      <React.Fragment>

        {/* <span class="pagecurrent-txt"> Page 
          <Input 
          className="page-select" 
          value={ current }
          onChange={ this.handleChange }
          onChange={ (evt) => { this.goToPage(parseInt(evt.target.value)) } }
          onBlur={ (evt) => { this.goToPage(parseInt(evt.target.value)) } }
        /> of { total }</span> */}

        <span class="pagecurrent-txt"> Page { current } of { total }</span>

        { auto_left && current == 1 || this.renderPageNumber(1, current, <FirstPageIcon />, current == 1) }
        { auto_left && current == 1 || this.renderPageNumber(current == 1? 1: current - 1, current, <ChevronLeftIcon />, current == 1) }

        { left_omit && '...' }

        {page_numbers.map((page_number) => {
          return(
            <span class="page-number" style = { page_number == current ? {'display':'inline-block','borderRadius':'50%','background' : 'rgba(0, 0, 0, 0.08)' } : null }>
              {this.renderPageNumber(page_number, current, undefined, undefined, page_number)}
            </span>
          )      
        })}

        { right_omit && '...' }

        { auto_right && current == total || this.renderPageNumber(current == total ? total : current + 1, current, <ChevronRightIcon />, current == total) }
        { auto_right && current == total || this.renderPageNumber(total, current, <LastPageIcon />, current == total) }

      </React.Fragment>
    );
  }
}

export default Pagination
