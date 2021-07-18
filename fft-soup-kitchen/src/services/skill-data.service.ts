import { Injectable } from "@angular/core";
import { ActiveAbility, SupportAbility } from "../classes/abilities";
//These are "Modules" at run time, data is in .default
import * as activeJson from "../../../Skill Files/active.json";
import * as passiveJson from "../../../Skill Files/passive.json";

 @Injectable({providedIn: 'root'})
 export class SkillDataService {
    actives: ActiveAbility[];
    passives: SupportAbility[];
    private _actives: ActiveAbility[];
    private _passives: SupportAbility[];

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
        this.actives = [];
        this.passives = []; 

        this.actives = (activeJson as any).default as ActiveAbility[];         
        this.passives = (passiveJson as any).default as SupportAbility[];    
    }
 }