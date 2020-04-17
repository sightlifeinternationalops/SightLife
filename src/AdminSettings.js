import React, { Component } from 'react';
import './css/AdminSettings.css';
import { AdminPanelNav } from './AdminPanel';
import Off from './img/toggle.svg';
import On from './img/switch.svg'

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminSettings extends Component {  

    render() {
        return(
            <div className = "body"> 
                <main>  
                    <AdminPanelNav />

                    <h1 class="ASettingsTitle"> Admin Setting </h1>

                    <div class="main_content2">
                        <div class="columnSettings">
                            <section class="PermInfo">
                                <div class="PermissionBox">
                                    <h3 class='PermissionText'> Admin Information </h3>
                                </div>
                                <div class="PermissionInfo">
                                    <p class="PermText2"> Owner: Shruti Rajagopalan </p>
                                    <p class="PermText2"> Email: ShrutiR@gmail.com </p>
        
                                </div>
                            </section>
                        </div>

                        <div class="columnSettings">
                            <section class="PermInfo">
                                <div class="PermissionBox">
                                    <h3 class='PermissionText'> Data Entry Form Settings </h3>
                                </div>
                                
                                <div class="PermissionInfo">
                                    <p class="PermText2"> Data Entry for Actuals: <img src={ Off } id='toggle-actuals' alt="Toggle actuals" onClick= {this.SwitchActuals()}/> </p>
                                    <p class="PermText2"> Data Entry for Targets: <img src={ Off } id='toggle-targets' alt="Toggle targets" onClick= {this.SwitchTargets()}/> </p>
                                </div>
                            </section>
                        </div>

                        <div class='Save2Button'>
                            <button class='save2' type="Save" value="Save"> Save </button>
                        </div>
                    
                    </div>

                </main>
            </div>
        )
    }

    // Need to get rid of the if null statements. document.getElementByID is null for both though
    SwitchActuals() {
        if (document.getElementById('toggle-actual') != null) {
            let img = document.getElementById('toggle-actuals');
            console.log(img);
            if (img.src == Off) {
                document.getElementById('toggle-actuals').src  = On ;
            }
            else {
                document.getElementById('toggle-actuals').src = Off ;
            }
        }
    }
    
    SwitchTargets() {
        if (document.getElementById('toggle-targets') != null) {
        let img = document.getElementById('toggle-targets');
        if (img.src == Off) {
            document.getElementById('toggle-targets').src  = On ;
        }
         else {
           document.getElementById('toggle-targets').src = Off ;
       }
    }
}
}