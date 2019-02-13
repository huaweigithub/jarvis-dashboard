import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: 4,
  },
});

function ContainedButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Button  color="primary" variant="extendedFab" className={classes.button}>
        <Icon>edit_icon</Icon>
        Edit
      </Button>
    </div>
  );
}

ContainedButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContainedButtons);
