import { Component } from '@angular/core';
import { SkillDataService } from 'src/services/skill-data.service';
import { inherits } from 'util';
import { Ability, AbilityToString } from "../classes/abilities";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  randomSkills: Ability[];
  abilitiesToPull = 10;

  constructor(public data: SkillDataService){ }
  gen(){
    var sourceData: Ability[] = [];
    sourceData.push(...this.data.actives, ...this.data.passives);

    // https://stackoverflow.com/a/38571132
    // Shuffle array
    const shuffled = sourceData.sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    this.randomSkills = shuffled.slice(0, this.abilitiesToPull);
  }

  AbilityToString(ability: Ability){
    return AbilityToString(ability);
  }
}
