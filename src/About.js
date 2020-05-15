import './index.js';
import './css/About.css';
import React, { Component } from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import { SocialIcon } from 'react-social-icons';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { Button, ButtonToolbar} from 'reactstrap';

import Shruti from './img/shruti.png';
import Alex from './img/alex.jpg';
import Nathan from './img/nathan.jpg';
import SightLife from './img/sightlife.png';
import Rani from './img/rani.jpg';

import firebase from 'firebase/app';
import HomeDashBoard from './img/home-run.svg';
import Manager from './img/manager.svg';
import SignOut from './img/logout.svg';
import Profile from './img/profile2.png'

import Development from './img/development.png';
import Policy from './img/policy.png';
import Prevention from './img/prevention.png';
import Training from './img/training.png';
import { Link } from 'react-router-dom';

export class About extends Component {
    componentDidMount() {
        console.log(this.props)
    }

    render() {
        let signInButton = (
            <Nav/>
        )

        return(
        <div> 
            <section class = "wave">
                <div id="title" class="section-content">
                    <div>
                        <h1>SightLife Global Scorecard</h1>
                        <p class = "intro">
                            An international operations scorecard for SightLife to track projects, programs and 
                            departments with a mission to eradicate corneal blindness by 2040
                        </p>
                    </div>
                </div>
            </section>

            <section id="problem">
                <div class="section-content">
                    <h2 className = "team">The Problem</h2>
                    <p class="problem">
                        Right now, in this instance, there are more than <strong>12.7 million people in the world </strong> that are needlessly suffering from corneal blindness. 
                        Corneal blindness is the scarring of the cornea caused by an injury or disease. Damage to the cornea is more common than we think, 
                        but with SightLife, those suffering may all be relieved by 2040. <strong> SightLife’s main goal is to eliminate this life-damaging ailment </strong>. 
                    </p>

                    <p class = "problem">
                        But with their current system of organizing/visualizing data, it is a hindrance to their overall goal. 
                        This is why the global scorecard is a must-have. With this scorecard, it allows regional leads to have a platform where they can keep track of progress made 
                        tied to each region around the world where they are currently working to eradicate corneal blindness. 
                        This scorecard will provide visualizations that show trends over time, address different success metrics, 
                        and contain customizable dashboards for users from various departments
                    </p>
                </div>
            </section>

            <section>
                <div class="section-content">
                    <div class="flex-container">
                        <div class="flex-item">
                            <h2 className = "team">Sponsor Information</h2>
                            <p>
                                This project is sponsored by SightLife, the only global health organization working relentlessly to eliminate corneal blindness worldwide. With
                                partners in more than 30 countries, SightLife is increasing
                                the number of corneal transplants performed each year to
                                transform millions of lives around the globe.
                            </p>

                            <p class='learnMore'>
                                <a href="https://www.sightlife.org/">Learn more > </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="departments">
                <div class="section-content">
                    <h2 className = "team">
                        Departments
                    </h2>
                    <CardDeck className="About"> 

                    <Card className="Dep" style={{ width: '18rem' }}>
                        <CardImg top width="60%" src={ Development } alt='Development' />
                            <CardBody className="Departments">
                            <CardTitle> <h3> Eye Bank Development </h3> </CardTitle>
                                <CardText>
                                    <p> Bringing industry-leading best practices to eye banks worldwide. </p>
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card className="Dep" style={{ width: '18rem' }}>
                        <CardImg top width="64%" src={ Policy } alt='Policy' />
                            <CardBody className="Departments">
                                <CardTitle body className="text-center"> <h3> Advocacy & Policy  </h3> </CardTitle>
                                <CardText>
                                <p> Creating policies that allow for more access to corneal tissue. </p>
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card className="Dep" style={{ width: '18rem' }}>
                        <CardImg  top width="70%"src={ Prevention } alt='Prevention' />
                            <CardBody className="Departments">
                                <CardTitle body className="text-center"> <h3> Prevention </h3> </CardTitle>
                                <CardText>
                                    <p> Preventing blindness and strengthening health systems with a simple intervention.</p>
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card className="Dep" style={{ width: '18rem' }}>
                        <CardImg top width="64%" src={ Training } alt='Training' />
                            <CardBody className="Departments">
                                <CardTitle body className="text-center"> <h3> Clinical Training </h3> </CardTitle>
                                <CardText>
                                    <p> Training trasplant surgeons and care providers worldwide. </p>
                                </CardText>
                            </CardBody>
                        </Card>
                    </CardDeck>
                    </div>
            </section>

            <section id="contact">
                <div class="section-content">
                    <h2 className = "team">
                        Team Members & Contact Info
                    </h2>
                    
                    <CardDeck className="About"> 

                    <Card style={{ width: '18rem' }}>
                        <CardImg class="card-img-top img-fluid" src={ Nathan } alt='Nathan' />
                            <CardBody>
                            <CardTitle> <h3> Nathan Magdalera <SocialIcon url="https://www.linkedin.com/in/nathanmagdalera/" style={{ height: 30, width: 30 }}/> </h3> </CardTitle>
                                <CardText>
                                    <p className="About"> Full-Stack Developer </p>
                                    <p className="About"> Cybersecurity </p>
                                    <p className="About"> nathanmagdalera </p>
                                    <p className="About"> @gmail.com </p>
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card style={{ width: '18rem' }}>
                        <CardImg class="card-img-top img-fluid" src={ Shruti } alt='Shruti' />
                            <CardBody>
                                <CardTitle body className="text-center"> <h3> Shruti Rajagopalan <SocialIcon url="https://www.linkedin.com/in/shrutira/" style={{ height: 30, width: 30 }}/> </h3> </CardTitle>
                                <CardText>
                                    <p className="About"> User Experience</p>
                                    <p className="About"> Project Management </p>
                                    <p className="About"> shrutirdesign </p>
                                    <p className="About"> @gmail.com </p>
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card style={{ width: '18rem' }}>
                        <CardImg class="card-img-top img-fluid" src={ Alex } alt='Alex' />
                            <CardBody>
                                <CardTitle body className="text-center"> <h3>  Alexander Escalera  <SocialIcon url="https://www.linkedin.com/in/alexander-escalera-503360176/" style={{ height: 30, width: 30 }}/> </h3> </CardTitle>
                                <CardText>
                                    <p className="About"> Back-End Developer</p>
                                    <p className="About"> User Experience </p>
                                    <p className="About"> alexander.e1918 </p>
                                    <p className="About"> @gmail.com </p>
                                </CardText>
                            </CardBody>
                        </Card>

                        <Card style={{ width: '18rem' }}>
                        <CardImg class="card-img-top img-fluid" src={ Rani } alt='Rani' />
                            <CardBody>
                                <CardTitle body className="text-center"> <h3> Rani Chang <SocialIcon url="https://www.linkedin.com/in/yungtc/" style={{ height: 30, width: 30 }} /> </h3> </CardTitle>
                                <CardText>
                                    <p className="About"> Data Science</p>
                                    <p className="About"> Front-End Developer </p>
                                    <p className="About"> yungtsye@gmail.com </p>
                                </CardText>
                            </CardBody>
                        </Card>
                    </CardDeck>
                </div>
                <p className="para"><b>This project is complete and ownership will be transferred to the (future) Global Operations Business Manager. In the meantime, ownership will be given to 
                    Nashrah Mazhar: Nashrah.Mazhar@sightlife.org. For pressing questions, feel free to contact any of the team members who worked on the project.</b></p>
            </section>
            <footer>
                <div className="footer-container">
                    <p className="inSightful"> 
                        This project is a part of the
                    <a className="Data" href="https://ischool.uw.edu/capstone"> Capstone Project course at the University of Washington Information School </a></p>
                </div>
            </footer>
        </div>

        )
    }
}

class Nav extends Component {
    render() {
        return(
            <div className="navbar navbar-expand-lg navbar-light">
            <a className="navbar-brand" href="/">
              <img src={SightLife} alt="SightLife logo" />
            </a>
    
            <button className="navbar-toggler" value="Show and Hide Navigation Bar" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
              aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
    
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <NavLink to='/about' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>About</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/metrics' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>Metrics</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/dataentry' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>Data Entry</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/fAQ' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>FAQ</NavLink>
                </li>
                <li className="nav-item">
                  <div className="dropdown" id="myForm">
                    <img className="profile" src={Profile} />
                    <div className="dropdown-content" id="sign">
                      {/* <image class='prof-pic'>User's Profile Picture</image> */}
                      <p className='user-name'>User's Name</p>
                      <button type="submit" className="btn">
                        <NavLink to='/metrics' className="nav-link"> DashBoard </NavLink>
                      </button>
                      <button type="submit" className="btn">
                        <NavLink to='/adminpanel' className="nav-link">Admin Panel</NavLink>
                      </button>
                      <button id="signOutButton"
                        onClick={() => this.props.signOut()}>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )
    }
}