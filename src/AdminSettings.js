import React, { Component } from 'react';
import './css/AdminSettings.css';
import Switch from "react-switch";
import { AdminPanelNav } from './AdminPanel';
import Off from './img/toggle.svg';
import On from './img/switch.svg'
import firebase from 'firebase/app';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminSettings extends Component {
    constructor(props) {
        super(props)

        this.removeAdmin = this.removeAdmin.bind(this)
        this.handleAToggle = this.handleAToggle.bind(this)
        this.handleTToggle = this.handleTToggle.bind(this)

        this.state = {
            enableEdit: false,
            modalDisplay: "none",
            currentAdmins: new Map(),
            currentUsers: new Map()
        }
    }

    componentDidMount() {
        this.retrieveAdminUsers()
        this.retrieveActualSettings()
        this.retrieveTargetSettings()
        console.log(this.props)
    }

    componentDidUpdate() {
        // console.log(this.state)
        // this.retrieveAdminUsers()
    }

    retrieveAdminUsers() {
        let rootPath = firebase.database().ref('admins')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()
            let usersMap = new Map()

            // If the admins reference exists in the database
            // or if something exists in the database for admins
            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    usersMap.set(key, [info[key].userMetricID, info[key].adminName, info[key].adminID])
                })
            }

            this.setAdminUsers(usersMap)
        })
    }

    setAdminUsers(users) {
        this.setState((state) => {
            state.currentAdmins = users
            state.submissionSaved = ""
            return state
        })
    }

    renderAdminUsers() {
        const adminElements = Array.from(this.state.currentAdmins.entries()).map((key) => {
            // console.log(key)
            return <AdminItem
                admin={key[1][1]}
                adminID={key[1][2]}
                userID={key[1][0]}
                removeAdmin={this.removeAdmin}
                enableEdit={this.state.enableEdit}
            />
        })
        return adminElements
    }

    removeAdmin(removedAdmin) {
        let usersMap = this.state.currentAdmins
        usersMap.delete(removedAdmin)
        this.setAdminUsers(usersMap)
    }

    editAdminInfo() {
        this.setState((state) => {
            state.enableEdit = true
            return state
        })
    }

    // Renders modal form for adding users
    openModal() {
        this.setState((state) => {
            this.state.modalDisplay = "block"
            return state
        })
    }

    // Closes modal form for adding users
    closeForm(e) {
        e.preventDefault()
        this.setState((state) => {
            state.modalDisplay = "none"
            return state
        })
    }

    addOwner(e) {
        e.preventDefault()
        let admins = this.state.currentAdmins
        // console.log(admins)

        var test

        // console.log(test)
        // If the user does not exist, add them to the owners
        if (!test) {
            let rootString = firebase.database().ref('admins/' + this.state.currentUserID)
            // let rootString = firebase.database().ref('admins/')
            let id = rootString.push().getKey()

            let userArray = [
                this.state.currentUserID,
                this.state.currentUserName,
                id
            ]

            let usersMap = this.state.currentAdmins
            usersMap.set(id, userArray)
            this.setAdminUsers(usersMap)
            this.closeForm(e)
        } else {
            // Need to make a error display 
            console.log("Selected user is already an admin!")
            this.setState((state) => {
                state.userExists = "User is already an admin"
                return state
            })
        }
    }

    // Check if the selected user already exists
    // If the user is already an admin, notify the system
    adminExists() {
        let admins = this.state.currentAdmins
        // console.log(admins)
        admins.forEach((key) => {

            console.log(key)

            if (key[0] === this.state.currentUserID) {
                console.log("test")
                return true
            } else {
                return false
            }
        })
    }

    // Put in app and send down
    cancelEdit() {
        this.setState((state) => {
            state.enableEdit = false
            return state
        })
    }

    // Handles changes for 
    handleChange = (event) => {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    // Update the currently selected user
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

    // Returns all current users in SightLife as 
    // <option> elements
    usersList() {
        const usersElements = Array.from(this.props.users.entries()).map((key) => {
            let name = key[1].fName + " " + key[1].lName
            return <UserItem
                name={name}
                uid={key[1].uid}
            />
        })
        return usersElements
    }

    addForm() {
        let usersList = this.usersList()
        let form = (
            <div
                id="formOne"
                style={{ display: this.state.modalDisplay }}>
                <div>
                    <form id="formBox">
                        <h2>Select an Admin</h2>
                        <div>
                            <label>
                                <select
                                    onChange={(e) => this.updateUser(e)}>
                                    <option value="None" disabled selected>Select a user</option>
                                    {usersList}
                                </select>
                            </label>

                            <button className="addAdmin"
                                onClick={(e) => this.addOwner(e)}>
                                Submit
                            </button>

                            <button className="close-button"
                                onClick={(e) => this.closeForm(e)}>
                                X
                    </button>
                        </div>
                    <div>
                        {this.state.userExists}
                    </div>
                    </form>
                </div>
            </div>
        )
        return form
    }

    handleAToggle(actualToggle) {
        // firebase.database().ref('dataEntrySettings').update({
        //     actualEnabled: actualToggle
        // })
        this.setState((state) => {
            state.actualToggle = actualToggle
            state.submissionSaved = ""
            return state
        })
    }

    handleTToggle(targetToggle) {
        // firebase.database().ref('dataEntrySettings').update({
        //     targetEnabled: targetToggle
        // })
        this.setState((state) => {
            state.targetToggle = targetToggle
            state.submissionSaved = ""
            return state
        })
    }

    retrieveActualSettings() {
        let actual = null
        let actualSettings = firebase.database().ref('dataEntrySettings/actualEnabled')
        actualSettings.once('value', (snapshot) => {
            let info = snapshot.val()
            actual = info
            this.setState((state) => {
                state.actualToggle = actual
                return state
            })
        })
    }

    retrieveTargetSettings() {
        let target = null
        let targetSettings = firebase.database().ref('dataEntrySettings/targetEnabled')
        targetSettings.once('value', (snapshot) => {
            let info = snapshot.val()
            target = info
            this.setState((state) => {
                state.targetToggle = target
                return state
            })
        })
    }

    saveSettings() {
        var admins = {}

        Array.from(this.state.currentAdmins.entries()).map((key) => {
            console.log(key)
            admins[key[0]] = {
                adminID: key[1][2],
                userMetricID: key[1][0],
                adminName:  key[1][1],
            }
        })

        console.log(admins)

        firebase.database().ref().update({
            admins
        })

        firebase.database().ref("dataEntrySettings").update({
            actualEnabled: this.state.actualToggle,
            targetEnabled: this.state.targetToggle
        })

        this.setState((state) => {
            state.submissionSaved = "Succesfully saved settings!"
            return state
        })

    }

    render() {
        let content = null
        let form = this.addForm()
        const adminElements = this.renderAdminUsers()

        // if (this.state.enableEdit) {
            content = (
                <div class="adminButtons">
                    <button className="addAdmin"
                        onClick={() => this.openModal()}>
                        Add Admin
                    </button>

                    {/* <button className="cancel"
                        onClick={() => this.cancelEdit()}>
                        Cancel
                    </button> */}
                </div>
            )
        // } else {
        //     content = (
        //         <div class="adminButtons">
        //             <button
        //                 className="save2"
        //                 value="test"
        //                 onClick={() => this.editAdminInfo()}>
        //                 Edit Admins
        //         </button>
        //         </div>
        //     )
        // }

        return (
            <div className="body">
                <AdminPanelNav />
                <main>
                    <h1 class="ASettingsTitle"> Settings </h1>

                    <div class="main-content">
                        <div class="columnSettings">
                            <section class="PermInfo">
                                <div class="PermissionBox">
                                    <h3 class='PermissionText'> Admin Information </h3>
                                </div>
                                <div class="PermissionInfo">
                                    <p class="PermText2"> Admin(s) </p>
                                    <div id="ownerElements">
                                        <ul>
                                            <div id="test">
                                                {adminElements}
                                            </div>
                                        </ul>
                                    </div>
                                    {content}
                                </div>
                            </section>
                        </div>

                        {form}

                        <div id="dataSettings" class="columnSettings">
                            <section class="PermInfo">
                                <div class="PermissionBox">
                                    <h3 class='PermissionText'> Data Entry Form Settings </h3>
                                </div>

                                <div class="PermissionInfo">
                                    <div id="entryFormSettings">
                                        <label>
                                            <span>Data Entry for Actuals:</span></label>
                                        <Switch
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            onChange={this.handleAToggle}
                                            checked={this.state.actualToggle}
                                            className="react-switch"
                                        />
                                        <label>
                                            <span>Data Entry for Targets:</span></label>
                                        <Switch
                                            className="react-switch"
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            onChange={this.handleTToggle}
                                            checked={this.state.targetToggle}
                                        />
                                    </div>
                                </div>

                            </section>
                        </div>

                        <div class='Save2Button'>
                            <button
                                onClick={() => this.saveSettings()}
                                class='save2' type="Save" value="Save"> Save </button>
                        </div>
                        <div style={{textAlign:"center"}}>
                            {this.state.submissionSaved}
                        </div>
                    </div>

                </main>
            </div>
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

class AdminItem extends Component {
    render() {
        let button =
            <button className="remove"
                onClick={() => { this.props.removeAdmin(this.props.adminID) }}>-
        </button>

        return (
            <li className="test">
                {this.props.admin}
                {button}
            </li>
        )
    }
}