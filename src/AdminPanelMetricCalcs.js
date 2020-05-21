import React, { Component } from 'react';
import './css/AdminPanelMetricCalcs.css';
import './index.js';

import { AdminPanelNav } from './AdminPanel'
import firebase from 'firebase/app';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminPanelMetricCalcs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: ""
        }
    }

    metricAreaItemsList() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            return <MetricAreaItem
                metricValue={key[1].metricName}
                metricID={key[1].metricID}
                metricFunc={this.updateChange}
            />
        })
        return metricAreaElements
    }

    updateME(event) {
        let area = event.target.value
        this.setState((state) => {
            state.current = area
        })
    }

    handleChange = (event) => {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    addCalculation() {
        console.log(this.state)
        let ref = firebase.database().ref('metricCalculations')
        let id = ref.push().getKey()
        firebase.database().ref('metricCalculations/' + id.toString()).update({
            calcName: this.state.calcName,
            calcMetric: this.state.calcName,
            calcID: id,
            metricAreaID: this.state.current
        })
    }

    render() {
        const metricAreaItemsList = this.metricAreaItemsList()

        return (
            <div className="body">
                <AdminPanelNav />
                <main>
                <h1 class="ASettingsTitle"> Metric Calculations </h1>
                    <div class="main-content">
                        <div>
                            <h2 className= "selectMetric">Select a Metric Area</h2>

                            <select id="select-dropdown"
                                onChange={(e) => this.updateME(e)}>
                                <option value="None">None</option>
                                {metricAreaItemsList}
                            </select>
                            <h2 className="metricC">Metric Calculations</h2>
                            <div id="calcForm">
                                <form>
                                    <label for="fname">Enter a Calculation Name </label>
                                    <textarea
                                        onChange={(e) => this.handleChange(e)}
                                        type="text" id="form" name="calcName" />
                                </form>
                                {/* <form>
                                    <label for="fname">Enter a calculation metric </label>
                                    <textarea
                                        onChange={(e) => this.handleChange(e)}
                                        type="text" id="form" name="calcMetric" />
                                </form> */}
                                <button className="save2" onClick={() => this.addCalculation()}>Add Calculation</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

class MetricAreaItem extends Component {
    render() {
        return (
            <option value={this.props.metricID}>
                {this.props.metricValue}
            </option>
        )
    }
}