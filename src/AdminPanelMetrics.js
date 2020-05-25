import React, { Component } from 'react';
import './css/AdminPanelMetrics.css';
import './index.js';

import { AdminPanelNav } from './AdminPanel'
import { CardDeck } from 'reactstrap';
import More from './img/more.svg';
import firebase from 'firebase/app';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminPanelMetrics extends Component {
    constructor(props) {
        super(props);
        this.addRef = React.createRef();

        this.editMetricArea = this.editMetricArea.bind(this)
        this.closeModalE = this.closeModalE.bind(this)
        this.retrieveMetricInfo = this.retrieveMetricInfo.bind(this)

        this.state = {
            // currentMetrics: this.props.metrics,
            metrics: new Map(),
            display : "none",
            modalDisplay: "none",
            archivedElements: new Map()
        }
    }

    // Load currently archived metric areas
    componentDidMount() {
        this.retrieveArchivedMetricAreaElements()
        this.retrieveMetricsList()
    }

    // Function for retrieving existing metrics
    // Note: Separated this from renderMetricsList so that we can just
    // pass in metricArea information to our components rather
    // than retrieving everytime we need it.
    // i.e - Retrieve once as opposed to retrieve multiple times.  
    retrieveMetricsList = () => {
        let rootPath = firebase.database().ref('metricAreas')

        // Put all the metric areas in the this.state.metrics
        rootPath.once('value', (snapshot) => {
            let metricNameInfo = snapshot.val();
            let databaseKeys = Object.keys(metricNameInfo);
            let metricMap = new Map()

            databaseKeys.map((key) => {
                metricMap.set(key, metricNameInfo[key])
            })
            this.setState((state) => {
                state.metrics = metricMap;
                return state;
            })
        });
    }

    // Represents metric area elements to render on page.
    metricAreaElements() {
        const metricAreaElements = Array.from(this.state.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[1].metricName}
                metricID={key[1].metricID}
                metricFunc={this.retrieveMetricInfo}
            />
        })
        return metricAreaElements
    }

    // Retrieves archived metric area elements from Firebase
    retrieveArchivedMetricAreaElements() {
        let rootPath = firebase.database().ref('metricAreas')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()
            let metricMap = new Map()

            let keys = Object.keys(info)

            keys.map((key) => {
                console.log(key)
                console.log(info[key])
                if (info[key].metricArchived) {
                    metricMap.set(key, info[key])
                }
            })
            this.setArchivedMetricElements(metricMap)
        })
    }

    // Set archived metric area elements
    setArchivedMetricElements(metricMap) {
        this.setState((state) => {
            state.archivedElements = metricMap
            return state
        })
    }

    archiveMetricAreaElement(e) {
        e.preventDefault()
        console.log(this.state)
        if (this.state.currentmID) {
            console.log("test")
            let rootPath = firebase.database().ref('metricAreas/' + this.state.currentmID)
            rootPath.update({
                metricArchived: true
            })
        }
    }

    renderModal() {
        this.setState((state) => {
            this.state.display = "block";
            return state
        })
    }

    closeModal(e) {
        e.preventDefault()
        this.setState((state) => {
            this.state.display = "none";
            return state
        })
    }

    handleChange = (event) => {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    // Do not submit if 
    // ask for a re-confirm
    submitForm(e) {
        e.preventDefault()
        if (e.target != null) {
            let ref = firebase.database().ref('metricAreas')
            let id = ref.push().getKey()
            let metricObject = {
                metricName: this.state.MetricName,
                metricID: id,
                metricActualEnabled: false,
                metricArchived: false
            }
            firebase.database().ref('metricAreas/' + id.toString()).update({
                metricName: this.state.MetricName,
                metricID: id,
                metricActualEnabled: false, // Default is false, prevents users from altering actuals
                metricTargetEnabled: false,
                metricArchived: false
            })

            let metricsMap = this.state.metrics
            metricsMap.set(
                id, metricObject
            )
            this.setMetricsMap(metricsMap)
        } else {
            console.log(e.error)
        }
    }

    setMetricsMap(metricsMap) {
        this.setState((state) => {
            state.metrics = metricsMap
            state.display = "none"
            state.MetricName = ""
            return state
        })
    }

    addForm() {
        let form = (
            <div className="metricForm" style={ {display: this.state.display} }>
                
                <form className="metricBox">
                    <div>
                        <h2>Adding New Metric Area</h2>
                        
                        <label>
                            <input 
                            onChange={(e) => this.handleChange(e)}
                            type="text" name="MetricName"/>
                        </label>
                    </div>

                    <button
                        onClick={(e) => this.submitForm(e)}>
                        Submit
                    </button>

                    <button 
                        onClick={(e) => this.closeModal(e)}>
                        Cancel
                    </button>

                </form>
            </div>
        )
        return form
    }

    editMetricArea() {
        let editForm = (
            <div 
                className="metricForm" style={ {display: this.state.modalDisplay} }>
                
                <form className="metricBox">
                    <button 
                        onClick={(e) => this.closeModalE(e)}
                        id="close-button">
                            X
                    </button>

                    <div>
                        <h2>Current Metric: {this.state.currentmName} </h2>
                        <label>
                        <input 
                            onChange={(e) => this.handleChange(e)}
                            type="text" name="editMetricName"/>
                        </label>
                    </div>  
                    
                    <button
                        onClick={(e) => this.submitMetricInfo(e)}>
                        Save
                    </button>
                </form>
            </div>
        )
        return editForm
    }

    retrieveMetricInfo(mID, mName) {
        this.setState((state) => {
            state.modalDisplay = "block"
            state.currentmID = mID
            state.currentmName = mName
            return state
        })
    }

    submitMetricInfo(e) {
        e.preventDefault()
        if (this.state.currentmID && this.state.editMetricName) {
            let rootPath = firebase.database().ref('metricAreas/' + this.state.currentmID)
            rootPath.update({
                metricName: this.state.editMetricName
            })
        }
    }

    closeModalE(e) {
        e.preventDefault()
        this.setState((state) => {
            this.state.modalDisplay = "none"
            return state
        })
    }

    render() {
        const metricAreaElements = this.metricAreaElements()
        let form = this.addForm()
        let editForm = this.editMetricArea() 

        return (
            <div className="body">
                <main>
                    <AdminPanelNav />
                    <div class="main-content">
                        <div>
                            <CardDeck className="PermDatadeck">
                                <h1 class='selection' id='met-areas'> Metric Areas 
                                
                                <button
                                    id="addMetricAreaButton" 
                                    onClick={() => this.renderModal()}>
                                    <img class='more' src={More} />
                                    </button> </h1>
                                <div className="metricElements">
                                {metricAreaElements}
                                </div>
                            </CardDeck>
                        </div>
                        {form}
                        {editForm}
                    </div>
                </main>
            </div>
        )
    }
}

class MetricAreaButton extends Component {
    render() {
        let typeString = this.props.metricName
        return (
            <button
                class='selection'
                type={typeString}
                value={typeString}
                onClick={() => this.props.metricFunc(this.props.metricID, this.props.metricName)}
            >
                {typeString}
            </button>
        )
    }
}