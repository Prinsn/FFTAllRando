import { Injectable } from "@angular/core";
import { Ability, AbilityToType, ActiveAbility, SupportAbility } from "../classes/abilities";
//These are "Modules" at run time, data is in .default
import * as activeJson from "../../../Skill Files/active.json";
import * as passiveJson from "../../../Skill Files/passive.json";

 @Injectable({providedIn: 'root'})
 export class SkillDataService {
    private _abilities: Map<string, Ability[]> = new Map<string, Ability[]>();
    get types(){
        return this._abilities.keys();
    }

    get abilityDict(){
        return this._abilities;
    }
    
    get debugActiveJson(){
        return activeJson;
    }
    get debugPassiveJson(){
        return passiveJson;
    }
    
    constructor(){
        this.init();
    }

    public init() {
        let actives = (activeJson as any).default as ActiveAbility[];         
        let passives = (passiveJson as any).default as SupportAbility[];    

        for(let ability of [...actives, ...passives])
        {
            var type = AbilityToType(ability);
            if(!this._abilities.get(type)){
                this._abilities.set(type, []);
            }
            
            this._abilities.get(type)
                .push(ability);
        }
    }
 }