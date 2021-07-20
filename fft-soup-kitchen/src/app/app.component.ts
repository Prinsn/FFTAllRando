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
  randomSkills: Ability[];
  //Global maximum
  abilitiesToPull = 10;
  //Type maxima
  abilityTypesToPull: Map<string, number> = new Map<string, number>();
  useType: boolean;
  useGlobal: boolean;
  useBothCheckbox: boolean;
  types: string[] = [];

  constructor(public data: SkillDataService){
    for(let key of this.data.types){
      //View does not seem to have access to this value?
      this.abilityTypesToPull.set(key, 2);        
      this.types.push(key);
    }
  }

  public get useSkillMins(){
    return !!(this.useType && this.useGlobal);
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
      //new deck logic?
      .sort(() => 0.5 - Math.random())
      .sort(() => 0.5 - Math.random())
      .sort(() => 0.5 - Math.random())
      .sort(() => 0.5 - Math.random())
      //TODO filters
      ;
      
    var data = new RandoData(this.abilitiesToPull,  this.abilityTypesToPull)
    while(shuffled.length){
      var skill = shuffled.pop(); 
      var type = AbilityToType(skill);                 
      var totalOk = data.totalCapacityRemaining;
      var typeOk = data.totalTypeRemaining(type);      

      if(!typeOk && !totalOk && !data.allTypesSatisfied) {
        return;
      }

      if(this.useSkillMins) {
        if(!totalOk) return;        
        if(typeOk || data.allTypesSatisfied){
          data.updateData(type);
          this.randomSkills.push(skill);
        }
      }
      else {
        if(this.useType && !typeOk) continue;
        if(this.useGlobal && !totalOk) return;        
        
        data.updateData(type);
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

  getSkillTypeCount(type: string){
    return this.randomSkills.filter(z => AbilityToType(z) == type).length;
  }
}
