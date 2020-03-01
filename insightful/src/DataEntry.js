import React, { Component } from 'react';
import './css/DataEntry.css';
import './index.js';

import Chevron from './img/down-arrow.png'
import { Button, ButtonGroup, ButtonToolbar, CardDeck} from 'reactstrap';

export class DataEntry extends Component {
    render() {
        return(
            <div className = "body">
                <main>
                <section class = "entry">
                    <h1> Data Entry Form </h1>

                    <h2> Metric Area </h2>
                    <CardDeck className = "datadeck">
                        <button class='selection'>Clinical Training</button>
                        <button class='selection' type="CDS" value="CDS"> CDS </button>
                        <button class='selection' type="Culture" value="Culture"> Culture </button>
                        <button class='selection' type="EB Training" value="EB Training"> EB Training </button>
                        <button class='selection' type="Eye Bank Partners" value="Eye Bank Partners"> Eye Bank Partners </button>
                        <button class='selection' type="Finance" value="Finance"> Finance </button>
                        <button class='selection' type="Global Donor Ops" value="Global Donor Ops"> Global Donor Ops </button>
                        <button class='selection' type="HR" value="HR"> HR </button>
                        <button class='selection' type="Advocacy" value="Advocacy"> Policy and Advocacy </button>
                        <button class='selection' type="Prevention" value="Prevention"> Prevention </button>
                        <button class='selection' type="Quality" value="Quality"> Quality </button>
                        <button class='selection' type="Training" value="Training"> Training </button>
                    </CardDeck>

                    <h2> Metric Calculation </h2>
                    <CardDeck className = "datadeck">
                        <button class='selection' type="AdoptionCourse" value="AdoptionCourse">Direct Skills Adoption Post Course </button>
                        <button class='selection' type="Total number of surgeons and ophthalmologists  trained (all levels)"
                        value="Total number of surgeons and ophthalmologists  trained (all levels)">
                            Total number of surgeons and ophthalmologists trained (all levels)</button>
                        <button class='selection' type="Surgeon/ophthalmologist" value="Surgeon/ophthalmologist">Surgeon / ophthalmologist Satisfcation Rating</button>
                    </CardDeck>
                </section>

                <section id="forms">
                    <form>
                    <h2> Month </h2>
                    <div class="dropdown">
                        <button class="dropbtn">Select a month <img src={ Chevron }/></button>
                        <div class="dropdown-content">
                            <p>January</p>
                            <p>February</p>
                            <p>March</p>
                            <p>April</p>
                            <p>May</p>
                            <p>June</p>
                            <p>July</p>
                            <p>August</p>
                            <p>September</p>
                            <p>October</p>
                            <p>November</p>
                            <p>December</p>
                        </div>
                    </div>

                    <h2> Data Being Inputted For </h2>
                        <input class='check' type="checkbox" id="Target" name="Target" value="Target" />
                            <label class='check' for="Target">Target</label>
                                <input type="checkbox" id="Actual" name="Actual" value="Actual" />
                            <label for="Target">Actual</label>
                        
                            <p class='textInput'>
                                <label for="fname">Data For Actual </label> 
                                <input type="text" id="form" name="Data" />
                            </p>

                            <p class='textInput'>
                                <label for="lname">Highlights</label>
                                <input type="text" id="form" name="Plan" />
                            </p>

                            <p class='textInput'>
                                <label for="lname">Lowlights </label>
                                <input type="text" id="form" name="Lowlights" />
                            </p>

                            <p class='textInput'>
                                <label for="lname">Mitigation Plan</label>
                                <input type="text" id="form" name="Highlights"/>
                            </p>
                            <button class='selection'>Preview</button>
                    </form>
                </section>
                </main>
                

            </div>
        )
    }
}