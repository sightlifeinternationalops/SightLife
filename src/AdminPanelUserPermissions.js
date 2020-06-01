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
        this.handleMAToggle = this.handleMAToggle.bind(this)
        this.handleMTToggle = this.handleMTToggle.bind(this)
        this.saveChanges = this.saveChanges.bind(this)

        this.state = {
            currentMetricA: null,
            currentMetricAOwners: new Map(),
            modalDisplay: "none",
            ownersDisplay: "none"
        }
    }

    componentDidMount() {
        this.retrieveCurrentUsers()
        this.isAdmin()
    }

    componentDidUpate() {
        console.log(this.state)
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
            let mAE = info.metricActualEnabled
            let mTE = info.metricTargetEnabled

            console.log(mAE)
            console.log(mTE)

            // is this loop necessary?
            keys.map((key) => {
                if (key === "owners") {
                    let objectMap = info[key]
                    for (var object in objectMap) {
                        // userMap.set(object, objectMap[object].userName)
                        console.log(objectMap[object])
                        let userInfoArray = [objectMap[object].userID, objectMap[object].userMetricID, objectMap[object].userName]
                        userMap.set(object, userInfoArray)
                        console.log(userMap)
                    }
                }
            })
            this.setMetricOwner(userMap, mName, mID, mAE, mTE)
        })
    }


    setMetricOwner(userMap, name, mID, mAE, mTE) {
        this.setState((state) => {
            state.currentMetricA = name
            state.currentMetricID = mID
            state.currentMetricAOwners = userMap
            state.enableEdit = false
            state.metricActualEnabled = mAE
            state.metricTargetEnabled = mTE
            state.ownersDisplay = "block"
            state.submissionSaved = ""
            return state
        })
    }

    setMetricOwners(owners, id) {
        this.setState((state) => {
            state.currentMetricAOwners = owners
            state.submissionSaved = ""
            state.firebaseUID = id
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
                            // let refPath = 'metricAreas/' + this.state.currentMetricID + '/owners/' + item

                            // firebase.database().ref(refPath).remove()

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
                            <select
                                onChange={(e) => this.updateUser(e)}>
                                <option value="None">None</option>
                                {usersElements}
                            </select>
                        </label>
                    </div>
                    <button className="save"
                        onClick={(e) => this.submitOwnerModal(e)}>Submit</button>
                    <button className="close-button" id="close-buttonID"
                        onClick={(e) => this.cancelOwnerModal(e)}>X</button>
                                        <div>
                    {this.state.invalidOwner}
                </div>
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

        if (this.state.currentUserID) {
            let rootPath = firebase.database().ref('metricAreas/' + this.state.currentMetricA + '/owners')
            let id = rootPath.push().getKey()
            let userArray = [
                id,
                this.state.currentUserID,
                this.state.currentUserName
            ]
            let usersMap = this.state.currentMetricAOwners
            usersMap.set(id, userArray)
            this.setMetricOwners(usersMap, id)
            this.cancelOwnerModal(e)
        } else {
            this.setState((state) => {
                state.invalidOwner = "Please select a user."
                return state
            })
        }

    }

    saveChanges(e) {
        e.preventDefault()
        var owners = {}

        Array.from(this.state.currentMetricAOwners.entries()).map((key) => {
            owners[key[0]] = {
                userID: key[1][0],
                userMetricID: key[1][1],
                userName: key[1][2]
            }
        })

        firebase.database().ref('metricAreas/' + this.state.currentMetricID).update({
            owners
        })
        firebase.database().ref('metricAreas/' + this.state.currentMetricID).update({
            metricActualEnabled: this.state.metricActualEnabled,
            metricTargetEnabled: this.state.metricTargetEnabled
        })

        this.setState((state) => {
            state.submissionSaved = "Succesfully saved changes!"
            return state
        })
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

    handleMAToggle(metricActualEnabled) {
        // firebase.database().ref('metricAreas/' + this.state.currentMetricID).update({
        //     metricActualEnabled: metricActualEnabled
        // })
        this.setState((state) => {
            state.metricActualEnabled = metricActualEnabled
            state.submissionSaved = ""
            return state
        })
    }

    handleMTToggle(metricTargetEnabled) {
        // firebase.database().ref('metricAreas/' + this.state.currentMetricID).update({
        //         metricTargetEnabled: metricTargetEnabled
        // })
        this.setState((state) => {
            state.metricTargetEnabled = metricTargetEnabled
            state.submissionSaved = ""
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

    // Saves information
    // for whether targets and actuals
    // are enabled and sends it to Firebase
    saveAT(target, actual, id) {
        firebase.database().ref('metricAreas/' + id).update({
            metricActualEnabled: actual,
            metricTargetEnabled: target
        })
    }

    isAdmin() {
        let rootPath = firebase.database().ref('admins')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            // If the admins reference exists in the database
            // or if something exists in the database for admins
            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    if (info[key].userMetricID === this.props.user.uid) {
                        console.log("Current user is an admin")
                        this.setState((state) => {
                            state.adminPermissions = true
                            return state
                        })
                    }
                })
            }
        })
      }

    render() {
        const metricAreaElements = this.metricAreaElements()
        let form = this.addForm()
        let content = null

        if (this.props.adminPermissions) {
            content = (
                <div>
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
                            handleMAToggle={this.handleMAToggle}
                            handleMTToggle={this.handleMTToggle}
                            saveAT={this.saveAT}
                            saveChanges={this.saveChanges}
                        />
                        {form}
                    </div>
                </div>
            )
        } else {
            content = (
                <div>
                    Permissions denied.
                </div>
            )
        }

        return (
            <div className="body">
                <main>
                    {content}
                </main>
            </div>
        )
    }
}

class MetricAreaInfo extends Component {
    componentDidMount() {
        console.log(this.props)
    }

    // Represents metric area owners to render.
    metricAreaOwners() {
        const metricAreaOwners = Array.from(this.props.currentMetricAOwners.entries()).map((key) => {
            console.log(key)
            return <MetricAreaOwner
                owner={key[1][2]}
                enableEdit={this.props.enableEdit}
                removeMetricOwner={this.props.removeMetricOwner}
            />
        })
        return metricAreaOwners
    }

    render() {
        const metricAreaOwners = this.metricAreaOwners()
        let content = (
            <div id="dataEntry">
                <label>
                    <span> Data Entry for Actuals:</span>
                </label>
                <Switch
                    onChange={this.props.handleMAToggle}
                    className="react-switch"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    checked={this.props.metricActualEnabled} />
                <label>
                    <span> Data Entry for Targets:</span>
                </label>
                <Switch
                    className="react-switch"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    checked={this.props.metricTargetEnabled}
                    onChange={this.props.handleMTToggle} />
            </div>
        )
        let entryContent = null
        let buttonContent = null

        buttonContent = (
            <button className="save" onClick={(e) => this.props.saveChanges(e)}>
                Save
            </button>
        )

        entryContent = (
            <div>
                <button
                    onClick={() => { this.props.addOwnerModal() }}
                    class='save'><strong>Add Owner</strong></button>
            </div>
        )

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
                        {entryContent}
                        {content}
                        {buttonContent}
                        <div>
                            <p>
                            {this.props.submissionSaved}
                            </p>
                    </div>
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
        let button = 
            <button className="remove"
                onClick={() => { this.props.removeMetricOwner(this.props.owner, this.props.currentMetricA) }}>-</button>

        return (
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