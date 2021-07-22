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
            this.jobFilter.set(job, false);
        }

        this.abilityFilter = new Map<Ability, boolean>();
        for(var ability of this.data.abilities){
            this.abilityFilter.set(ability, false);
        }
    }
}