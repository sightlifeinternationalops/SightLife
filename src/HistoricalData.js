import React, { Component } from 'react';
import {Table, Column, Cell} from 'reactstrap';
import './css/HistoricalData.css';
import './index.js';

export class  HistoricalData extends Component {
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