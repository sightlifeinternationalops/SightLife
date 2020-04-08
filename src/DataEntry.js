import React, { Component } from 'react';
import './css/DataEntry.css';
import './index.js';

import Chevron from './img/down-arrow.png'
import { CardDeck } from 'reactstrap';
import firebase from 'firebase/app';

export class DataEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMetricAreaCalculations: new Map() // Represents all calculations
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[0]}
                metricID={key[1]}
            />
        })
        return metricAreaElements
    }

    renderMetricAreaCalculations() {
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
        })
    }

    render() {
        const metricAreaElements = this.metricAreaElements()
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
                            {/* <button class='selection' type="AdoptionCourse" value="AdoptionCourse">Direct Skills Adoption Post Course </button>
                        
                        <button class='selection' type="Total number of surgeons and ophthalmologists trained" value="Total number of surgeons and ophthalmologists  trained (all levels)">
                            Number of Surgeons & Ophthalmologists Trained
                        </button>

                        <button class='selection' type="Surgeon/ophthalmologist" value="Surgeon/ophthalmologist"> Surgeon / Ophthalmologist Satisfaction Rating</button> */}
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

class MetricAreaButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let typeString = this.props.metricName
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