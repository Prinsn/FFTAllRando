import { asNativeElements, Component } from '@angular/core';
import { SkillDataService } from 'src/services/skill-data.service';
import { SkillFilterService } from 'src/services/skill-filter.service';
import { Ability, AbilityToString, AbilityToType } from "../../classes/abilities";

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
  selector: 'limit-generator',
  templateUrl: './limit-generator.component.html',
//   styleUrls: ['./app.component.less']
})
export class LimitGeneratorComponent {
  randomSkills: Ability[];
  //Global maximum
  abilitiesToPull = 10;
  //Type maxima
  abilityTypesToPull: Map<string, number> = new Map<string, number>();
  useType: boolean;
  useGlobal: boolean;
  useBothCheckbox: boolean;
  types: string[] = [];

  constructor(public data: SkillDataService, public filter: SkillFilterService){
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
      count = count + this.data.abilitiesByType.get(key).length; 
    }
    return count;
  } 

  gen(){
    var sourceData: Ability[] = [];
    this.randomSkills = [];

    for(let key of this.data.types){
      sourceData.push(...this.data.abilitiesByType.get(key)); 
    }

    // https://stackoverflow.com/a/38571132
    // Shuffle array    
    let shuffled = this.filter.filterShuffle(sourceData);
      
    var data = new RandoData(this.abilitiesToPull,  this.abilityTypesToPull)
    
    var infiniteParanoia = 0;
    var priorCount = -1;
    while(priorCount != this.randomSkills.length && infiniteParanoia++ < 100){
      priorCount == this.randomSkills.length;      
      if(this.runGenLoop(shuffled, data))
        break;

      shuffled = shuffled.filter(z => !this.randomSkills.find(a => a == z));      
    }
  }  

  private runGenLoop(shuffled: Ability[], data: RandoData){
    for(var skill of shuffled){           
      var type = AbilityToType(skill);                 
      var totalOk = data.totalCapacityRemaining;
      var typeOk = data.totalTypeRemaining(type);      

      if(!typeOk && !totalOk && !data.allTypesSatisfied) {
        return true;
      }

      if(this.useSkillMins) {
        if(!totalOk) return true;        
        if(typeOk || data.allTypesSatisfied){
          data.updateData(type);
          this.randomSkills.push(skill);
        }
      }
      else {
        if(this.useType && !typeOk) continue;
        if(this.useGlobal && !totalOk) return true;        
        
        data.updateData(type);
        this.randomSkills.push(skill);
      }
    }

    return false;
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
