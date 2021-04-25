import './App.css';
import daily from './data/daily.json';
import monthly from './data/monthly.json';
import hourly from './data/hourly.json';
import Charts from './Charts';
import React from 'react';
import weather from './data/weather.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false, sortedDaily: [...daily], sortAscending: true}
  };

  render(){
    let weatherData = [...weather];
    let dates = []
    weatherData.forEach((a)=>{
      if(dates.indexOf(a.time) === -1){
        dates.push(a.time)
      }
    })

    let dateData = []
    dates.forEach((date)=>{
      let dateSet = weatherData.filter((a) => a.time === date)
      let tday = (dateSet.find((b)=>b.name==="tday" && b.value !== "NaN") || []).value
      let tmin = (dateSet.find((b)=>b.name==="tmin" && b.value !== "NaN") || []).value
      let tmax = (dateSet.find((b)=>b.name==="tmax" && b.value !== "NaN") || []).value

      if(!tday || tmin > tday){
        tday = (parseInt(tmin)+parseInt(tmax))/2
      }
      let rrday = (dateSet.find((b)=>b.name==="rrday" && b.value !== "NaN" && b.value !== "-1.0") || []).value
      
      dateData.push({"Date": date, "tmin":tmin, "tmax":tmax, "tday":tday, "rain": rrday})
    })
    return (
      <div className="App">
        <div className="App-header">
          <h2>Lumofetch by Mikkelson - electricity consumption</h2>
          <div>
            <button style={{"marginRight": "10px"}} onClick={()=>{
              var req = new XMLHttpRequest();
              req.open("GET", "http://192.168.2.102:8001/update_weather");
              req.send()
            }}>Update weather</button>
            <button style={{"marginLeft": "10px"}} onClick={()=>{
              var req = new XMLHttpRequest();
              req.open("GET", "http://192.168.2.102:8001/update_consumption");
              req.send()
            }}>Update consumption data</button>
          </div>
          <div>
            <Charts monthly={monthly}/>
            <Charts daily={daily}/>
            <Charts weather={dateData}/>
            <Charts hourly={hourly}/>
          </div>
          <div>
            <p style={{"fontSize":"18px"}}>Daily Stats</p>
            <button onClick={() => this.setState({expanded: !this.state.expanded})}>{this.state.expanded ? "Hide": "Show"}</button>
            {this.state.expanded && 
              <div>
              {<div>Cumulative cost estimation: {Math.round(daily.reduce((total, a)=>a.Usage+total,0)*(4.23+2.84+2.79372))/100+(19.10/30*(daily.length))} € {daily.reduce((total, a)=>a.Usage+total,0)} kWh</div>}
              <table style={{"width": "600px", "fontSize":"16px"}} >
                <thead>
                  <tr>
                    <th onClick={()=>{this.setState({sortedDaily: this.sortDate(this.state.sortedDaily, this.state.sortAscending), sortAscending: !this.state.sortAscending })}}>Date</th>
                    <th onClick={()=>{this.setState({sortedDaily: this.state.sortedDaily.sort((a,b)=>{return this.state.sortAscending ? a.MaxHourValue-b.MaxHourValue : b.MaxHourValue-a.MaxHourValue}), sortAscending: !this.state.sortAscending })}}>Max hourly usage</th>
                    <th onClick={()=>{this.setState({sortedDaily: this.state.sortedDaily.sort((a,b)=>{return this.state.sortAscending ? a.Usage-b.Usage : b.Usage-a.Usage}), sortAscending: !this.state.sortAscending })}}>Usage</th>
                    <th onClick={()=>{this.setState({sortedDaily: this.state.sortedDaily.sort((a,b)=>{return this.state.sortAscending ? a.Usage-b.Usage : b.Usage-a.Usage}), sortAscending: !this.state.sortAscending })}}>Estimated cost</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.sortedDaily.map(a =>{
                  return <tr key={a.Date}><td>{a.Date}</td><td>{a.MaxHourValue}</td><td>{a.Usage}</td><td>{(a.Usage*(4.39+2.84+2.79372)/100+19.10/30).toFixed(2)} €</td></tr>
                })}
                </tbody>
              </table>
            </div>}
          </div>
        </div>
        
      </div>
    );
  }

  sortDate(data, ascending){
    data.sort((a,b)=>{
      if (a.Date < b.Date) {
        return ascending ? 1 : -1;
      }
      if (a.Date > b.Date) {
        return ascending ? -1 : 1;
      }
      return 0;})
    return data
  }
  
}

export default App;
