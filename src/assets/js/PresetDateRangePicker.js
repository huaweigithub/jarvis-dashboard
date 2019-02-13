import React, { Component } from 'react';
import moment from 'moment';
import '../css/PresetDateRangePicker.css';
import 'react-dates/initialize';
import { Media, Badge, Input } from 'reactstrap';
import { DateRangePicker } from 'react-dates';
import utcStore from 'Storage/utcStore';
import 'react-dates/lib/css/_datepicker.css';
import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from 'react-dates';


class PresetDateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment(),
      selectedDate: new Date(),
      focusedInput: START_DATE,
      presets: [
        {
          'text': "Today",
          'start': moment(),
          'end': moment()
        },
        {
          'text': "Yesterday",
          'start': moment().add(-1, 'day'),
          'end': moment().add(-1, 'day')
        },
        {
          'text': "Last 7 Days",
          'start': moment().add(-7, 'day'),
          'end': moment().add(-1, 'day')
        },
        {
          'text': "Last 30 Days",
          'start': moment().add(-30, 'day'),
          'end': moment().add(-1, 'day'),
        },
        {
          'text': "This Month",
          'start': moment().subtract(moment().date(),'day').add(1, 'day'),
          'end': moment().add(1,'month').subtract(moment().date(),'day'),
        },
        {
          'text': "Last Month",
          'start': moment().add({month:-1,day:1}).subtract(moment().date(),'day'),

          // 'start': moment().add(-1,'month').subtract(moment().date(),'day').add(1, 'day'),
          'end': moment().subtract(moment().date(),'day'),
        },
      ],

    };
    // moment().day('Sunday').add(6, 'day')
    // moment().format('YYYY-MM-DD')
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.renderDatePresets = this.renderDatePresets.bind(this);

  }

  onDatesChange({ startDate, endDate }) {
    // console.log('start', startDate);
    // console.log('end', endDate);
    this.setState({ startDate, endDate });
    this.props.onDatesChange && this.props.onDatesChange({startDate: startDate, endDate: endDate});
  }

  onUTCChange(evt){
		evt.preventDefault();
		const value = evt.target.value;
		console.log('data val',value)
		utcStore.ChangeUTC(value)
	}

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  renderDatePresets() {
    // const { presets, styles } = this.props;
    const { presets, styles } = this.state;

    return (
      <div className="PresetDateRangePicker_1fnf6cw">
        {presets.map(({ text, start, end }) => {
          return (
            <button
              key={text}
              type="button"
              className ="PresetDateRangePicker_btn"
              onClick={() => this.onDatesChange({ startDate: start, endDate: end })}
            >
              {text}
            </button>
          );
        })}
      {/* </div> */}
    </div>
    );
  }

  render() {
    console.log('utcStore utc',utcStore.utc)
    return (
      <React.Fragment>
        <Input className="date-utc" type="select" bsSize="sm" onChange={ this.onUTCChange.bind(this)}>
          <option selected = {utcStore.utc=='utc+8' ? true : false} value="utc+8">CN/Beijing</option>
          <option selected = {utcStore.utc=='utc-8' ? true : false} value="utc-8">US/Pacific</option>
        </Input>
        <DateRangePicker
          // defaultDate = {this.state.selectedDate}
          renderCalendarInfo={this.renderDatePresets}
          displayFormat="YYYY-MM-DD "
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={ this.onDatesChange.bind(this) } // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          // selected={this.state.startDate}
          isOutsideRange={() => false}
        />
      </React.Fragment>
    );
  }
}


export default PresetDateRangePicker;