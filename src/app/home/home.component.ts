import { Component, OnInit } from '@angular/core';
import {Meta} from "@angular/platform-browser";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  constructor(
    private metaService: Meta
    ) {
  }

  ngOnInit(): void {
    this.addTag()
  }

  addTag() {
    this.metaService.addTag({ name: 'description', content: 'Strona internetowa firmy Devims Dawid Marcinków' });
    this.metaService.addTag({ property: 'og:title', content: 'Devims' });
  }
}
