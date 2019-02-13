import React, { Component, Fragment } from 'react';
import { Form,Input } from 'reactstrap';

class SerachInput extends Component{
  constructor(props){
    super(props);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }

  handleChangeSearch(evt){
    const vaule = evt.target.value;
    this.props.handleChangeSearch(vaule)
    console.log('vaule',vaule)
  }

  render(){
    return(
      <Input
        type="search"
        className="search-input-lg"
        placeholder="Search.."
        onChange={this.handleChangeSearch}
        />
    )
  }
}

export default SerachInput