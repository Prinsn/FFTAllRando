import { Component } from "@angular/core";
import { SkillDataService } from "src/services/skill-data.service";

@Component({
    selector: 'jobs-container',
    templateUrl: './jobs-container.component.html'
})
export class JobContainerComponent {
    constructor(public data: SkillDataService){}
    get jobs(){
        return this.data.jobs;
    }
}