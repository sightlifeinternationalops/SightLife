import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar} from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/Metrics.css';
import './index.js';

import { DashBoard } from './DashBoard';

export class Metrics extends Component {
    render() {
        return(
            <Router>
                <div className = "body">
                    <h1> Metric Area DashBoard </h1>
                    <CardDeck className = 'metricsDeck'>

                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        CDS
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>

                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="./DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Clinical Training
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Culture
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        EB Training
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Eye Bank Partners
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Finance
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                    Training
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        HR
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        MA 
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Policy & Advocacy
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Prevention
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className="metricButton" renderAs="Button">
                                        Quality
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>


                        <Card className = 'metrics' border="primary" style={{ width: '18rem' }}>
                            <CardBody className ='metricsBody'>
                                <Link to="/DashBoard">
                                    <Button className= "metricButton" renderas="Button">
                                        Global Donor Operations
                                    </Button>
                                </Link>
                                {' '}
                            </CardBody>
                        </Card>

                    </CardDeck>

                    <Route exact path="/DashBoard" component={DashBoard} />
                </div>
            </Router>
        )
    }
}