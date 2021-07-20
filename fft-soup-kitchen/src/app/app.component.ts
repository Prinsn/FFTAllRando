import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { SkillDataService } from 'src/services/skill-data.service';
import { Ability, AbilityToString, AbilityToType } from "../classes/abilities";

//TODO move all this into components/classes as appropriate

class RandoData {
  total: number;
  totalType: Map<string, number>;
  constructor(t: number, tt: Map<string, number>){
    this.total = t;
    if(tt){
      this.totalType = new Map(tt);
    }
  }  

  addTotalGetRemaining(){  
    return --this.total;
  }

  addTypeGetRemaining(type: string){
    let val = this.totalType.get(type) - 1;    
    this.totalType.set(type, val);  
    return val;
  }

  private _allTypesSatisfied: boolean = false;
  allTypesSatisfied(){
    if(!this._allTypesSatisfied){
      for(var type in this.totalType.keys()){
        if(this.totalType.get(type) > 0)
          return false;
      }
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
  randomSkills: Ability[];
  //Global maximum
  abilitiesToPull = 10;
  //Type maxima
  abilityTypesToPull: Map<string, number> = new Map<string, number>();
  useType: boolean;
  useGlobal: boolean;
  useBothCheckbox: boolean;

  get maxOrMinType(){
    return this.useSkillMins
      ? "Minimum"
      : "Maximum";
  }

  types: string[] = [];

  constructor(public data: SkillDataService){
    for(let key of this.data.types){
      //View does not seem to have access to this value?
      this.abilityTypesToPull.set(key, 2);        
      this.types.push(key);
    }
  }

  private get useSkillMins(){
    return this.useType && this.useGlobal && this.useBothCheckbox;
  }

  get totalSkills(){
    var count = 0;
    for(let key of this.data.types){
      count = count + this.data.abilityDict.get(key).length; 
    }
    return count;
  } 

  gen(){
    var sourceData: Ability[] = [];
    this.randomSkills = [];

    for(let key of this.data.types){
      sourceData.push(...this.data.abilityDict.get(key)); 
    }

    // https://stackoverflow.com/a/38571132
    // Shuffle array
    const shuffled = sourceData
      .sort(() => 0.5 - Math.random())
      //TODO filter by types
      ;
      
    var data = new RandoData(this.abilitiesToPull,  this.abilityTypesToPull)
    while(shuffled.length){
      var skill = shuffled.pop();      
      
      var skillTypeRemaining = this.useType ?
        data.addTypeGetRemaining(AbilityToType(skill))
        : 1;

      var skillTotalRemaining = this.useGlobal ?
       data.addTotalGetRemaining()
       : 1;         


      if(skillTotalRemaining > -1 
        && (skillTypeRemaining > -1 
          || (this.useSkillMins && data.allTypesSatisfied)
        )
      ) {
        this.randomSkills.push(skill);
      }
    }
  }

  AbilityToString(ability: Ability){
    return AbilityToString(ability);
  }

  AbilityToType(ability: Ability){
    return AbilityToType(ability);
  }

  //For some reason this doesn't directly in ngModelChange
  updateMapValue(type: string, $event: number){
    this.abilityTypesToPull.set(type, $event);
  }
}
