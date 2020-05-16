import React, { Component } from 'react';
import './css/AdminPanel.css';
import { AdminPanelNav } from './AdminPanel'
import firebase from 'firebase/app';
import Switch from "react-switch";

import { CardDeck, ListGroup, ListGroupItem } from 'reactstrap';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminPanelUserPermissions extends Component {
    constructor(props) {
        super(props)

        this.setMetricOwnerInfo = this.setMetricOwnerInfo.bind(this)
        this.editMetricOwners = this.editMetricOwners.bind(this)
        this.addOwnerModal = this.addOwnerModal.bind(this)
        this.cancelMetricOwners = this.cancelMetricOwners.bind(this)
        this.setMetricOwner = this.setMetricOwner.bind(this)
        this.removeMetricOwner = this.removeMetricOwner.bind(this)

        this.state = {
            currentMetricA: null,
            currentMetricAOwners: new Map(),
            modalDisplay: "none",
            ownersDisplay: "none"
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
            })
            return users
        })
    }

    // Function to be passed as onClick. 
    // Renders current information
    // for a metric area such as who owns it,
    // current metric calculations?
    setMetricOwnerInfo(mID, mName) {
        // let userMap = new Map()
        let rootPath = firebase.database().ref('metricAreas/' + mID)
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val();
            let keys = Object.keys(info);
            let userMap = new Map()
            // is this loop necessary?
            keys.map((key) => {
                if (key === "owners") {
                    let objectMap = info[key]
                    for (var object in objectMap) {
                        console.log(object)
                        userMap.set(object, objectMap[object].userName)
                    }
                }
            })
            this.setMetricOwner(userMap, mName, mID)
        })
    }


    setMetricOwner(userMap, name, mID) {
        this.setState((state) => {
            state.currentMetricA = name
            state.currentMetricID = mID
            state.currentMetricAOwners = userMap
            state.enableEdit = false
            state.ownersDisplay = "block"
            return state
        })
    }

    setMetricOwners(owners) {
        this.setState((state) => {
            state.currentMetricAOwners = owners
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

    removeMetricOwner(removedItem) {
        let rootPath = firebase.database().ref('metricAreas')

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val();
            let keys = Object.keys(info);

            keys.map((key) => {
                if (info[key].metricName === this.state.currentMetricA) {
                    for (var item in info[key].owners) {
                        if (info[key].owners[item].userName === removedItem) {
                            let refPath = 'metricAreas/' + this.state.currentMetricID + '/owners/' + item

                            firebase.database().ref(refPath).remove()

                            let usersInfo = this.state.currentMetricAOwners
                            usersInfo.delete(item)
                            this.setMetricOwners(usersInfo)
                        }
                    }
                }
            })
        })
    }

    handleChange = (event) => {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    updateUser(event) {
        const selected = event.target.options.selectedIndex
        let id = (event.target.options[selected].getAttribute('id'))
        let user = event.target.value
        console.log(id)
        this.setState((state) => {
            state.currentUserID = id
            state.currentUserName = user
            return state
        })
    }

    addForm() {
        const usersElements = this.userList()

        let form = (
            <div
                id="addUserForm"
                style={{ display: this.state.modalDisplay }}>
                <form id="addUserBox">
                    <div>
                        <h2>Enter Metric Owner</h2>
                        <label>
                            {/* <input
                                onChange={(e) => this.handleChange(e)}
                                type="text" name="addMetricOwner" /> */}
                            <select
                                onChange={(e) => this.updateUser(e)}>
                                <option value="None">None</option>
                                {usersElements}
                            </select>
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
        let id = rootPath.push().getKey()
        let userObject = {
            userID: this.state.currentUserID,
            userName: this.state.currentUserName,
            userMetricID: id
        }
        firebase.database().ref('metricAreas/' + this.state.currentMetricID + '/owners/' + id.toString()).update({
            userID: this.state.currentUserID,
            userName: this.state.currentUserName,
            userMetricID: id
        })

        let usersMap = this.state.currentMetricAOwners
        usersMap.set(id, userObject.userName)
        this.setMetricOwners(usersMap)
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
                metricName={key[1].metricName}
                metricID={key[1].metricID}
                metricFunc={this.setMetricOwnerInfo}
            />
        })
        return metricAreaElements
    }

    userList() {
        const usersElements = Array.from(this.props.users.entries()).map((key) => {
            let name = key[1].fName + " " + key[1].lName
            return <UserItem
                name={name}
                uid={key[1].uid}
            />
        })
        return usersElements
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
                            {...this.state}
                            editMetricOwners={this.editMetricOwners}
                            addOwnerModal={this.addOwnerModal}
                            cancelMetricOwners={this.cancelMetricOwners}
                            setMetricOwner={this.setMetricOwner}
                            removeMetricOwner={this.removeMetricOwner}
                        />
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
                enableEdit={this.props.enableEdit}
                removeMetricOwner={this.props.removeMetricOwner}
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
                    <button class='save'
                        type="Save"
                        value="Save"
                        onClick={() => { this.props.editMetricOwners() }}> <strong>Edit</strong> </button>
                </div>
            )
        } else {
            content = (
                <div>
                    <label>
                    <span> Data Entry for Actuals:</span>
                    </label>
                    <Switch/>
                    <div>
                        <button
                            onClick={() => { this.props.addOwnerModal() }}
                            class='save'><strong>Add Owner</strong></button>
                        <button
                            onClick={() => { this.props.cancelMetricOwners() }}
                            class='cancel'><strong>Cancel</strong></button>
                    </div>
                </div>
            )
        }

        return (
            <div class="column"
                style={{ display: this.props.ownersDisplay }}>
                <div class="PermInfo">
                    <div class="PermissionBox">
                        <h3 class='PermissionText'> {this.props.currentMetricA} </h3>
                    </div>
                    <div class="PermissionInfo">
                        <p class="PermText">Owner(s):</p>
                        <ul id="owners">
                            <div id="listitem">
                                <ListGroup>
                                    {metricAreaOwners}
                                </ListGroup>
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
                onClick={() => this.props.metricFunc(this.props.metricID, this.props.metricName)}
            >
                {typeString}
            </button>
        )
    }
}

// Represents a single metric area owner.
class MetricAreaOwner extends Component {
    render() {
        let button = !this.props.enableEdit ? <div></div> : <button
            onClick={() => { this.props.removeMetricOwner(this.props.owner, this.props.currentMetricA) }}>-</button>

        return (
            // <ListGroupItem>
            //     {this.props.owner}
            //     {button}
            // </ListGroupItem>
            <li>
                {this.props.owner}
                {button}
            </li>
        )
    }
}

class UserItem extends Component {
    render() {
        return (
            <option value={this.props.name} id={this.props.uid}>
                {this.props.name}
            </option>
        )
    }
}