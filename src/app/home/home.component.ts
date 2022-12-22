import { Component, OnInit } from '@angular/core';
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
