import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
// import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';


const styles = theme => ({
  activeIcon: {
    color: 'green',
  }

})


@withStyles(styles)
class StatusListSimple extends Component {

  constructor(props) {
    super(props);
    this.state = {
      switching_to: null
    };

    this.status_list = [
      {
        value:"block_all",
        iconClasses:["zmdi", "zmdi-pause-circle", "zmd-fw"]
      },
      {
        value:"active",
        iconClasses:["zmdi", "zmdi-play-circle", "zmd-fw"]
      },
      {
        value:"allow_all",
        iconClasses:["zmdi", "zmdi-dot-circle", "zmd-fw"]
      },
      {
        value:"under_review",
        iconClasses:["zmdi", "zmdi-search-in-page", "zmd-fw"]
      }
    ]

  }

  clickIcon(value) {
    console.log(`change to ${value}`);
    this.setState({
      switching_to: value
    });
    this.props.switchStatus(value);
  }

  render() {
    const { classes } = this.props;

    const need_disabled_group = this.state.switching_to && this.state.switching_to != this.props.currentAllowedStatus;
    return (
      <Fragment>
      {
        this.status_list.map((allowed_status, index) => (
          <IconButton title={ allowed_status.value } disabled={ need_disabled_group } key={ index } onClick={ () => { this.clickIcon(allowed_status.value) } }>
            {
              (need_disabled_group && this.state.switching_to == allowed_status.value)
                ? <i className="zmdi zmdi-spinner zmd-fw zmdi-hc-spin" />
                : <i
                    className={ classNames({
                      [classes.activeIcon]: allowed_status.value == this.props.currentAllowedStatus
                    }, ...allowed_status.iconClasses) }
                  />
            }
          </IconButton>
        ))
      }
      </Fragment>
    );
  }

}


export default StatusListSimple;
