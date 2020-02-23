import React, { Component } from 'react';
import './Metrics.css';
import './index.js';

import { Button, ButtonGroup } from 'reactstrap';

export class Metrics extends Component {
    render() {
        return(
            <div className = "body">
                <main>
                <section class = "entry">
                    <h1> Data Entry Form </h1>

                    <h2> Metric Area </h2>
                    <div class = "button">
                        <button class="btn btn-primary">Clinical Training</button>
                        <Button type="CDS" value="CDS"> CDS </Button>
                        <Button type="Culture" value="Culture"> Culture </Button>
                        <Button type="EB Training" value="EB Training"> EB Training </Button>
                        <Button type="Eye Bank Partners" value="Eye Bank Partners"> Eye Bank Partners </Button>
                        <Button type="Finance" value="Finance"> Finance </Button>
                        <Button type="Global Donor Ops" value="Global Donor Ops"> Global Donor Ops </Button>
                        <Button type="HR" value="HR"> HR </Button>
                        <Button type="Advocacy" value="Advocacy"> Policy and Advocacy </Button>
                        <Button type="Prevention" value="Prevention"> Prevention </Button>
                        <Button type="Quality" value="Quality"> Quality </Button>
                        <Button type="Training" value="Training"> Training </Button>
                    </div>

                    <h2> Metric Calculation </h2>
                    <div class = "button">
                        <Button type="AdoptionCourse" value="AdoptionCourse">Direct Skills Adoption Post Course </Button>
                        <Button type="Total number of surgeons and ophthalmologists  trained (all levels)"
                        value="Total number of surgeons and ophthalmologists  trained (all levels)">
                            Total number of surgeons and ophthalmologists trained (all levels)</Button>
                        <Button type="Surgeon/ophthalmologist" value="Surgeon/ophthalmologist">Surgeon / ophthalmologist Satisfcation Rating</Button>
                    </div>
                </section>

                <section id="forms">
                    <form>
                        <input type="checkbox" id="Target" name="Target" value="Target" />
                            <label for="Target">Target</label>
                                <input type="checkbox" id="Actual" name="Actual" value="Actual" />
                            <label for="Target">Actual</label>
                        
                            <p>
                                <label for="fname">Data For Target </label> 
                                <input type="text" id="form" name="Data" />
                            </p>

                            <p>
                                <label for="lname">Mitigation Plan </label>
                                <input type="text" id="form" name="Plan" />
                            </p>

                            <p>
                                <label for="lname">Lowlights </label>
                                <input type="text" id="form" name="Lowlights" />
                            </p>

                            <p>
                                <label for="lname">Highlights </label>
                                <input type="text" id="form" name="Highlights"/>
                            </p>
                    </form>
                </section>
                </main>

            </div>
        )
    }
}