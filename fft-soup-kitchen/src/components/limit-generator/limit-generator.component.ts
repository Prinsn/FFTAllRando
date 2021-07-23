import { Component } from '@angular/core';
import { RandoData } from 'src/classes/randoData';
import { SkillDataService } from 'src/services/skill-data.service';
import { SkillFilterService } from 'src/services/skill-filter.service';
import { Ability, AbilityToString, AbilityToType } from "../../classes/abilities";

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

  busy = false;
  gen() {
    if(this.busy) return;
    console.log(this.busy);
    this.busy = true;
    console.debug("start");
    this._gen();
    console.debug("end");
    this.busy = false;
  }

  private _gen(){
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
    while(true){ 
      console.log(priorCount + " ," + this.randomSkills.length);
      if(priorCount == this.randomSkills.length)
      {
        break;
      }
      if(infiniteParanoia++ > 10){      
        break;
      }
      
      if(this.runGenLoop(shuffled, data)) 
        break;

      priorCount = this.randomSkills.length;    

      shuffled = shuffled.filter(z => 
        !this.randomSkills.find(a => a.Name == z.Name)
      );      
    }
  }  

  private runGenLoop(shuffled: Ability[], data: RandoData){
    for(var skill of shuffled){           
      var type = AbilityToType(skill);                 
      var totalOk = data.totalCapacityRemaining > 0;
      var typeOk = data.totalTypeRemaining(type) > 0;      
      var allTypesOk = data.allTypesSatisfied

      if(!typeOk && !totalOk && allTypesOk) {      
        return true;
      }

      if(this.useSkillMins) {
        if(!totalOk) {          
          return true;        
        }
        if(!typeOk && !allTypesOk){
          continue;
        }
      } else if(this.useType) {
          if(allTypesOk) {
            return;
          }
          else if(!typeOk) {
            continue;
          }
      } else if(this.useGlobal && !totalOk) {
        return true;        
      }

      data.updateData(type);
      this.randomSkills.push(skill);    
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
