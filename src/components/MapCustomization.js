import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

import { CompactPicker    } from 'react-color';

import Select from '@material-ui/core/Select';

const styles = theme => ({

  slider: {
    padding: '22px 0px',
  },
  thumbIcon: {
    borderRadius: '50%',
  },
  thumbIconWrapper: {
    backgroundColor: '#fff',
  },

  p: {
    fontSize: '20px',
  }

});

const mapColorDomianValues = {
  "blue": ["#EFEFFF", "#02386F"],
  "orange": ["#f7d7c3", "#f97b04"],
  "violet": ["#f1dbf9", "#7b03aa"],
  "maroon": ["#f7cdcd", "#b20a0a"],
  "green": ["#d2fccc", "#18a006"]
}

class MapCustomization extends Component {
  constructor(props){
    super(props);
    this.state = {
      sliderValue: 70,
      currentColor: "#333333",
      domainKey: "blue",
      currentCity: this.props.city
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  handleSliderChange(event, sliderValue){
    let value = 3000;
    console.log(sliderValue);
    if (sliderValue > 70){
      let x = sliderValue - 70;
      value = 3000 + (x*10);
    }
    else {
      let x = 70 - sliderValue;
      value = 3000 - (x*10);
    }
    this.props.changeMapScale(value);
    this.setState({sliderValue: sliderValue});
  }

  handleColorChange(color){
    this.props.changeMapBorderColor(color.hex);
    this.setState({currentColor: color.hex});
  }

  handleChange = name => event => {
    let domainArray = mapColorDomianValues[event.target.value];
    this.props.changeMapColorDomain(domainArray[0], domainArray[1]);
    this.setState({domainKey: event.target.value});
  };

  handleCityChnage = name => event => {
    this.props.changeCity(event.target.value);
    this.props.changeScale(event.target.value);
    this.setState({currentCity: event.target.value});
  };

  render(){

    const { classes } = this.props;

    return (
      <div style={{marginTop:"15%", paddingRight:"10%"}}>
      <p><b>Adjust Map Size</b></p>
      <Slider style={{width: '50%'}}
        value={this.state.sliderValue}
        aria-labelledby="slider-icon"
        onChange={this.handleSliderChange}
        min = {0}
        max = {100}
        step = {10}
        classes={{
          container: classes.slider,
          thumbIconWrapper: classes.thumbIconWrapper,
        }}
        />

        <p><b>Pick Map's Border Color</b></p>
        <CompactPicker color={ this.state.currentColor } onChangeComplete={this.handleColorChange} />

        <br /><br />
        <p><b>choose Map's Colour Varinat</b></p>
        <Select
            native
            value={this.state.domainKey}
            onChange={this.handleChange('mapDomain')}
            inputProps={{
              name: 'mapDomain',
              id: 'map-color-domain',
            }}
          >
            <option value={"blue"}>Blue Variant (Default)</option>
            <option value={"orange"}>Ornage Variant</option>
            <option value={"maroon"}>Maroon Variant</option>
            <option value={"violet"}>Violet Variant</option>
            <option value={"green"}>Green Variant</option>
          </Select>

          <br /> <br />
          <p><b>Would Like to Change State ?</b></p>
          <Select
              native
              value={this.state.currentCity}
              onChange={this.handleCityChnage('city')}
              inputProps={{
                name: 'city',
                id: 'city',
              }}
            >
              <option value={"California"}>California</option>
              <option value={"Texas"}>Texas</option>
              <option value={"NorthCarolina"}>North Carolina</option>
            </Select>

      </div>
    );
  }
}

MapCustomization.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapCustomization);
