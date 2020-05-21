import React, { Component } from 'react';
import './css/AdminSettings.css';
import { AdminPanelNav } from './AdminPanel';
import firebase from 'firebase/app';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminDataEntry extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className="body">
                <AdminPanelNav />
                <main>
                </main>
            </div>
        )
    }
}
