import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import backImg from '../img1.jpg';

const styles = theme => ({

  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  grow: {
    flexGrow: 1,
  },

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
              <strong><a href="/" style={{textDecoration:"none", color:"inherit"}}>Choropleth App </a></strong>
            </Typography>
              <div className={classes.grow} />
              <div style={{paddingRight:'4%'}} className={classes.sectionDesktop}>
                <strong><a style={{fontSize: "13px"}}>Siva Kumar Reddy Vayyeti</a></strong>
              </div>
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
