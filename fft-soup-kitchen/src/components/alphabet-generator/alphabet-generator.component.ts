import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { Ability, AbilityToString } from "src/classes/abilities";
import { SkillDataService } from "src/services/skill-data.service";
import { SkillFilterService } from "src/services/skill-filter.service";

@Component({
    selector: "soup-generator",
    templateUrl: "./alphabet-generator.component.html"
})
export class AlphabetGeneratorComponent {
    letters = "abcdefghijklmnopqrstuvwxyz".split('');
    _letter = "a";
    get letter(){
        return this._letter;
    }
    set letter(l: string){
        this._letter = l;
        this.makeSoup();
    }

    positions: number[] = []
    _position = 1;
    get position(){
        return this._position;
    }
    set position(p: number){
        this._position = p;
        this.makeSoup();
    }

    alphabetSoup: Ability[] = [];
    
    constructor(
        private skills: SkillDataService,
        private filter: SkillFilterService ){}
    
    filterSub: Subscription;
    ngOnInit(){
        this.populatePositions();
        this.filterSub = this.filter.filterChanged.subscribe(() => this.makeSoup());
        this.makeSoup();
    }

    ngOnDestroy(){
        this.filterSub.unsubscribe();
    }

    makeSoup(){
        this.alphabetSoup = this.skills.abilities.filter(a =>{                        
            return this.filter.filterAbility(a)
                && a.Name.toLowerCase()[this._position - 1] == this._letter;
        })
    }

    populatePositions(){
        var max = this.skills.abilities
            .map(z => z.Name)
            .reduce((p, c) => p.length > c.length ? p : c).length;

        for(let i = 1; i <= max; i++) 
            this.positions.push(i); 
    }

    AbilityToString(ability: Ability){
        return AbilityToString(ability);
    }
}