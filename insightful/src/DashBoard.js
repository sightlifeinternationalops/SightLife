import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { Table, Button, ButtonGroup, ButtonToolbar} from 'reactstrap';
import {Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';

import './index.js';
import './css/DashBoard.css';

export class DashBoard extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(        
            <div className = "body">
            <h1> METRIC AREA NAME INSERT HERE </h1>
            <h2> Metric Area Summary </h2>
            <h3> Owner: INSERT HERE </h3>

            <Table bordered align="center">
                <thead>
                    <tr>
                    <th> Metric Calculations </th>
                    <th> Metric</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Direct Skills Adoption Post Course </td>
                        <td>CDS Surgeon NPS</td>
                    </tr>
                    
                    <tr>
                        <td>Total number of surgeons & opthalmologists trained (all levels)</td>
                        <td> # Trained - surgeons / opthalmologists</td>
                    </tr>

                    <tr>
                        <td>Surgeon / Opthalmologists Satisfaction Rate</td>
                        <td> NPS Score </td>
                    </tr>
                  
                </tbody>
            </Table>


        </div>
        )
    }
}