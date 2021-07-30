import { Component } from '@angular/core';

enum type {
  random = 0, 
  soup = 1
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  type: type = 0;

  get isRandom(){
    return this.type == type.random;
  }

  setRandom(){
    this.type = type.random;
  }

  get isSoup() {
    return this.type == type.soup;
  }

  setSoup() {
    this.type = type.soup;
  }
}
