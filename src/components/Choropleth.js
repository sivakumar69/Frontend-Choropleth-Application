import React, { Component } from 'react';
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import {scaleLinear} from 'd3-scale';
import {geoMercator, geoPath} from 'd3-geo';
import MapCustomization from './MapCustomization';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


const cityLatLong  = {
  "California": {"center": [-119.4179, 36.7783], "scale": 2700},
  "Texas": {"center": [-99.9018, 31.9686], "scale": 2700},
  "NorthCarolina": {"center": [-79.0193, 35.7596], "scale": 4000}
};



const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class ChoroplethMap extends Component {

  constructor(props){
    super(props);
    this.state = {
    data:[],
    mapBorderColor: "#000000",
    mapMinColor:"#EFEFFF",
    mapMaxColor: "#02386F",
    mapScale: cityLatLong[this.props.city]["scale"],
    };

    this.changeMapBorderColor = this.changeMapBorderColor.bind(this);
    this.changeMapColorDomain = this.changeMapColorDomain.bind(this);
    this.changeMapScale = this.changeMapScale.bind(this);
    this.changeScale = this.changeScale.bind(this);
  }

  changeMapBorderColor(color){
    this.setState({mapBorderColor: color});
  }

  changeMapColorDomain(min, max){
    this.setState({mapMinColor: min, mapMaxColor:max});
  }

  changeMapScale(scale) {
    this.setState({mapScale: scale});
  }

  componentDidUpdate() {
    this.renderMap();
  }

  componentDidMount() {
    this.renderMap();
  }

  changeScale(cityName){
    this.setState({mapScale: cityLatLong[cityName]["scale"]});
  }

  renderMap(){
    let dataset = {};

    let onlyValues = this.props.data.map(function (obj) { return parseInt(obj['population']); });
    let minValue = Math.min.apply(null, onlyValues),
    maxValue = Math.max.apply(null, onlyValues);

    let paletteScale = scaleLinear()
      .domain([minValue, maxValue])
      .range([this.state.mapMinColor, this.state.mapMaxColor]);

    this.props.data.forEach(function (item) {
      let iso = item['zip'],
        value = item['population'];
      dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
    });

    document.getElementById('cloropleth_map').innerHTML = "";

    let that = this;

    let CaliforniaJson = require(`../Data/${this.props.city}/topo.json`);

    new Datamap({
      element: document.getElementById('cloropleth_map'),
      scope: 'colorgeo',
      geographyConfig: {
        popupOnHover: true,
        highlightOnHover: true,
        borderColor: this.state.mapBorderColor,
        highlightBorderWidth: 1,
        borderWidth: 0.5,
        dataJson: CaliforniaJson,
        popupTemplate: function (geo, data) {
          if (!data) {
            return ['<div class="hoverinfo">',
            'Zip Code: <strong>', geo.id, '</strong>',
            '<br>Population:  <strong>Data Unavailable</strong>',
            '</div>'].join('');
          }
          return ['<div class="hoverinfo">',
          'Zip Code:  <strong>', geo.id, '</strong>',
          '<br>Population: <strong>', data.numberOfThings, '</strong>',
          '</div>'].join('');
        }
      },
      fills: {
        HIGH: '#afafaf',
        LOW: '#123456',
        MEDIUM: 'blue',
        UNKNOWN: 'rgb(225,225,125)',
        defaultFill: '#eee'
      },
      data: dataset,
      done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
          window.location = '/zipcode-details/' + that.props.city  + '/' + geography.id ;
        });
      },
      setProjection: function (element) {
        var projection = geoMercator()
          .center(cityLatLong[that.props.city]["center"])
          .scale(that.state.mapScale)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

        var path = geoPath().projection(projection);
        return { path: path, projection: projection };
      }
    });
  }


  render() {

    return (
      <div style={{ height: "100%", width: "100%",}}>
        <Grid style={{ height: "100%" }} container >
          <Grid item xs={6}>
            <div id="cloropleth_map" style={{ height: "100%", width: "100%", backgroundColor: '#e5dede', opacity:'0.9'}}>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{backgroundColor:'#e5dede', opacity:'0.9', height:'100%', width:'100%'}}>
             <MapCustomization changeMapBorderColor={this.changeMapBorderColor} changeMapColorDomain={this.changeMapColorDomain}
                                changeMapScale={this.changeMapScale} changeCity={this.props.changeCity}  city={this.props.city}
                                changeScale={this.changeScale} scaleValue={cityLatLong[this.props.city]["scale"]} />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

}

ChoroplethMap.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChoroplethMap);
