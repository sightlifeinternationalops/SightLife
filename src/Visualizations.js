import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/HistoricalData.css';
import './index.js';
import firebase from 'firebase/app';
import { DashBoard, YearElement } from './VisualizationsDashboard';


export class Visualizations extends Component {
    constructor(props) {
        super(props);

        let year = new Date()
        year = year.getFullYear().toString()

        this.retrieveInfo = this.retrieveInfo.bind(this)
        this.handleCalChange = this.handleCalChange.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.goBack = this.goBack.bind(this)

        this.state = {
            // Data to be passed into metric calculations
            // Represents metricAreaName
            metricAreaInfo: null,   // Contains metric area name
            metricAreaOwner: null,  // Contains metric area owner name
            metricAreaCalculations: new Map(), // Represents all calculations for a metric area
            metricAreaCalculationIDs: [],
            dashboardEnabled: false,

            // Dashboard State Items
            currentYear: year,
            monthsYearsMap: new Map(),
            quartersYearsMap: new Map(),
            annualsYearsMap: new Map(),
            selectedYearMap: new Map(),
            selectedQuarterMap: new Map(),
            selectedAnnualMap: new Map()
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    // Renders metric area cards 
    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaCard
                metricName={key[1].metricName}
                metricID={key[1].metricID}
                metricNameFunc={this.retrieveInfo}
            />
        })
        return metricAreaElements
    }

    retrieveInfo(name, id) {
        let rootPath = firebase.database().ref('metricCalculations')

        rootPath.once('value', (snapshot) => {
            let metricCalcInfo = snapshot.val();
            let databaseKeys = Object.keys(metricCalcInfo);
            let mapCalculations = new Map()

            databaseKeys.map((key) => {
                let Mid = metricCalcInfo[key].metricAreaID
                if (id === Mid) {
                    mapCalculations.set(key, metricCalcInfo[key])
                }
            })
            console.log(mapCalculations)
            this.setInfo(mapCalculations, name, id)
        });
    }

    // Callback to render new information
    setInfo(mapCalculations, name, id) {
        this.setState((state) => {
            state.metricAreaCalculations = mapCalculations
            state.dashboardEnabled = true
            state.metricAreaID = id
            state.metricAreaInfo = name
            return state
        })
    }

    goBack(e) {
        e.preventDefault()
        this.setState((state) => {
            state.dashboardEnabled = false
            state.monthsYearsMap = new Map()
            state.quartersYearsMap = new Map()
            state.annualsYearsMap = new Map()
            state.selectedYearMap = new Map()
            state.selectedQuarterMap = new Map()
            state.selectedAnnualMap = new Map()
            return state
        })
    }

    handleCalChange = (event) => {
        let area = event.target.value
        const selected = event.target.options.selectedIndex
        let field = (event.target.options[selected].getAttribute('id'))
        if (this.state.currentCalc && this.state.selectedYear && this.state.currentCalcID) {
            this.informationMonthRerender(area, field, "metricGoalsMonths", this.state.selectedYear)
            this.informationQuarterRerender(area, field, "metricGoalsQuarters", this.state.selectedYear)
            this.informationAnnualRerender(area, field, "metricGoalsAnnuals", this.state.selectedYear)
        } else {
            let area = event.target.value
            this.informationMonth(area, field, "metricGoalsMonths")
            this.informationQuarter(area, field, "metricGoalsQuarters")
            this.informationAnnuals(area, field, "metricGoalsAnnuals")
        }
    }

    // Accepts two parameters,
    // id and path, where id
    // is the selected metric calculation id and
    // path is the path to the specified times.
    // Returns a map containing all information across years
    // for that specific calculation id
    informationMonth(area, id, path) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }
            this.setState((state) => {
                state.currentCalc = area
                state.currentCalcID = id
                state.monthsYearsMap = infoMap
                state.selectEnable = false
                return state
            })
        })
        return infoMap
    }

    informationMonthRerender(area, id, path, year) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap = new Map()

        let selectedMonthMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }

            selectedMonthMap = infoMap.get(year)

            console.log(infoMap)
            this.setState((state) => {
                state.currentCalc = area
                state.currentCalcID = id
                state.monthsYearsMap = infoMap
                state.selectedYearMap = selectedMonthMap
                return state
            })
        })
        return infoMap
    }

    informationQuarter(area, id, path) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }
            this.setState((state) => {
                state.quartersYearsMap = infoMap
                return state
            })
        })
        return infoMap
    }

    informationQuarterRerender(area, id, path, year) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap = new Map()

        let selectedQuarterMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }

            selectedQuarterMap = infoMap.get(year)

            console.log(infoMap)
            this.setState((state) => {
                state.currentCalc = area
                state.currentCalcID = id
                state.quartersYearsMap = infoMap
                state.selectedQuarterMap = selectedQuarterMap
                return state
            })
        })
        return infoMap
    }

    informationAnnuals(area, id, path) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }
            this.setState((state) => {
                state.annualsYearsMap = infoMap
                return state
            })
        })
        return infoMap
    }

    informationAnnualRerender(area, id, path, year) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap = new Map()

        let selectedAnnualMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }


            selectedAnnualMap = infoMap.get(year)

            this.setState((state) => {
                state.currentCalc = area
                state.currentCalcID = id
                state.AnnualsYearsMap = infoMap
                state.selectedAnnualMap = selectedAnnualMap
                return state
            })
        })
        return infoMap
    }

    renderYears() {
        const test = Array.from(this.state.monthsYearsMap.entries()).map((key) => {
            return <YearElement
                year={key[0]}
                yearFunc={this.handleYearChange} />
        })
        return test
    }

    // When a year is selected,
    // retrieves information for the month, quarter, and selected year
    // and pushes changes to state
    handleYearChange(event) {
        let selectedYear = event.target.value
        let selectedYearMap = this.state.monthsYearsMap.get(selectedYear)
        let selectedQuarterMap = this.state.quartersYearsMap.get(selectedYear)
        let selectedAnnualMap = this.state.annualsYearsMap.get(selectedYear)
        this.setState((state) => {
            state.selectedYear = selectedYear
            state.selectedYearMap = selectedYearMap
            state.selectedQuarterMap = selectedQuarterMap
            state.selectedAnnualMap = selectedAnnualMap
            return state
        })
    }

    resetYears() {
        this.setState((state) => {
            state.monthsYearsMap = new Map()
        })
    }


    render() {
        const metricAreaElements = this.metricAreaElements()
        const renderYears = this.renderYears()
        console.log(renderYears)

        let content = null

        if (this.state.dashboardEnabled) {
            content = (
                <div>
                    <DashBoard
                        {...this.state}
                        handleCalChange={this.handleCalChange}
                        handleYearChange={this.handleYearChange}
                        information={this.information}
                        goBack={this.goBack}
                    />
                </div>
            )
        } else {
            content = (
                <div>
                    <h1> Visualizations </h1>
                    <CardDeck className='metricsDeck'>
                        {metricAreaElements}
                    </CardDeck>
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

class MetricAreaCard extends Component {
    render() {
        return (
            <Button className='metrics'
                onClick={() => this.props.metricNameFunc(this.props.metricName, this.props.metricID)}>
                <strong>{this.props.metricName}</strong>
            </Button>
        )
    }
}