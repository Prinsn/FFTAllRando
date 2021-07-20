import { Injectable } from "@angular/core";
import { Ability, AbilityToType, ActiveAbility, SupportAbility } from "../classes/abilities";
//These are "Modules" at run time, data is in .default
import * as activeJson from "../../../Skill Files/active.json";
import * as passiveJson from "../../../Skill Files/passive.json";

 @Injectable({providedIn: 'root'})
 export class SkillDataService {
    abilitiesByType: Map<string, Ability[]> = new Map<string, Ability[]>();
    abilities: Ability[];
    jobs: string[];
    reactionTypes: string[];
    specialTypes: string[];

    get types(){
        return this.abilitiesByType.keys();
    }
    constructor(){
        this.init();
    }

    public init() {
        this.jobs = [];
        this.reactionTypes = [];
        this.specialTypes = [];

        let actives = (activeJson as any).default as ActiveAbility[];         
        let passives = (passiveJson as any).default as SupportAbility[];    

        this.abilities = [...actives, ...passives]
        for(let ability of this.abilities)
        {
            var type = AbilityToType(ability);
            if(!this.abilitiesByType.get(type)){
                this.abilitiesByType.set(type, []);
            }
            
            this.abilitiesByType.get(type)
                .push(ability);

            this.jobs.push(ability.Job);
            if((ability as SupportAbility).ReactionType){
                var supportAbility = ability as SupportAbility;
                var type = supportAbility.ReactionType;
                if(type.indexOf("reaction_"))
                    this.reactionTypes.push(type.replace("reaction_", ""));
            }
            if((ability as ActiveAbility).Type){
                var active = ability as ActiveAbility;
                if(active.SpecialConsiderationType)
                    this.specialTypes.push(active.SpecialConsiderationType);
            }
            
            this.jobs = this.jobs.filter(this.onlyUnique);
            this.reactionTypes = this.reactionTypes.filter(this.onlyUnique);
            this.specialTypes = this.reactionTypes.filter(this.onlyUnique);
        }        
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
 }