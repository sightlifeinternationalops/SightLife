import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import './css/DataEntry.css';
import './index.js';

import { CardDeck } from 'reactstrap';
import firebase from 'firebase/app';
import { createPortal } from 'react-dom';

export class DataEntry extends Component {
    constructor(props) {
        super(props);

        let currentDate = new Date()
        // let year = currentDate.getFullYear()
        let year = 2019
        let month = currentDate.getMonth() + 1

        // Revert to previous year and to month being December
        // Since metric owners are entering data for the previous month,
        // when the current month is January they need to be submitting
        // for December of last year
        if (month === 1) {
            month = 12
            year = year - 1
        // Any other time set it one month back prior
        } else {
            month = month - 1
        }

        this.setMetric = this.setMetric.bind(this)
        this.updateChange = this.updateChange.bind(this)
        this.updateSelectForm = this.updateSelectForm.bind(this)
        this.updateACheckForm = this.updateACheckForm.bind(this)
        this.updateTCheckForm = this.updateTCheckForm.bind(this)
        this.previewForm = this.previewForm.bind(this)
        this.editForm = this.editForm.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.updateSelectedMetricAreaCalculation = this.updateSelectedMetricAreaCalculation.bind(this)
        this.check = this.check.bind(this)
        this.timeDisplay = this.timeDisplay.bind(this)
        this.dataDisplay = this.dataDisplay.bind(this)

        this.state = {
            currentMetricAreaCalculations: new Map(), // Represents all calculations
            currentArchivedCalculations: new Map(),
            selectedMetricAreaCalculations: null, // Represents the chosen metric area calculation to populate
            metricAreaID: null, // Holds metric area ID
            metricAreaName: null, // Holds metric area name
            // canEditActuals: false, // Determines users ability to enter data for actuals
            // canEditTargets: false, // Determines users ability to enter data for targets
            currentYear: new Date(), // Used for entering data for the current year
            tfValue: month, // Will always default to current year
            tfValueYear: year,
            selectTF: "metricGoalsMonths", // Will always default to Months
            actualEn: false,
            targetEn: false,
            preview: false,
            loading: "none",
            month: "",
            lowlight: "", // Needed for firebase interaction
            highlight: "", // Needed for firebase interaction
            mitigation: "", // Needed for firebase interaction
            metrics: new Map(),
            currentYear: year,
            currentMonth: month
        }
    }

    componentDidMount() {
        this.retrieveUsersMetricAreas()
        this.retrieveAdminUsers()
        this.checkCurrentDateActuals()
        this.checkCurrentDateTargets()
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    retrieveAdminUsers() {
        let rootPath = firebase.database().ref('admins')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()
            let usersMap = new Map()

            // If the admins reference exists in the database
            // or if something exists in the database for admins
            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    console.log(key)
                    console.log(info[key])
                    console.log(this.props.user.uid)
                    if (info[key].userMetricID === this.props.user.uid) {
                        console.log("Current user is an admin")
                        this.setState((state) => {
                            state.adminPermissions = true
                            return state
                        })
                    }
                })
            }
            // this.setAdminUsers(usersMap)
        })
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

        console.log(checkActuals)

        // Check firebase to see if editing actuals is enabled
        // Allow user to submit entry for actuals if 
        if (checkActuals || (currentDay <= 14)) {
            this.enableActuals()
            // Display error messaging
        } else {
            // console.log("Current date is within latter half of the month!")
            // console.log("Data cannot be submitted without admin permissions")
            this.setState((state) => {
                state.errorMsg = "Deadline has been passed for entering actuals for previous month. Contact admin to change permissions"
            })
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
            this.setState((state) => {
                state.canEditActuals = info
                return state
            })
        })
    }

    // Checks to see if target editing is enabled
    checkTargetEnabled() {
        firebase.database().ref('dataEntrySettings/targetEnabled').once('value', (snapshot) => {
            let info = snapshot.val()
            this.setState((state) => {
                state.canEditTargets = info
                return state
            })
        })
    }

    retrieveUsersMetricAreas = () => {
        let rootPath = firebase.database().ref('metricAreas')
        rootPath.once('value', (snapshot) => {
          let info = snapshot.val()
          let keys = Object
          .keys(info);
          let ownerMap = new Map()
    
        console.log(this.props.user.uid)

          keys.map((key) => {
            let currentOwners = info[key].owners
            for (var user in currentOwners) {
                console.log(currentOwners[user])
                console.log(currentOwners[user].userMetricID)
              if (currentOwners[user].userMetricID === this.props.user.uid) {
                console.log("Owner of this metric")
                ownerMap.set(key, info[key])
              }
            }
          })
          this.setState((state) => {
            state.metrics = ownerMap;
            return state;
          })
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
    setMetric(name, id, actual, target) {
        this.setState((state) => {
            state.metricAreaID = id
            state.metricAreaName = name
            state.metricActualEnabled = actual
            state.metricTargetEnabled = target
            state.selectedMetricAreaCalculations = null
            return state
        })
        this.retrieveMetricAreaCalculations()
    }

    // Sets state to have current metric area calculations for
    // the selected metric area. 
    setCalculations(mapCalculations) {
        this.setState((state) => {
            state.currentMetricAreaCalculations = mapCalculations
            state.loading = "block"
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
                if (id === this.state.metricAreaID) {
                    if (!metricCalcInfo[key].calcArchived) {
                        mapCalculations.set(key, metricCalcInfo[key])
                    }
                }
            })
            this.setCalculations(mapCalculations)
        })
    }

    updateSelectedMetricAreaCalculation(calc, name, type) {
        console.log(type)
        this.setState((state) => {
            state.selectedMetricAreaCalculations = calc
            state.selectedMetricAreaCalculationName = name
            state.selectedMetricAreaCalculationDataType = type
            return state
        })
    }

    // Updates state for month value when a drop-down option is selected
    updateSelectForm(event) {
        let tfValue = (event.target.value)
        this.setState((state) => {
            state.tfValue = tfValue
            return state
        })
    }

    // // If the current month is January
    // // return last year's year
    // checkIfLastYear(month) {
    //     // let year = new Date()
    //     // year = year.getFullYear()

    //     if (month === 1) {
    //         month = 12
    //         year = year - 1
    //     }

    //     let timeObj = {
    //         month: month,
    //         year: year
    //     }

    //     console.log(timeObj)

    //     return timeObj
    // }

    // If admin allows users to enter data for the current month
    // Need to set tfValue here whenever month is selected
    // If adminactualEn is true, allow a dropdown for users to select
    // the month
    updateACheckForm(event) {
        let val = (event.target.value)

        let adminEnabled = this.state.canEditActuals
        // let month = new Date()
        // month = month.getMonth() + 1

        // let timeObj = this.checkIfLastYear(month)

       let userP = this.state.metricActualEnabled

       console.log(adminEnabled)

       console.log(userP)

        if (adminEnabled || userP) {
            this.setState((state) => {
                state.radio = val
                state.actualEn = true
                state.adminActualEn = adminEnabled
                // state.tfValue = timeObj.month
                state.targetEn = false
                return state
            })
        } else {
            console.log("Test")
            this.setState((state) => {
                state.actualDisabledMsg = "Permissions to submit actuals are currently disabled or past the deadline. Contact your administrator."
                return state
            })
        }
    }

    updateTCheckForm(event) {
        let val = (event.target.value)

        let adminEnabled = this.state.canEditTargets

        console.log(adminEnabled)

        let userP = this.state.metricTargetEnabled

        if (adminEnabled || userP) {
            this.setState((state) => {
                state.radio = val
                state.targetEn = true
                state.actualEn = false
                return state
            })
        } else {
            this.setState((state) => {
                state.targetDisabledMsg = "Permissions to submit targets are currently disabled or past the first 3 months of the year. Contact your administrator to enable permissions."
                return state
            })
        }
    }

    updateChange(event) {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    // Represents metric area calculation elements to render after
    // a metric area is chosen. 
    metricAreaCalculations() {
        let metricCalcElements = null
        if (this.state.currentMetricAreaCalculations.size >= 1) {
            metricCalcElements = Array.from(this.state.currentMetricAreaCalculations.
                entries()).map((key) => {
                    let calculation = key[1]
                    return <MetricAreaCalcButton
                        metricCalcName={calculation.calcName}
                        metricCalcID={calculation.calcID}
                        metricCalcDataType={calculation.dataType}
                        metricCalcFunc={this.updateSelectedMetricAreaCalculation}
                    />
                })
        } else {
            metricCalcElements = (
                <div>
                    <h4>
                        Choose a metric area
                    </h4>
                </div>
            )
        }
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
        console.log(this.state)

        if (t) {
            this.setState((state) => {
                state.preview = true
                state.invalidData = ""
                state.invalidRadio = ""
                state.invalidMetricCalc = ""
                state.invalidMetricArea = ""
                state.errorMsg = ""
                state.dataSubmitted = ""
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
            && this.state.selectedMetricAreaCalculations && this.state.tfValue && this.state.tfValue !== "none") {
            return true
        }
        let errors = {} // Object to hold errors

        if (!this.state.data) {
            errors["invalidData"] = "A value must be entered"
        }
        if (!this.state.tfValue) {
            errors["invalidTime"] = "A month or quarter or annual must be selected."
        }
        if (!this.state.radio) {
            errors["invalidRadio"] = "An actual or target must be selected"
        }
        if (this.state.currentMetricAreaCalculations.size < 1) {
            errors["invalidMetricArea"] = "A metric area must be selected"
        }
        if (!this.state.selectedMetricAreaCalculations) {
            errors["invalidMetricCalc"] = "A metric must be selected"
        }
        errors["errorMsg"] = "Not all required fields have been answered/selected. Check above for more detail."

        this.setState(errors)
        return false
    }

    // Receives a timeDisplay (month, quarter, annual)
    // and returns the appropriate elements for that display
    timeDisplay(time) {
        let x = null
        switch ((time)) {
            case "metricGoalsMonths":
                x = (
                    <div>
                        <h2 id='month'> Month <span class="required">*</span></h2>
                        <select
                            onChange={(e) => this.updateSelectForm(e)}>
                            <option disabled selected value="none">Select a month</option>
                            <option value={1}>January</option>
                            <option value={2}>February</option>
                            <option value={3}>March</option>
                            <option value={4}>April</option>
                            <option value={5}>May</option>
                            <option value={6}>June</option>
                            <option value={7}>July</option>
                            <option value={8}>August</option>
                            <option value={9}>September</option>
                            <option value={10}>October</option>
                            <option value={11}>November</option>
                            <option value={12}>December</option>
                        </select>
                    </div>)
                break;
            case "metricGoalsQuarters":
                x = (
                    <div>
                        <h2 id='quarter'> Quarter <span class="required">*</span></h2>
                        <select
                            onChange={(e) => this.updateSelectForm(e)}>
                            <option selected="selected">None</option>
                            <option value="1">Quarter 1</option>
                            <option value="2">Quarter 2</option>
                            <option value="3">Quarter 3</option>
                            <option value="4">Quarter 4</option>
                        </select>
                    </div>
                )
                break;
            case "metricGoalsAnnuals":
                x = (
                    <div>
                        No Action Needed
                    </div>
                )
                break;
        }
        return x
    }

    currentMonthDisplay(radio) {
        let x = null
        switch ((radio)) {
            case "metricGoalsMonths":
                x = (
                    <div>
                        <h2 id="month">Submitting data for </h2>
                    </div>
                )
        }
        return x
    }

    dataDisplay(dataType) {
        let x = null
        switch ((dataType)) {
            case "money":
            case "number":
            case "percent":
                x = (
                    <div class='textInput'>
                        <label for="fname">Enter a value <span class="required">*</span> </label>
                        <input
                            value={this.props.data}
                            onChange={(e) => this.updateChange(e)}
                            type="number" id="form" name="data" step="0.01"/>
                    </div>
                )
                break;
            case "text":
                x = (
                    <div>
                        <label for="fname">Enter text <span class="required">*</span> </label>
                        <input
                            value={this.props.data}
                            onChange={(e) => this.updateChange(e)}
                            type="text" id="form" name="data" />
                    </div>
                )
                break;
        }
        return x
    }

    test(selectTF, tfValue) {
        let x = tfValue
        if (selectTF === "metricGoalsMonths") {
            switch (tfValue) {
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
        }
        return x
    }

    // Push information to database
    // as a JSON readable format.
    // Check database if enty already exists, if it does, replace values in database
    // otherwise, simply add the new data
    submitForm(year, dataType, selectTF, tfValue, calcID, radio, data, highlight, lowlight, coe) {
        // Get necessary values for inputting into database...
        // Need: Month, metricCalculationID, and Year

        // let timeObj = this.checkIfLastYear(tfValue)

        // let year = timeObj.year
        // let x = timeObj.month
        let x = tfValue

        console.log(selectTF)

        let rootPath = firebase.database().ref(selectTF)


        let monthString = x.toString()
        let keyString = monthString

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            // If metricgoalsMonths does not exist
            // Log error here...
            if (info) {
                let keys = Object.keys(info)
                let childPath = firebase.database().ref(selectTF + '/' + calcID + "/" + year + '/' + keyString)
                childPath.once('value', (snapshot) => {
                    let cInfo = snapshot.val()
                    if (cInfo) {
                        if (radio === "Actual") {
                            childPath.update({
                                actual: data,
                                lowlights: lowlight,
                                highlights: highlight,
                                coe: coe,
                                time: x,
                                lastEdit: new Date(),
                                dataType: dataType
                            })
                            this.setState((state) => {
                                state.dataSubmitted = "Data successfully submitted!"
                                return state
                            })
                            // If user wants to edit a target
                        } else {
                            childPath.update({
                                target: data,
                                lowlights: lowlight,
                                highlights: highlight,
                                coe: coe,
                                time: x,
                                lastEdit: new Date(),
                                dataType: dataType
                            })
                            this.setState((state) => {
                                state.dataSubmitted = "Data successfully submitted!"
                                return state
                            })
                        }            
                    } else {
                        console.log("Test")
                        this.newMetricCalculation(year, dataType, selectTF, radio, calcID, keyString, data, lowlight, highlight, coe, x)
                    }
                })
            } else {
                console.log("Test")
                this.newMetricCalculation(year, dataType, selectTF, radio, calcID, keyString, data, lowlight, highlight, coe, x)
            }
        })
    }

    newMetricCalculation(year, dataType, selectTF, radio, calcID, keyString, data, lowlight, highlight, coe, x) {
        if (radio === "Actual") {
            console.log("Data does not exist yet!")
            console.log("Create a target before inserting an actual!")
            this.setState((state) => {
                state.noActual = "Data does not exist yet, create a target before inserting data for an actual"
                return state
            })
        } else {
            // let ref = firebase.database().ref('metricAreas')
            // let id = ref.push().getKey()
            let currentTime = new Date()
            // let currentYear = currentTime.getFullYear() + "/"
            // let currentYear = this.state.currentYear
            firebase.database().ref(selectTF + '/' + calcID + "/" + year + "/" + keyString).update({
                target: data,
                lowlights: lowlight,
                highlights: highlight,
                coe: coe,
                time: x,
                actual: "N/A",
                dataType: dataType,
                inputTime: currentTime
            })

            this.setState((state) => {
                state.dataSubmitted = "Data successfully submitted!"
                return state
            })

        }
    }

    renderDataEntryForm() {
        return <DataEntryForm
            {...this.state}
            checkActualEnabled={this.checkActualEnabled}
            checkTargetEnabled={this.checkTargetEnabled}
            updateSelectForm={this.updateSelectForm}
            updateRadioForm={this.updateRadioForm}
            updateTCheckForm={this.updateTCheckForm}
            updateACheckForm={this.updateACheckForm}
            updateChange={this.updateChange}
            previewForm={this.previewForm}
            submitForm={this.submitForm}
            checkIfLastYear={this.checkIfLastYear}
            editForm={this.editForm}
            check={this.check}
            timeDisplay={this.timeDisplay}
            dataDisplay={this.dataDisplay}
        />
    }

    // Represents metric area elements to render on page.
    metricAreaElements() {
        const metricAreaElements = Array.from(this.state.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a 
            // list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[1].metricName}
                metricID={key[1].metricID}
                metricActualEnabled={key[1].metricActualEnabled}
                metricTargetEnabled={key[1].metricTargetEnabled}
                metricFunc={this.setMetric}
            />
        })
        return metricAreaElements
    }

    checkLoadingState() {
        if (this.state.currentMetricAreaCalculations.size > 0) {
            return true
        } else {
            return false
        }
    } 

    render() {
        const metricAreaElements = this.metricAreaElements()
        const metricAreaCalculationsElements = this.metricAreaCalculations()
        const dataEntryForm = this.renderDataEntryForm()

        let loadingContent = this.checkLoadingState() ? <div>{metricAreaCalculationsElements}</div> : <Spinner style={{display: this.state.loading}} color="primary"/>

        let formContent = (<div>
            <section id="forms">
                {dataEntryForm}
            </section>
        </div>)

        let content = (
            <div>
                <section class="entry">
                    <h1 className="DataEn"> Data Entry Form </h1>
                    {/* Populate based on whether metric owner owns metric */}
                    <h2 class='MetricTitles'> Metric Area <span class="required">*</span> </h2>
                    <CardDeck className="datadeck">
                        {metricAreaElements}
                    </CardDeck>
                    <div class="errorMsg">
                        <p>{this.state.invalidMetricArea}</p>
                    </div>
                    {/* Populate based on metric chosen */}
                    <h2 class='MetricTitles'> Metric <span class="required">*</span></h2>
                    <CardDeck className="datadeck">
                        {/* <Spinner style={{display:"none"}}/>
                        {metricAreaCalculationsElements} */}
                        {loadingContent}
                    </CardDeck>
                    <div class="errorMsg">
                        <p>{this.state.invalidMetricCalc}</p>
                    </div>
                </section>
            </div>
        )

        return (
            <div className="body">
                <main>
                    {content}
                    {formContent}
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
                onClick={() => this.props.metricFunc(this.props.metricName, this.props.metricID, this.props.metricActualEnabled, this.props.metricTargetEnabled)}
            >
                {typeString}
            </button>
        )
    }
}

// Represesnts a single metric area calculation to render. Will render
// depending on the metric area that was selected.
class MetricAreaCalcButton extends Component {
    componentDidMount() {
        console.log(this.props)
    }

    render() {
        let typeString = this.props.metricCalcName
        return (
            <button
                onClick={() => this.props.metricCalcFunc(this.props.metricCalcID, typeString, this.props.metricCalcDataType)}
                class='selection' type={typeString} value={this.props.metricCalcID}>{typeString}</button>
        )
    }
}

// Represents entry form component. 
// This component will take in input from the user
// for data entry. 
export class DataEntryForm extends Component {
    componentDidMount() {
    }

    componentDidUpdate() {
    }

    timeDisplayType(selectTf) {
        let x = null
        switch ((selectTf)) {
            case "metricGoalsMonth":
                x = (
                    <p>Month: <b>{this.props.tfValue}</b></p>
                )
                break;
            case "metricGoalsQuarters":
                x = (
                    <p>Quarter: <b>{this.props.tfValue}</b></p>
                )
                break;
            case "metricGoalsAnnuals":
                let year = new Date()
                year = year.getFullYear()
                x = (
                    <p>Annual: {year} </p>
                )
                break;
        }
        return x
    }

    test(value) {
        let x = null
            switch (value) {
                case "1":
                    x = "January";
                    break;
                case "2":
                    x = "February";
                    break;
                case "3":
                    x = "March";
                    break;
                case "4":
                    x = "April";
                    break;
                case "5":
                    x = "May";
                    break;
                case "6":
                    x = "June"
                    break;
                case "7":
                    x = "July";
                    break;
                case "8":
                    x = "August"
                    break;
                case "9":
                    x = "September"
                    break;
                case "10":
                    x = "October"
                    break;
                case "11":
                    x = "November"
                    break;
                case "12":
                    x = "December"
                    break;
            }
        return x
    }

    render() {
        let content = null
        let timeDisplay = this.props.timeDisplay(this.props.selectTF)
        let dataDisplay = this.props.dataDisplay(this.props.selectedMetricAreaCalculationDataType)
        let timeDisplayType = this.timeDisplayType(this.props.selectTF)
        let selectTimeDisplay = null
        
        let monthDisplay = this.test(this.props.tfValue.toString())
        let highlight = this.props.highlight !== "" ? <div style={{display:"inline-block"}}>{this.props.highlight}</div> : <div>No highlights</div>

        // Will switch content to be the preview
        if (this.props.preview) {
            content = (
                <div>
                    <div>
                        <h2> Summary of Entered Data </h2>
                        <p>Metric Area: <b>{this.props.metricAreaName}</b></p>
                        <p>Metric: <b>{this.props.selectedMetricAreaCalculationName}</b></p>
                        {timeDisplayType}
                        <p>Data Type (Actual/Target): <b>{this.props.radio}</b></p>
                        <p>Data: <b>{this.props.data}</b></p>
                        <div style={{display:"inline-block"}}><p>Highlight: <b style={{display:"inline-block"}}>{highlight}</b></p></div>
                        <p>Lowlight: <b>{this.props.lowlight}</b></p>
                        <p>Month: <b>{monthDisplay}</b></p>
                        <p>Mitigation Plan: <b>{this.props.mitigation}</b></p>
                    </div>
                    <button class="preview"
                        onClick={(e) => this.props.editForm(e)}>Edit Data</button>
                    <button class="preview"
                        onClick={() => this.props.submitForm(this.props.tfValueYear, this.props.selectedMetricAreaCalculationDataType, this.props.selectTF, this.props.tfValue, this.props.selectedMetricAreaCalculations,
                            this.props.radio, this.props.data, this.props.highlight,
                            this.props.lowlight, this.props.mitigation)}>
                        Submit
                    </button>
                    <p>
                        {this.props.noActual}
                    </p>
                    <p>
                        {this.props.dataSubmitted}
                    </p>
                </div>
            )
        } else {
            if (this.props.targetEn || this.props.adminPermissions) {
                selectTimeDisplay = (
                    <div>
                        <h2 className="InputOption">Select a Time Frame <span class="required">*</span> </h2>
                        <select
                            onChange={(e) => this.props.updateChange(e)} name="selectTF">
                            <option value="metricGoalsMonths">Month</option>
                            <option value="metricGoalsQuarters">Quarter</option>
                            <option value="metricGoalsAnnuals">Annual</option>
                        </select>
                        {timeDisplay}
                    </div>
                )
            } else if (this.props.actualEn) {
                if (this.props.selectTF === "metricGoalsAnnuals") {
                    dataDisplay = (
                        <div>
                            Cannot enter actuals for annual information.
                        </div>
                    )
                } else {
                    selectTimeDisplay = (
                        <div>
                            <p>
                                Inserting actual data for the previous month
                            </p>
                        </div>
                    )
                }
            }
            content = (
                <div>
                    <form>
                        <h2 class='InputOption'> Select a Data Type <span class="required">*</span> </h2>
                        <div class='CheckBoxes'>
                            <div class='check-one'>
                                <input class='box' type="checkbox" id="Target" name="Target" value="Target" onChange={(e) => this.props.updateTCheckForm(e)}
                                    checked={this.props.targetEn}
                                />
                                <label class='check' for="Target">Target </label>
                            </div>
                            <div class='check-one'>
                                <input class='box' type="checkbox" id="Actual" name="Actual" value="Actual" onChange={(e) => this.props.updateACheckForm(e)}
                                    checked={this.props.actualEn}
                                />
                                <label class='check' for="Actual">Actual</label>
                            </div>
                        </div>
                        <div>
                        <p>
                                {this.props.actualDisabledMsg}
                            </p>
                        </div>
                        <div>
                            <p className="invalidError">
                                {this.props.invalidRadio}
                            </p>
                        </div>
                        {selectTimeDisplay}

                        <p className="invalidError">
                            {this.props.invalidTime}
                        </p>

                        {dataDisplay}
                        <div>
                            <p className="invalidError">
                                {this.props.invalidData}
                            </p>
                        </div>
                        <p class='textInput'>
                            <label for="lname">Highlights</label>
                            <textarea
                                placeholder="Write about what went well..."
                                onChange={(e) => this.props.updateChange(e)}
                                value={this.props.highlight} type="text" id="form" name="highlight" />
                        </p>
                        <p class='textInput'>
                            <label for="lname">Lowlights </label>
                            <textarea
                                placeholder="Write about what did not go well..."
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