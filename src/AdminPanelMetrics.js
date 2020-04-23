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

        this.state = {
            display : "none"
        }
    }

    // Load currently archived metric areas
    componentDidMount() {

    }

    // Represents metric area elements to render on page.
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

    // Archives a metric area element
    archiveMetricArea() {

    }

    // Renders archived metric area elements on the page.
    archivedMetricAreaElements() {

    }

    // Retrieves archived metric area elements from Firebase
    getArchivedMetricAreaElements() {

    }

    // Adds a new metric area element to Firebase
    addMetricAreaElement() {
        let rootPath = firebase.database().ref('metricAreas')
        rootPath.once('value', (snapshot) => {

        })
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
    submitForm(e) {
        e.preventDefault()
        console.log(this.state)
        let newMetricArea = {
            metricName : this.state.MetricName
        }
        if (e.target != null) {
            let rootPath = firebase.database().ref('metricAreas')
            rootPath.push(newMetricArea)
        } else {
            console.log(e.error)
        }
    }

    addForm() {
        let form = (
            <div id="metricForm" style={
             {display: this.state.display}
            }>
                <form id="metricBox">
                {/* <form> */}
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

    render() {
        const metricAreaElements = this.metricAreaElements()
        let form = this.addForm()

        return (
            <div className="body">
                <main>
                    <AdminPanelNav />
                    <div class="main_content">
                        <div>
                            <CardDeck className="PermDatadeck">
                                <h1 class='selection' id='met-areas'> Metric Areas 
                                <button 
                                    onClick={() => this.renderModal()}>
                                    <img class='more' src={More} /></button> </h1>
                                {metricAreaElements}
                            </CardDeck>
                        </div>
                        <div>
                            {/* Archived Metric Areas */}
                            <CardDeck className="PermDatadeck">
                                <h1> Archived Metric Areas </h1>
                            </CardDeck>
                        </div>
                        {form}
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
            // onClick={() => this.props.metricFunc(this.props.metricName, this.props.metricID)}
            >
                {typeString}
            </button>
        )
    }
}