import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import backImg from '../earth.gif';

const styles = theme => ({

});

class NavBar extends Component{
  constructor(props){
    super(props);
  }

  render(){

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar style={{opacity:1,backgroundImage: `url(${backImg})`}}>
            <Typography variant="h6" color="inherit" noWrap>
              <a href="/" style={{textDecoration:"none", color:"inherit"}}> Choropleth App </a>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
