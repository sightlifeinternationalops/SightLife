import React, { Component } from 'react';
import './css/DataEntry.css';
import './index.js';

import Chevron from './img/down-arrow.png'
import { CardDeck } from 'reactstrap';
import firebase from 'firebase/app';

export class DataEntry extends Component {
    constructor(props) {
        super(props);

        this.setMetric = this.setMetric.bind(this)
        this.state = {
            currentMetricAreaCalculations: new Map(), // Represents all calculations
            selectedMetricAreaCalculations: null, // Represents the chosen metric area calculation to populate
            metricAreaID: null, // Holds metric area ID
            metricAreaName: null // Holds metric area name
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    // Sets current state of metric area ID to button that was clicked
    setMetric(name, id) {
        console.log('Button was clicked!')
        this.setState((state) => {
            state.metricAreaID = id
            state.metricAreaName = name
            return state
        })
        this.retrieveMetricAreaCalculations()
    }

    setCalculations(mapCalculations) {
        this.setState((state) => {
            state.currentMetricAreaCalculations = mapCalculations
            return state
        })
    }

    retrieveMetricAreaCalculations() {
        let rootPath = firebase.database().ref('metricCalculations')
        rootPath.once('value', (snapshot) => {
            let metricCalcInfo = snapshot.val();
            let databaseKeys = Object.keys(metricCalcInfo);
            let mapCalculations = new Map()

            databaseKeys.map((key) => {
                let id = metricCalcInfo[key].metricAreaID
                if (id == this.state.metricAreaID) {
                    mapCalculations.set(key, metricCalcInfo[key]) 
                }
            })
            this.setCalculations(mapCalculations)
        })
    }

    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[0]}
                metricID={key[1]}
                metricFunc={this.setMetric}
            />
        })
        return metricAreaElements
    }

    metricAreaCalculations() {
        const metricCalcElements = Array.from(this.state.currentMetricAreaCalculations.entries()).map((key) => {
            console.log(key);
            return <MetricAreaCalcButton
                metricCalcName={key[1].metric}
            />
        })
        return metricCalcElements
    }

    render() {
        // let currentCalculations = this.state.currentMetricAreaCalculations
        const metricAreaElements = this.metricAreaElements()
        const metricAreaCalculationsElements = this.metricAreaCalculations()
        return (
            <div className="body">
                <main>
                    <section class="entry">
                        <h1> Data Entry Form </h1>

                        {/* Populate based on whether metric owner owns metric */}
                        <h2 class='MetricTitles'> Metric Area </h2>
                        <CardDeck className="datadeck">
                            {metricAreaElements}
                        </CardDeck>

                        {/* Populate based on metric chosen */}
                        <h2 class='MetricTitles'> Metric Calculation </h2>
                        <CardDeck className="datadeck">
                            {metricAreaCalculationsElements}
                        </CardDeck>
                    </section>

                    <section id="forms">
                        <DataEntryForm />
                    </section>
                </main>


            </div>
        )
    }
}

// Represents a single metric area to render. Clicking a button
// will render that metric area's calculations
class MetricAreaButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let typeString = this.props.metricName
        return (
            <button 
                class='selection' 
                type={typeString} 
                value={typeString}
                onClick={() => this.props.metricFunc(this.props.metricName, this.props.metricID)}
                >
                        {typeString}
            </button>
        )
    }
}

// Represesnts a single metric area calculation to render. Will render
// depending on the metric area that was selected.
class MetricAreaCalcButton extends Component {
    render() {
        let typeString = this.props.metricCalcName
        return (
            <button class='selection' type={typeString} value={typeString}>{typeString}</button>
        )
    }
}

export class DataEntryForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            highlight: "",
            lowlight: "",
            data: null,
            month: "",
            actual: false,
            target: false,
            mitigation: ""
        }
    }

    render() {
        return (
            <div>
                <form>
                    <h2 id='month'> Month </h2>
                    <div class="dropdown">
                        <button class="dropbtn"> Select A Month <img src={Chevron} /></button>
                        <div class="dropdown-content">
                            <p>January</p>
                            <p>February</p>
                            <p>March</p>
                            <p>April</p>
                            <p>May</p>
                            <p>June</p>
                            <p>July</p>
                            <p>August</p>
                            <p>September</p>
                            <p>October</p>
                            <p>November</p>
                            <p>December</p>
                        </div>
                    </div>

                    <h2 class='InputOption'> Input Data For: </h2>
                    <div class='CheckBoxes'>
                        <div class='check-one'>
                            <input class='box' type="checkbox" id="Target" name="Target" value="Target" />
                            <label class='check' for="Target">Target </label>
                        </div>

                        <div class='check-one'>
                            <input class='box' type="checkbox" id="Actual" name="Actual" value="Actual" />
                            <label class='check' for="Actual">Actual</label>
                        </div>
                    </div>

                    <p class='textInput'>
                        <label for="fname">Data For XXX </label>
                        <input type="input" id="form" name="Data" />
                    </p>

                    <p class='textInput'>
                        <label for="lname">Highlights</label>
                        <textarea type="text" id="form" name="Higlights" />
                    </p>

                    <p class='textInput'>
                        <label for="lname">Lowlights </label>
                        <textarea type="text" id="form" name="Lowlights" />
                    </p>

                    <p class='textInput'>
                        <label for="lname">Mitigation Plan</label>
                        <textarea type="text" id="form" name="Mitigation" />
                    </p>
                    <button class='preview'>Preview</button>
                </form>
            </div>
        )
    }
}