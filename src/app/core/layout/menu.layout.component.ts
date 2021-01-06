import { Component } from '@angular/core';
import { UtilService } from '../services/util.service';
 
@Component({
    selector: 'app-home-layout',
    templateUrl:'./menu.layout.component.html',
    styleUrls:['./menu.layout.component.scss']
})
export class MenuLayoutComponent {

    constructor(public utilService:UtilService){
        
    }
}
