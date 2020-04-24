import React, { Component } from 'react';
import './css/DataEntry.css';
import './index.js';

import { CardDeck } from 'reactstrap';
import firebase from 'firebase/app';

export class DataEntry extends Component {
    constructor(props) {
        super(props);

        this.setMetric = this.setMetric.bind(this)
        this.updateChange = this.updateChange.bind(this)
        this.updateSelectForm = this.updateSelectForm.bind(this)
        this.updateRadioForm = this.updateRadioForm.bind(this)
        this.previewForm = this.previewForm.bind(this)
        this.editForm = this.editForm.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.updateSelectedMetricAreaCalculation = this.updateSelectedMetricAreaCalculation.bind(this)
        this.check = this.check.bind(this)
        // this.enablePreviewButton = this.enablePreviewButton.bind(this)

        this.state = {
            currentMetricAreaCalculations: new Map(), // Represents all calculations
            selectedMetricAreaCalculations: null, // Represents the chosen metric area calculation to populate
            metricAreaID: null, // Holds metric area ID
            metricAreaName: null, // Holds metric area name
            canEditActuals: false, // Determines users ability to enter data for actuals
            canEditTargets: false, // Determines users ability to enter data for targets
            currentYear: new Date(), // Used for entering data for the current year
            month: "January", // Will always default to January
            actualEn: false,
            targetEn: false,
            preview: false,
            lowlight: "",
            highlight: "",
            mitigation: ""
            // previewButton: false
        }
    }

    componentDidMount() {
        this.checkCurrentDateActuals()
        this.checkCurrentDateTargets()
    }

    componentDidUpdate() {
        console.log(this.state)
    }



    // Checks the current date of the month. If it is the first 3 months of the year
    // the user can enter target data for the year.
    // Note: To allow admin panel compatability to enable users to alter
    // targets/actuals, check the following conditions:
    // 1. If admin enables ability to alter targets/actuals
    //      allow users to edit/submit information pass.
    // Note: Check firebase to see if it is enabled.
    // 2. For actuals:
    //      a. Check if within first two weeks of the month.
    // 3. For targets:
    //      b. Check if within first two months of the year. 
    checkCurrentDateActuals() {
        let currentDate = new Date()
        let currentDay = currentDate.getDate()

        let checkActuals = this.checkActualEnabled()

        // Check firebase to see if editing actuals is enabled
        // Allow user to submit entry for actuals if 
        if (checkActuals || (currentDay <= 14)) {
            this.enableActuals()
            // Display error messaging
        } else {
            console.log("Current date is within latter half of the month!")
            console.log("Data cannot be submitted without admin permissions")
        }
    }

    // Compares current data to determine is user should be allowed to
    // submit/edit data for targets. 
    checkCurrentDateTargets() {
        let currentDate = new Date()
        let currentMonth = currentDate.getMonth()

        let checkTargets = this.checkTargetEnabled()

        // Check firebase to see if editing targets is enabled
        // Perhaps allow ability to change which months users can change data from admin panel...
        if (checkTargets || currentMonth <= 3) {
            this.enableTargets()
        } else {
            console.log("Current month is nothing the timeframe to enter targets")
            console.log("Data cannot be submitted without admin persmissions")
        }
    }

    // Checks to see if actual editing is enabled
    checkActualEnabled() {
        firebase.database().ref('dataEntrySettings/actualEnabled').once('value', (snapshot) => {
            let info = snapshot.val()
            return info
        })
    }

    // Checks to see if target editing is enabled
    checkTargetEnabled() {
        firebase.database().ref('dataEntrySettings/targetEnabled').once('value', (snapshot) => {
            let info = snapshot.val()
            return info
        })
    }

    // Allows user to submit data entry for actuals.
    enableActuals() {
        this.setState((state) => {
            state.canEditActuals = true
            return state
        })
    }

    // Allows user to submit data entry for targets.
    enableTargets() {
        this.setState((state) => {
            state.canEditTargets = true
            return state
        })
    }

    // Sets current state of metric area ID to button that was clicked
    setMetric(name, id) {
        this.setState((state) => {
            state.metricAreaID = id
            state.metricAreaName = name
            return state
        })
        this.retrieveMetricAreaCalculations()
    }

    // Sets state to have current metric area calculations for
    // the selected metric area. 
    setCalculations(mapCalculations) {
        this.setState((state) => {
            state.currentMetricAreaCalculations = mapCalculations
            return state
        })
    }

    // Retrieves relevant metric calculations for a metric
    // area from the firebase database. 
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

    updateSelectedMetricAreaCalculation(calc) {
        this.setState((state) => {
            state.selectedMetricAreaCalculations = calc
            return state
        })
    }

    // Updates state for month value when a drop-down option is selected
    updateSelectForm(event) {
        let monthVal = (event.target.value)
        this.setState((state) => {
            state.month = monthVal
            return state
        })
    }

    // Updates state for entry value when a radio is selected
    updateRadioForm(event) {
        let atVal = (event.target.value)
        this.setState((state) => {
            state.radio = atVal
            return state
        })
    }

    updateChange(event) {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    // Represents metric area elements to render on page.
    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a 
            // list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[0]}
                metricID={key[1]}
                metricFunc={this.setMetric}
            />
        })
        return metricAreaElements
    }

    // Represents metric area calculation elements to render after
    // a metric area is chosen. 
    metricAreaCalculations() {
        const metricCalcElements = Array.from(this.state.currentMetricAreaCalculations.
            entries()).map((key) => {
                return <MetricAreaCalcButton
                    metricCalc={key[1]}
                    metricCalcName={key[1].metric}
                    metricCalcID={key[1].metricCalculationID}
                    metricCalcFunc={this.updateSelectedMetricAreaCalculation}
                />
            })
        return metricCalcElements
    }

    // Creates a pop-up with all information from state asking if the
    // user would like to confirm
    // Notes: Check for any null values, if there are null values
    // warn user and let them know they need to update those values.
    // IMPORTANT! If target/actual being submitted is not an annual,
    // allow user to submit null values for highlights, lowlights,
    // and mitigation plans. 
    previewForm(t) {
        console.log(t)
        if (t) {
            this.setState((state) => {
                state.preview = true
                return state
            })
        }
    }

    // Will switch to preview view when
    // the button is clicked, showing a summary of entered
    // information
    editForm() {
        this.setState((state) => {
            state.preview = false
            return state
        })
    }

    // // Enable preview button
    // // when all the following conditions are met:
    // // 1. Valid Information is entered
    // // 2. All the necessary fields are filled out
    // //      Necessary fields are:
    // //          Data
    // //          Radio
    // //          Month (Enabled by default)
    check() {
        if (this.state.data && this.state.radio && this.state.data !== ""
            && this.state.currentMetricAreaCalculations.size >= 1
            && this.state.selectedMetricAreaCalculations) {

            return true
        }
        let errors = {} // Object to hold errors

        if (!this.state.data) {
            errors["invalidData"] = "A value must be entered"
        }
        if (!this.state.radio) {
            errors["invalidRadio"] = "An actual or target must be selected"
        }
        if (this.state.currentMetricAreaCalculations.size < 1) {
            errors["invalidMetricArea"] = "A metric area must be selected"
        }
        if (!this.state.selectedMetricAreaCalculations) {
            errors["invalidMetricCalc"] = "A metric calculation must be selected"
        }
        errors["errorMsg"] = "Not all required fields have been answered/selected. Check above for more detail."

        this.setState(errors)
        return false
    }

    // Push information to database
    // as a JSON readable format.
    // Check database if enty already exists, if it does, replace values in database
    // otherwise, simply add the new data
    submitForm(month, calcID, radio, data, highlight, lowlight, coe) {
        console.log("Submitting form...")
        // Get necessary values for inputting into database...
        // Need: Month, metricCalculationID, and Year

        let year = new Date()
        year = year.getFullYear()
        // year = 2011
        var x = 1
        switch ((month)) {
            case "January":
                console.log("January!")
                x = 1;
                break;
            case "February":
                x = 2;
                break;
            case "March":
                x = 3;
                break;
            case "April":
                x = 4;
                break;
            case "May":
                x = 5;
                break;
            case "June":
                x = 6
                break;
            case "July":
                x = 7
                break;
            case "August":
                x = 8
                break;
            case "September":
                x = 9
                break;
            case "October":
                x = 10
                break;
            case "November":
                x = 11
                break;
            case "December":
                x = 12
                break;
            default:
                x = 1;
        }

        console.log(data)

        // Find metricareacalculation
        let rootPath = firebase.database().ref('metricGoalsMonths')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()
            let keys = Object.keys(info)
            keys.map((key) => {
                console.log(key)
                console.log(calcID.metricCalculationID)
                if (key === calcID.metricCalculationID.toString()) {
                    let monthString = x.toString()
                    if (x.toString().length === 1) {
                        monthString = "0" + monthString
                    }
                    let keyString = year + monthString + calcID.metricCalculationID.toString()
                    // Check if the data already exists 
                    let childPath = firebase.database().ref('metricGoalsMonths/' +
                        calcID.metricCalculationID.toString() + "/" + keyString)
                    console.log(childPath)
                    childPath.once('value', (snapshot) => {
                        let cInfo = snapshot.val();

                        // If data exists, overwrite it.
                        if (cInfo) {
                            // If user wants to edit an actual
                            if (radio === "Actual") {
                                console.log("Editing actual...")
                                childPath.update({
                                    actual: data,
                                    lowlights: lowlight,
                                    highlights: highlight,
                                    coe: coe
                                })
                                // If user wants to edit a target
                            } else {
                                childPath.update({
                                    target: data,
                                    lowlights: lowlight,
                                    highlights: highlight,
                                    coe: coe
                                })
                            }

                            // If data doesn't exist, create new entry.
                        } else {
                            if (radio === "Actual") {
                                console.log("Data does not exist yet!")
                                console.log("Create a target before inserting an actual!")
                            } else {
                                firebase.database().ref('metricGoalsMonths/' +
                                    calcID.metricCalculationID.toString()).child(keyString).update({
                                        target: data,
                                        lowlights: lowlight,
                                        highlights: highlight,
                                        coe: coe
                                    }
                                    )
                            }
                        }
                    })
                }
            })
        })
    }

    render() {
        const metricAreaElements = this.metricAreaElements()
        const metricAreaCalculationsElements = this.metricAreaCalculations()
        return (
            <div className="body">
                <main>
                    <section class="entry">
                        <h1> Data Entry Form </h1>

                        {/* Populate based on whether metric owner owns metric */}
                        <h2 class='MetricTitles'> Metric Area * </h2>
                        <CardDeck className="datadeck">
                            {metricAreaElements}
                        </CardDeck>
                        <div>
                            <p>{this.state.invalidMetricArea}</p>
                        </div>
                        {/* Populate based on metric chosen */}
                        <h2 class='MetricTitles'> Metric Calculation *</h2>
                        <CardDeck className="datadeck">
                            {metricAreaCalculationsElements}
                        </CardDeck>
                        <div>
                            <p>{this.state.invalidMetricCalc}</p>
                        </div>
                    </section>

                    <section id="forms">
                        <DataEntryForm
                            updateSelectForm={this.updateSelectForm}
                            updateRadioForm={this.updateRadioForm}
                            updateChange={this.updateChange}
                            previewForm={this.previewForm}
                            submitForm={this.submitForm}
                            editForm={this.editForm}
                            check={this.check}
                            month={this.state.month}
                            highlight={this.state.highlight}
                            lowlight={this.state.lowlight}
                            data={this.state.data}
                            mitigation={this.state.mitigation}
                            preview={this.state.preview}
                            radio={this.state.radio}
                            calc={this.state.selectedMetricAreaCalculations}
                            metricAreaName={this.state.metricAreaName}
                            selectedMetricAreaCalculations={this.state.selectedMetricAreaCalculations}
                            previewButton={this.state.previewButton}
                            invalidData={this.state.invalidData}
                            invalidRadio={this.state.invalidRadio}
                            errorMsg={this.state.errorMsg}
                        // invalidMetricArea={this.state.invalidMetricArea}
                        // invalidMetricCalc={this.state.invalidMetricCalc}
                        />
                    </section>
                </main>
            </div>
        )
    }
}

// Represents a single metric area to render. Clicking a button
// will render that metric area's calculations
class MetricAreaButton extends Component {
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
            <button
                onClick={() => this.props.metricCalcFunc(this.props.metricCalc)}
                class='selection' type={typeString} value={typeString}>{typeString}</button>
        )
    }
}

// Represents entry form component. 
// This component will take in input from the user
// for data entry. 
export class DataEntryForm extends Component {
    render() {
        let content = null
        // Will switch content to be the preview
        if (this.props.preview) {
            content = (
                <div>
                    <div>
                        <h2> Summary of Entered Data </h2>
                        <p>Metric Area: <b>{this.props.metricAreaName}</b></p>
                        <p>Metric Calculation: <b>{this.props.selectedMetricAreaCalculations.metric}</b></p>
                        <p>Month: <b>{this.props.month}</b></p>
                        <p>Data Type (Actual/Target): <b>{this.props.radio}</b></p>
                        <p>Data: <b>{this.props.data}</b></p>
                        <p>Highlight: <b>{this.props.highlight}</b></p>
                        <p>Lowlight: <b>{this.props.lowlight}</b></p>
                        <p>MitigationPlan: <b>{this.props.mitigation}</b></p>
                    </div>
                    <button class="preview"
                        onClick={(e) => this.props.editForm(e)}>Edit Data</button>
                    <button class="preview"
                        onClick={() => this.props.submitForm(this.props.month, this.props.calc,
                            this.props.radio, this.props.data, this.props.highlight,
                            this.props.lowlight, this.props.mitigation)}>
                        Submit
                    </button>
                </div>
            )
        } else {
            content = (
                <div>
                    <form>
                        <h2 id='month'> Month *</h2>
                        <select
                            value={this.props.month}
                            onChange={(e) => this.props.updateSelectForm(e)}>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                        <h2 class='InputOption'> Input Data For: * </h2>
                        <div>
                            <label for="actual"> <input
                                onChange={(e) => this.props.updateRadioForm(e)}
                                type="radio" id="actual" value="Actual" name="dataAT" />Actual</label>
                        </div>
                        <div>
                            <label for="target"><input
                                onChange={(e) => this.props.updateRadioForm(e)}
                                type="radio" id="Target" value="Target" name="dataAT" />Target</label>
                        </div>


                        <div>
                            <p>
                                {this.props.invalidRadio}
                            </p>
                        </div>

                        <p class='textInput'>
                            <label for="fname">Enter a value * </label>
                            <input
                                value={this.props.data}
                                onChange={(e) => this.props.updateChange(e)}
                                type="number" id="form" name="data" />
                        </p>

                        <div>
                            <p>
                                {this.props.invalidData}
                            </p>
                        </div>

                        <p class='textInput'>
                            <label for="lname">Highlights</label>
                            <textarea
                                onChange={(e) => this.props.updateChange(e)}
                                value={this.props.highlight} type="text" id="form" name="highlight" />
                        </p>

                        <p class='textInput'>
                            <label for="lname">Lowlights </label>
                            <textarea
                                onChange={(e) => this.props.updateChange(e)}
                                value={this.props.lowlight} type="text" id="form" name="lowlight" />
                        </p>

                        <p class='textInput'>
                            <label for="lname">Mitigation Plan</label>
                            <textarea
                                onChange={(e) => this.props.updateChange(e)}
                                value={this.props.mitigation} type="text" id="form" name="mitigation" />
                        </p>
                    </form>
                    <div>
                        <p>
                            {this.props.errorMsg}
                        </p>
                    </div>
                    <button
                        onClick={() => this.props.previewForm(this.props.check())}
                        class="preview">Preview</button>
                </div>
            )
        }

        return (
            <div>
                {content}
            </div>
        )
    }
}