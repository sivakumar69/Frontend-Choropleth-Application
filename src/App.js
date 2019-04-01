import React, { Component } from 'react';
import './App.css';
import Papa from 'papaparse';
import Choropleth from './components/Choropleth';
import ZipcodeDetails from './components/ZipcodeDetails';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import backgroundImg from './earth.gif';
import logo from './logo.png';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data:[],
      city: undefined
    };

    this.updateData = this.updateData.bind(this);
    this.changeCity = this.changeCity.bind(this);
  }

  componentWillMount() {
    if(Object.keys(this.props).length === 0){
      this.setState({city: 'California'});
    }
    else{
      this.setState({city: this.props.match.params.city});
    }
  }

  parseCSVFile(){
    if (typeof this.state.city === "undefined") {
      return;
    }
    if(this.state.data.length === 0){
      let csvFilePath = require(`./Data/${this.state.city}/ZipData.csv`);
      Papa.parse(csvFilePath, {
        header: true,
        download: true,
        skipEmptyLines: true,
        complete: this.updateData
      });
    }
  }

  changeCity(cityName) {
    console.log("Change City is initiated in App.js");
    this.setState({city: cityName, data:[]});
  }

  updateData(result) {
    let resultData = result.data;
    this.setState({data: resultData});
  }

  render() {
    this.parseCSVFile();
    return (
      <div style={{height:"100vh", width: "100vw", backgroundColor:'#e5dede'}} >
        <NavBar />
        <Router>
          <div style={{height:"100vh", width: "100vw", marginTop:"1%"}}>
            <Route exact path="/"
              render={(props) => <Choropleth {...props} city={this.state.city} changeCity={this.changeCity}  data={this.state.data} />} />
            <Route exact path="/zipcode-details/:city/:zipcode"
              render={(props) => <div style={{height:"100%", width:"100%", backgroundImage: `url(${backgroundImg})`}}><ZipcodeDetails {...props} city={props.match.params.city} zipcode={props.match.params.zipcode} /> </div>} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
