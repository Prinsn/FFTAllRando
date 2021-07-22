import { Component, Input, OnChanges } from "@angular/core";
import { Ability, AbilityToType } from "src/classes/abilities";
import { SkillDataService } from "src/services/skill-data.service";
import { SkillFilterService } from "src/services/skill-filter.service";

@Component({
    selector: 'job-card',
    templateUrl: './job-card.component.html'
})
export class JobCardComponent implements OnChanges{
    @Input() name: string;
    show = false;
    abilityBySection: Map<string, Ability[]>;
    constructor(
        public filter: SkillFilterService,
        public data: SkillDataService
    ){}

    get expansionSymbol() {return this.show ? "-" : "+"; }    

    get sections(){
        var keys = [];
        for(let key of this.abilityBySection.keys()){
            keys.push(key);
        }
        return keys;
    }

    ngOnChanges(){
        var jobAbilities = this.data.abilities
            .filter(z => z.Job == this.name);

        this.abilityBySection = new Map<string, Ability[]>();
        for(let ability of jobAbilities){            
            var type = AbilityToType(ability);
            if(!this.abilityBySection.get(type))
                this.abilityBySection.set(type, []);

            this.abilityBySection.get(type).push(ability);
        }
    }

    getSectionedAbilities(section: string){
        return this.abilityBySection.get(section);
    }

    showHide(){
        this.show = !this.show;
    }
}