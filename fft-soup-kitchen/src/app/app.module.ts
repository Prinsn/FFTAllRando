import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LimitGeneratorComponent } from 'src/components/limit-generator/limit-generator.component';
import { JobCardComponent } from 'src/components/job-card/job-card.component';
import { JobContainerComponent } from 'src/components/jobs-container/jobs-container.component';

@NgModule({
  declarations: [
    AppComponent,
    LimitGeneratorComponent,
    JobContainerComponent,
    JobCardComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
