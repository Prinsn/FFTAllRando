import { Component } from '@angular/core';
import { SkillDataService } from 'src/services/skill-data.service';
import { Ability, AbilityToString, AbilityToType } from "../classes/abilities";

//TODO move all this into components/classes as appropriate

class RandoData {
  totalCapacityRemaining: number;
  totalType: Map<string, number>;
  constructor(t: number, tt: Map<string, number>){
    this.totalCapacityRemaining = t;
    if(tt){
      this.totalType = new Map(tt);
    }
  }  

  totalTypeRemaining(type: string){
    return this.totalType.get(type) > 0;
  }

  updateData(type: string){
    let val = this.totalType.get(type) - 1;    
    this.totalType.set(type, val);  
    this.totalCapacityRemaining--;
  }

  private _allTypesSatisfied: boolean = false;
  get allTypesSatisfied(){
    if(!this._allTypesSatisfied){    
      for(var type of this.totalType.keys()){
        var typeRemaining = this.totalType.get(type);
        if(typeRemaining > 0)
          return false;
      }

      return true;
    }

    this._allTypesSatisfied = true;
    return true;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

}
