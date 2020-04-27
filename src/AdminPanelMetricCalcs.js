import React, { Component } from 'react';
import './css/AdminPanelMetricCalcs.css';
import './index.js';

import { AdminPanelNav } from './AdminPanel'
import { CardDeck } from 'reactstrap';
import More from './img/more.svg';
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
                metricValue={key[0]}
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
        firebase.database().ref('metricCalculations/' + this.state.calcName).update({
            calcName: this.state.calcName,
            calcMetric: this.state.calcMetric,
            metricArea: this.state.current
        })
    }

    render() {
        const metricAreaItemsList = this.metricAreaItemsList()

        return (
            <div className="body">
                <main>
                    <AdminPanelNav />
                    <div class="main_content">
                        <div>
                            <h2>Select a Metric Area</h2>

                            <select id="select-dropdown"
                                onChange={(e) => this.updateME(e)}>
                                <option value="None">None</option>
                                {metricAreaItemsList}
                            </select>
                            <h2>Metric Calculations</h2>
                            <div id="calcForm">
                                <form>
                                    <label for="fname">Enter a calculation name </label>
                                    <textarea
                                        onChange={(e) => this.handleChange(e)}
                                        type="text" id="form" name="calcName" />
                                </form>
                                <form>
                                    <label for="fname">Enter a calculation metric </label>
                                    <textarea
                                        onChange={(e) => this.handleChange(e)}
                                        type="text" id="form" name="calcMetric" />
                                </form>
                                <button onClick={() => this.addCalculation()}>Add Calculation</button>
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
            <option value={this.props.metricValue}>
                {this.props.metricValue}
            </option>
        )
    }
}