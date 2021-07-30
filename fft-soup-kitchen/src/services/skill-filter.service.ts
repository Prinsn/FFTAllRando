import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Ability } from "src/classes/abilities";
import { SkillDataService } from "./skill-data.service";

@Injectable({providedIn: 'root'})
export class SkillFilterService {
    filterChanged = new EventEmitter<void>();
    jobFilter: Map<string, boolean>;
    abilityFilter: Map<Ability, boolean>;
    
    constructor(private data: SkillDataService){
        this.init();
    }

    init(){
        this.jobFilter = new Map<string, boolean>();
        for(var job of this.data.jobs){
            this.jobFilter.set(job, true);
        }

        this.abilityFilter = new Map<Ability, boolean>();
        for(var ability of this.data.abilities){
            this.abilityFilter.set(ability, true);
        }
    }

    filterAbility(ability: Ability){
        return this.jobFilter.get(ability.Job) 
        && this.abilityFilter.get(ability);
    }

    filterShuffle(sourceData: Ability[]) {
        sourceData = sourceData.filter(this.filterAbility);    
        return this.shuffle(sourceData);
    }

    shuffle<T>(array: T[]) {
        var currentIndex = array.length, randomIndex: number;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}