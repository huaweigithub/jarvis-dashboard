/**
 * Search Form
 */
import React, { Component } from 'react'
import { Input } from 'reactstrap';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import "Assets/css/index.css";


class SearchForm extends Component {
	render() {
		return (
			<div className="search-wrapper">
				<Input
				type="search"
				className="search-input-lg"
				placeholder="Search.."
				onChange={() => console.log('onChange')}
				/>
			</div>
		)
	}
}


export default SearchForm;
