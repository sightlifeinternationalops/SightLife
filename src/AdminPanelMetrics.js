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
                metricName={key[1].metricName}
                metricID={key[1].metricID}
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
                metricID: id
            })
            this.closeModal(e)
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

    // editMetricArea() {
    //     let editForm = (
    //         <div style={{display: this.state.editDisplay}}>
    //             <form id="metricBox">
    //                 <div>
    //                     <h3>Metric: </h3>
    //                     <ul>
                            
    //                     </ul>
    //                 </div>  
    //             </form>
    //         </div>
    //     )
    //     return editForm
    // }

    render() {
        const metricAreaElements = this.metricAreaElements()
        let form = this.addForm()
        // let editForm = this.editMetricArea() 

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
                        {/* {editForm} */}
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