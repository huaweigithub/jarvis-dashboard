/**
 * About Us Page
 */
import React, { Component,Fragment } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MatButton from '@material-ui/core/Button';
import { Media, Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
// import TestimonialSlider from './components/testimonial-slider';
// import Clientslider from './components/client-slider';

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

import DatePicker from 'Assets/js/PresetDateRangePicker';

class CompaignStats extends Component {

	constructor(props) {
    super(props);
    this.state = {
      data: []
    };
	}


	render() {
		const {data} = this.state;

		console.log(data)

		return (
      <RctAppLayout>
				<div className="about-wrapper">
					<Helmet>
						<title>Reactify | Campaign</title>
						<meta name="description" content="Reactify About Us Page" />
					</Helmet>
					<PageTitleBar title={<IntlMessages id="Campaign" />} match={this.props.match} />
					<div className="about-detail">
						<RctCard>
							<div className="row no-gutters row-eq-height align-items-center">
								<DatePicker></DatePicker>
								<MatButton variant="raised" color="primary" className="text-white">Apply</MatButton>
							</div>
						</RctCard>
						<RctCollapsibleCard heading="Basic Table" fullBlock>
							<div className="table-responsive">
								<Table>
									<TableHead>
                      <TableRow hover>
                        <TableCell className="text-center">Result</TableCell>
                        <TableCell className="text-center">Condition Result</TableCell>
                        <TableCell className="text-center">FF Result</TableCell>
                        <TableCell className="text-center">JC Result</TableCell>
                        <TableCell className="text-center">Host</TableCell>
                        <TableCell className="text-center">Status</TableCell>
                        <TableCell className="text-center">Time</TableCell>
                        <TableCell className="text-center">IP</TableCell>
                        <TableCell className="text-center">UA</TableCell>
                        <TableCell className="text-center">Referer</TableCell>
                      </TableRow>
										</TableHead>
									<TableBody>
										<Fragment>
											<TableRow hover >
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
												<TableCell numeric className="text-center"></TableCell>
											</TableRow>
										</Fragment>
									</TableBody>
								</Table>
							</div>
						</RctCollapsibleCard>
					</div>
				</div>
      </RctAppLayout>
		);
	}
}


export default CompaignStats;