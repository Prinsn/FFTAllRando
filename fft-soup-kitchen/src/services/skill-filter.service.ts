import { areAllEquivalent } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { Ability } from "src/classes/abilities";
import { SkillDataService } from "./skill-data.service";

@Injectable({providedIn: 'root'})
export class SkillFilterService {
    
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

    filterShuffle(sourceData: Ability[]) {
        sourceData = sourceData.filter(a => 
            this.jobFilter.get(a.Job) 
            && this.abilityFilter.get(a)
        );
        
        return this.shuffle(sourceData);
    }

    shuffle(array: any[]) {
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