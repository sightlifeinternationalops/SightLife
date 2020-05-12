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
            display : "none",
            modalDisplay: "none",
            archivedElements: new Map()
        }
    }

    // Load currently archived metric areas
    componentDidMount() {
        this.retrieveArchivedMetricAreaElements()
    }

    // Represents metric area elements to render on page.
    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[1].metricName}
                metricID={key[1].metricID}
                metricFunc={this.retrieveMetricInfo}
            />
        })
        return metricAreaElements
    }

    // Renders archived metric area elements on the page.
    archivedMetricAreaElements() {

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
            firebase.database().ref('metricAreas/' + id.toString()).update({
                metricName: this.state.MetricName,
                metricID: id,
                metricActualEnabled: false, // Default is false, prevents users from altering actuals
                metricArchived: false
            })
            this.closeModal(e)
        } else {
            console.log(e.error)
        }
    }

    addForm() {
        let form = (
            <div className="metricForm" style={
             {display: this.state.display}
            }>
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
                        onClick={(e) => this.submitForm(e)}
                    >Submit</button>
                    <button 
                        onClick={(e) => this.closeModal(e)}>Cancel</button>
                </form>
            </div>
        )
        return form
    }

    editMetricArea() {
        let editForm = (
            <div 
                className="metricForm"
                style={{display: this.state.modalDisplay}}>
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
                    <button
                        onClick={(e) => this.archiveMetricAreaElement(e)}>
                        Archive
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
                    <div class="main_content">
                        <div>
                            <CardDeck className="PermDatadeck">
                                <h1 class='selection' id='met-areas'> Metric Areas 
                                <button
                                    id="addMetricAreaButton" 
                                    onClick={() => this.renderModal()}>
                                    <img class='more' src={More} /></button> </h1>
                                {metricAreaElements}
                            </CardDeck>
                        </div>
                        <div>
                            {/* Archived Metric Areas */}
                            <CardDeck className="PermDatadeck">
                                <h1 class='selection' id='met-areas'> Archived Metric Areas </h1>
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