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

        this.state = {
            currentMetricA: "N/A",
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
        let userMap = new Map()
        let rootPath = firebase.database().ref('metricAreas/' + mName)
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val();
            let keys = Object.keys(info);
            keys.map((key) => {
                userMap.set(key, info[key])
            })
        })

        let metricAreaOwners = Array.from(userMap.entries()).map((key) => {
            return key
        })

        let userArray = null

        if (metricAreaOwners.size > 0) {
            let info = metricAreaOwners[1]
            let userObject = info[1]
            if (userObject) {
                userArray = Object.values(userObject)
            }
        }


        this.setState((state) => {
            state.currentMetricAOwners = userMap
            state.currentMetricAOwnersArray = userArray
            state.currentMetricA = mName
            state.enableEdit = false
            return state
        })
    }

    metricAreaOwners() {
        if (this.state.currentMetricAOwners.size > 0) {
            const metricAreaOwners = Array.from(this.state.currentMetricAOwners.entries()).map((key) => {
                return key
            })
            let info = metricAreaOwners[1]
            let userObject = info[1]
            console.log(userObject)
            if (userObject) {
                let userArray = Object.values(userObject)
                // for (var object in userArray) {
                //     console.log(userArray[object])
                //     return 
                // }
                console.log("test")
                this.setState((state) => {
                    state.userArray = userArray
                })
            }
        }
    }

    editMetricOwners() {
        if (this.state.currentMetricA !== "N/A") {
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
                style={{display: this.state.modalDisplay}}>
                <form id="addUserBox">
                    <div>
                        <h2>Adding Metric Owner</h2>
                        <label>
                            <input
                            onChange={(e) => this.handleChange(e)}
                            type="text" name="addMetricOwner"/>
                        
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
        let rootPath = firebase.database().ref('metricAreas/'+ this.state.currentMetricA + '/owners')
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
        console.log(this.state)
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

    metricAreaOwners() {
        if (this.state.currentMetricAOwners.size > 0) {
            const metricAreaOwners = Array.from(this.state.currentMetricAOwners.entries()).map((key) => {
                return key
            })
            let info = metricAreaOwners[1]
            let userObject = info[1]
            console.log(userObject)
            if (userObject) {
                let userArray = Object.values(userObject)
                // for (var object in userArray) {
                //     console.log(userArray[object])
                //     return 
                // }
                console.log("test")
                this.setState((state) => {
                    state.userArray = userArray
                })
            }
        }
    }

    render() {
        const metricAreaElements = this.metricAreaElements()
        const metricAreaOwners = this.metricAreaOwners()
        let form = this.addForm()

        let content = null

        if (!this.state.enableEdit) {
            content = (
                <div>
                    <p class="PermText"> Owner(s): No Current Owners </p>
                    <p class="PermText"> Data Entry For Target:  TOGGLE SWITCH HERE </p>
                    <button class='save'
                        type="Save"
                        value="Save"
                        onClick={() => { this.editMetricOwners() }}> Edit </button>
                </div>
            )
        } else {
            content = (
                <div>
                    <p class="PermText">Owner(s):</p>
                    <ul>
                        {metricAreaOwners}
                    </ul>
                    <button 
                        onClick={() => {this.addOwnerModal()}}
                        class='save'>Add Owner</button>
                    <button 
                        onClick={() => { this.cancelMetricOwners()}}
                        class='save'>Cancel</button>
                </div>
            )
        }

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

                        <div class="column">
                            <div class="PermInfo">
                                <div class="PermissionBox">
                                    <h3 class='PermissionText'> {this.state.currentMetricA} </h3>
                                </div>
                                <div class="PermissionInfo">
                                    {content}
                                </div>
                            </div>
                        </div>
                        {form}
                    </div>
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