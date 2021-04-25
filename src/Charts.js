import Chart from 'chart.js/auto';
import React from 'react';


export default class Charts extends React.Component {
    // Cheat sheet:
    // https://www.chartjs.org/docs/latest/axes/styling.html 
    componentDidMount() {

        if (this.props.daily) {
            this.createDailyChart();
            this.setState({data: this.props.daily})
        } else if (this.props.monthly) {
            this.createMonthlyChart();
        } else if (this.props.hourly) {
            this.createHourlyChart();
        } else if (this.props.weather) {
            this.createWeatherChart();
        }
        
        this.getDateData = this.getDateData.bind(this);
        
        document.getElementById("root").style.cursor = "auto";
    }


    render() {
        return (
            <div style={{ "maxWidth": "800px", "backgroundColor": "rgba(255, 255, 255, 0.9)", "margin": "10px" }}>
                <canvas id={this.props.daily ? "daily" : (this.props.monthly ? "monthly" : (this.props.hourly ? "hourly" : "weather"))} width="600px" height="400px"></canvas>
            </div>
        )
    }

    getDateData(date){
        var req = new XMLHttpRequest();
        req.open("GET", "http://192.168.2.102:8001/update_daily/"+date);
        req.send()
    }

    createDailyChart() {
        const ctx = document.getElementById("daily");
        new Chart(ctx, {
            data: {
                labels: this.props.daily.map(a => a.Date),
                datasets: [{
                    borderColor: 'rgb(255,69,0)',
                    backgroundColor: 'rgba(255,69,0, 1)',
                    tension: 0.2,
                    type: 'line',
                    label: 'Max hourly consumption',
                    data: this.props.daily.map(a => a.MaxHourValue),
                },
                {
                    type: "bar",
                    label: "Daily consumption (kWh)",
                    data: this.props.daily.map(a => a.Usage),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255,127,80)',
                    borderWidth: 0.1
                },
                ],

            },
            options: {
                'onClick': this.dateClickEvent.bind(this),
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var consu = "Consumption: "+context.parsed.y+" kWh";
                                var siirto = (context.parsed.y*(2.84+2.79372)/100+19.10/30).toFixed(2)
                                var myynti = (context.parsed.y*4.39/100).toFixed(2)
                                var sum = (parseFloat(siirto)+parseFloat(myynti)).toFixed(2)
                                var sumtext = "Total: "+sum+" €"
                                var label = [consu,"Myynti: "+myynti+" €","Siirto: "+siirto+" €",sumtext]
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    createMonthlyChart() {
        const ctx = document.getElementById("monthly");
        new Chart(ctx, {
            data: {
                labels: this.props.monthly.map(a => { return a.Label }),
                datasets: [
                    {
                        type: "bar",
                        label: "Monthly consumption (kWh)",
                        data: this.props.monthly.map(a => { return a.Usage }),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255,127,80)',
                        borderWidth: 0.1
                    }]
            },
            options: {
                'onClick': this.graphClickEvent,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                console.log(context)
                                var consu = "Consumption: "+context.parsed.y+" kWh";
                                var siirto = (context.parsed.y*(2.84+2.79372)/100+19.10).toFixed(2)
                                var myynti = (context.parsed.y*4.39/100).toFixed(2)
                                var sum = (parseFloat(siirto)+parseFloat(myynti)).toFixed(2)
                                var sumtext = "Total: "+sum+" €"
                                var label = [consu,"Myynti: "+myynti+" €","Siirto: "+siirto+" €",sumtext]
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    createHourlyChart() {
        const ctx = document.getElementById("hourly");
        new Chart(ctx, {
            data: {
                labels: this.props.hourly.map(a => { return a.Label }),
                datasets: [
                    {
                        type: "bar",
                        label: this.props.hourly[0].Date+" Hourly consumption (kWh)",
                        data: this.props.hourly.map(a => { return a.Usage }),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255,127,80)',
                        borderWidth: 0.1
                    }]
            },
            options: {
                'onClick': this.graphClickEvent,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var consu = "Consumption: "+context.parsed.y+" kWh";
                                var siirto = (context.parsed.y*(2.84+2.79372)/100+19.10/30/24).toFixed(2)
                                var myynti = (context.parsed.y*4.39/100).toFixed(2)
                                var sum = (parseFloat(siirto)+parseFloat(myynti)).toFixed(2)
                                var sumtext = "Total: "+sum+" €"
                                var label = [consu,"Myynti: "+myynti+" €","Siirto: "+siirto+" €",sumtext]
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    createWeatherChart() {
        const ctx = document.getElementById("weather");
        new Chart(ctx, {

            data: {
                labels: this.props.weather.map(a => { return a.Date }),
                datasets: [
                    {
                        type: "line",
                        label: "avg",
                        data: this.props.weather.map(a => { return a.tday }),
                        borderColor: 'rgb(0, 0, 10)',
                        backgroundColor: 'rgba(0,10,10,0)',
                        borderWidth: 1,
                        tension: 0.4,
                        fill: false,
                        pointRadius: 0,
                        yAxisID: 'y-axis-0',
                        stack: 'x-axis-0'
                    },
                    {
                        type: "bar",
                        label: "max",
                        data: this.props.weather.map(a => { return [a.tday, a.tmax] }),
                        borderColor: 'rgb(255, 20, 0)',
                        backgroundColor: 'rgba(255,0,0,0.7)',
                        borderWidth: 0.1,
                        yAxisID: 'y-axis-0',
                        stack: 'x-axis-0'
                    },
                    {
                        type: "bar",
                        label: "min",
                        data: this.props.weather.map(a => { return [a.tmin, a.tday] }),
                        borderColor: 'rgba(100, 100, 255, 0.7)',
                        backgroundColor: 'rgba(44,100,255,0.7)',
                        borderWidth: 0.1,
                        yAxisID: 'y-axis-0',
                        stack: 'x-axis-0'
                    },
                    {
                        type: "bar",
                        label: "rain",
                        yAxisID: 'y-axis-1',
                        stack: 'x-axis-1',
                        backgroundColor: "rgba(0,100,255,0.2)",
                        data: this.props.weather.map(a => a.rain)
                    }

                ],

            },
            options: {
                interaction: {
                    intersect: true,
                },
                scales: {
                    "y-axis-0": {
                        id: 'y-axis-0',
                        position: "left",
                        stacked: false,
                        grid: {
                            drawBorder: false,
                            color: function (context) {
                                if (context.tick.value > 0) {
                                    return "rgba(255,0,0,0.2)";
                                } else if (context.tick.value < 0) {
                                    return "rgba(0,0,255,0.2)";
                                }

                                return '#000000';
                            },
                        },
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                    "y-axis-1": {
                        type: 'linear',
                        position: "right",
                        stacked: false,
                        beginAtZero: true,
                        ticks: {
                            color: "rgba(0,100,255,0.2)",
                            beginAtZero: true,
                        },
                        suggestedMax: 15,
                        grid: {
                            display: false
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
        
                                if (label === "rain") {
                                    label += ': '+context.parsed.y+" mm";
                                } else {
                                    label += ': '+context.parsed.y+" ℃";
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    dateClickEvent(event, array) {
        if(array && array[0] && array[0].index){
            this.getDateData(this.props.daily[array[0].index].Date)
            document.getElementById("root").style.cursor = "wait";
        }
    }
    graphClickEvent(event, array){
        //reserved
    }
}