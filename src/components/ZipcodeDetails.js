import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '3%',
    paddingLeft:'12%',
    paddingRight:'12%',
    opacity:'0.9'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  description: {
    marginBottom:'10px',
  },
});

class ZipcodeDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: "geography_pannel",
      data: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  getFareinheitFromKelvin(kelvinTemp){
    let farnheitTemp = kelvinTemp - 273.15;
    farnheitTemp = farnheitTemp * (9/5);
    farnheitTemp = farnheitTemp + 32;
    return farnheitTemp;
  }

  updateData(result) {
    let data = result.data;
    for(let i=0; i<data.length; i++) {
      if(data[i].zip === this.props.zipcode){
        this.setState({data: data[i]});
      }
    }
  }

  parseCSVFile(){
    let csvFilePath = require(`../Data/${this.props.city}/ZipData.csv`);
    Papa.parse(csvFilePath, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.updateData
    });
  }

  fetchGetAPI(APIUrl){
    fetch(APIUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .then(data => {
        if(typeof data !== "undefined"){
          if (data.cod === 200){
            this.setState({weather: data});
          }
        }
      });
  }

  getTime(epoch){
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    let time = d.toString().split(' ')[4];
    return time + ' EST';
  }

  componentDidUpdate() {
    const zipcode = this.props.zipcode;
    if (typeof this.state.data === "undefined"){
      this.parseCSVFile();
    }
    const APIKey = "262f7fa1cd6e8265260d400984d8daab";
    const APIUrl = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${APIKey}`;
    if(typeof this.state.weather === "undefined"){
      this.fetchGetAPI(APIUrl);
    }
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    const { weather } = this.state;

    return (
      <div className={classes.root}>
        <div style={{paddingTop:'10%'}}>
          <ExpansionPanel expanded={expanded === 'geography_pannel'} onChange={this.handleChange('geography_pannel')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.heading}>
                <img alt="compass" src="/images/compass.png" style={{height:'50px', width:'50px', float:'left'}}/>
                <div>
                  <p>&nbsp; Geography Details</p>
                </div>
              </div>
              <Typography className={classes.secondaryHeading}>Expand Panel to know about lat, lng details</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <div className={classes.description}>
                  <Typography>
                    <b>Latitude: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.lat}<sup>o</sup> N
                    <b>&emsp;  Longitude: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.lng}<sup>o</sup> W
                  </Typography>
                </div>
                <div className={classes.description}>
                  <Typography>
                    <b>Time-Zone: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.timezone.split("_").join(" ")}
                  </Typography>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'population_pannel'} onChange={this.handleChange('population_pannel')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.heading}>
              <img alt="census" src="/images/census.png" style={{height:'50px', width:'50px', float:'left'}}/>
              <div>
                <p>&nbsp; Population Census</p>
              </div>
            </div>
              <Typography className={classes.secondaryHeading}>
                Expand to view population & density
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <div className={classes.description}>
                  <Typography>
                    <b>Total Population: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.population}
                    <b>&emsp;  Population Density: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.density} Per Sq. Mi
                  </Typography>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'state_pannel'} onChange={this.handleChange('state_pannel')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.heading}>
              <img alt="location" src="/images/location.png" style={{height:'50px', width:'50px', float:'left'}}/>
              <div>
                <p>&nbsp; State Details</p>
              </div>
            </div>
              <Typography className={classes.secondaryHeading}>
                Expand to view County, City, State, & State Code
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <div className={classes.description}>
                  <Typography>
                    <b>County: </b>  {typeof this.state.data === "undefined" ? "undefined" : this.state.data.county_name}
                    <b>&emsp;  City: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.city}
                  </Typography>
                </div>
                <div className={classes.description}>
                  <Typography>
                    <b>State: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.state_name}
                    <b>&emsp;  State ID: </b>  {typeof this.state.data === "undefined" ? "undefined" :this.state.data.state_id}
                  </Typography>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'weather_pannel'} onChange={this.handleChange('weather_pannel')}>
            <ExpansionPanelSummary style={{backgroundColor:"light-blue"}} expandIcon={<ExpandMoreIcon />}>
            <div className={classes.heading}>
              <img alt="weather" src="/images/weather.png" style={{height:'50px', width:'50px', float:'left'}}/>
              <div>
                <p>&nbsp; Weather Details</p>
              </div>
            </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <div className={classes.description}>
                  <Typography>
                    <b>Current Temperature: </b>  {typeof weather === "undefined" ? "undefined" :
                      this.getFareinheitFromKelvin(weather.main.temp).toFixed(2)}<sup>o</sup> F
                    <b>&emsp;  Minimum Temperature: </b>  {typeof weather === "undefined" ? "undefined" :
                      this.getFareinheitFromKelvin(weather.main.temp_min).toFixed(2)}<sup>o</sup> F
                    <b>&emsp;  Maximum Temperature: </b>  {typeof weather === "undefined" ? "undefined" :
                      this.getFareinheitFromKelvin(weather.main.temp_max).toFixed(2)}<sup>o</sup> F
                  </Typography>
                </div>
                <div className={classes.description}>
                  <Typography>
                    <b>Humidity: </b>  {typeof weather === "undefined" ? "undefined" : weather.main.humidity}%
                    <b>&emsp;Pressure: </b>  {typeof weather === "undefined" ? "undefined" : (0.03 * weather.main.pressure).toFixed(2)} inHg
                  </Typography>
                </div>
                <div className={classes.description}>
                  <Typography>
                    <b>Visibility: </b>  {typeof weather === "undefined" ? "undefined" : weather.visibility} Yards
                    <b>&emsp;Wind Speed: </b>  {typeof weather === "undefined" ? "undefined" : weather.wind.speed} mph
                  </Typography>
                </div>
                <div className={classes.description}>
                  <Typography>
                  <b>Sunrise Time: </b>  {typeof weather === "undefined" ? "undefined" : this.getTime(weather.sys.sunrise)}
                  <b>&emsp;Sunset Time: </b>  {typeof weather === "undefined" ? "undefined" : this.getTime(weather.sys.sunset)}
                  </Typography>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    );
  }

}


ZipcodeDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ZipcodeDetails);
