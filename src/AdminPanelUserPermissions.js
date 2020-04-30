import React, { Component } from 'react';
import './css/AdminPanel.css';
import { AdminPanelNav } from './AdminPanel'
import firebase from 'firebase/app';

import { CardDeck } from 'reactstrap';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminPanelUserPermissions extends Component {
    constructor(props) {
        super(props)

        this.setMetricOwnerInfo = this.setMetricOwnerInfo.bind(this)
        this.editMetricOwners = this.editMetricOwners.bind(this)
        this.addOwnerModal = this.addOwnerModal.bind(this)
        this.cancelMetricOwners = this.cancelMetricOwners.bind(this)
        this.setMetricOwner = this.setMetricOwner.bind(this)

        this.state = {
            currentMetricA: "Choose a metric area",
            currentMetricAOwners: new Map(),
            modalDisplay: "none"
        }
    }

    componentDidMount() {
        this.retrieveCurrentUsers()
    }

    // Retrieves a list of all current users
    // in SightLife
    retrieveCurrentUsers() {
        let rootPath = firebase.database().ref('users')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val();
            let keys = Object.keys(info)
            let users = keys.map((key) => {
                let name = info[key].fName + " " + info[key].lName
                console.log(name)
            })
            return users
        })
    }

    // Function to be passed as onClick. 
    // Renders current information
    // for a metric area such as who owns it,
    // current metric calculations?
    setMetricOwnerInfo(mName) {
        // let userMap = new Map()
        let rootPath = firebase.database().ref('metricAreas/' + mName)
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val();
            let keys = Object.keys(info);
            let userMap = new Map()
            keys.map((key) => {
                if (key === "owners") {
                    let objectMap = info[key]
                    for (var object in objectMap) {
                        userMap.set(object, objectMap[object])
                    }
                }
            })
            this.setMetricOwner(userMap, mName)
        })
    }

    setMetricOwner(userMap, name) {
        this.setState((state) => {
            state.currentMetricA = name
            state.currentMetricAOwners = userMap
            state.enableEdit = false
            return state
        })
    }

    editMetricOwners() {
        if (this.state.currentMetricA !== "Choose a metric area") {
            this.setState((state) => {
                state.enableEdit = true
                return state
            })
        }
    }

    handleChange = (event) => {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    addForm() {
        let form = (
            <div
                id="addUserForm"
                style={{ display: this.state.modalDisplay }}>
                <form id="addUserBox">
                    <div>
                        <h2>Enter Metric Owner</h2>
                        <label>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                type="text" name="addMetricOwner" />

                        </label>
                    </div>
                    <button
                        onClick={(e) => this.submitOwnerModal(e)}>Submit</button>
                    <button
                        onClick={(e) => this.cancelOwnerModal(e)}>Cancel</button>
                </form>
            </div>
        )
        return form
    }

    // Display modal for adding owners
    addOwnerModal() {
        this.setState((state) => {
            this.state.modalDisplay = "block";
            return state
        })
    }

    // Submit new owner for a metric area
    submitOwnerModal(e) {
        e.preventDefault()
        console.log(this.state)
        let rootPath = firebase.database().ref('metricAreas/' + this.state.currentMetricA + '/owners')
        rootPath.push(this.state.addMetricOwner)
        this.cancelOwnerModal(e)
    }

    // Closes modal form
    cancelOwnerModal(e) {
        e.preventDefault()
        this.setState((state) => {
            state.modalDisplay = "none";
            return state
        })
    }

    // Cancels edit mode for metric areas
    cancelMetricOwners() {
        this.setState((state) => {
            state.enableEdit = false
            return state
        })
    }

    // Represents metric area elements to render on page.
    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a 
            // list of props containing information about that specific metric
            return <MetricAreaButton
                metricName={key[0]}
                metricID={key[1]}
                metricFunc={this.setMetricOwnerInfo}
            />
        })
        return metricAreaElements
    }

    render() {
        const metricAreaElements = this.metricAreaElements()
        let form = this.addForm()

        return (
            <div className="body">
                <main>
                    <AdminPanelNav />
                    <h1 class="ASettingsTitle"> Metric Owner Settings </h1>

                    <div class="main-content">
                        <div class="column">
                            <CardDeck className="PermDatadeck">
                                {metricAreaElements}
                            </CardDeck>
                        </div>
                        <MetricAreaInfo
                            editMetricOwners={this.editMetricOwners}
                            addOwnerModal={this.addOwnerModal}
                            cancelMetricOwners={this.cancelMetricOwners}
                            enableEdit={this.state.enableEdit}
                            currentMetricA={this.state.currentMetricA}
                            currentMetricAOwners={this.state.currentMetricAOwners}
                            setMetricOwner={this.setMetricOwner}/>
                        {form}
                    </div>
                </main>
            </div>
        )
    }
}

class MetricAreaInfo extends Component {
    // Represents metric area owners to render.
    metricAreaOwners() {
        const metricAreaOwners = Array.from(this.props.currentMetricAOwners.entries()).map((key) => {
            return <MetricAreaOwner
                owner={key[1]}
            />
        })
        return metricAreaOwners
    }

    render() {
        const metricAreaOwners = this.metricAreaOwners()
        let content = null

        if (!this.props.enableEdit) {
            content = (
                <div>
                    {/* <p class="PermText"> Data Entry For Target:  TOGGLE SWITCH HERE </p> */}
                    <button class='save'
                        type="Save"
                        value="Save"
                        onClick={() => { this.props.editMetricOwners()}}> Edit </button>
                </div>
            )
        } else {
            content = (
                <div>
                    <button
                        onClick={() => { this.props.addOwnerModal() }}
                        class='save'>Add Owner</button>
                    <button
                        onClick={() => { this.props.cancelMetricOwners() }}
                        class='cancel'>Cancel</button>
                </div>
            )
        }

        return (
            <div class="column">
                <div class="PermInfo">
                    <div class="PermissionBox">
                        <h3 class='PermissionText'> {this.props.currentMetricA} </h3>
                        {/* <h3 class='PermissionText'> Test </h3> */}
                    </div>
                    <div class="PermissionInfo">
                        <p class="PermText">Owner(s):</p>
                        <ul   id="owners">
                            <div  id="listitem">
                            {metricAreaOwners}
                            </div>
                        </ul >
                        {content}
                    </div>
                </div>
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
                onClick={() => this.props.metricFunc(typeString)}
            >
                {typeString}
            </button>
        )
    }
}

// Represents a single metric area owner.
class MetricAreaOwner extends Component {
    render() {
        return (
            <li>{this.props.owner}</li>
        )
    }
}