import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  constructor(public titleService: Title) { }

  removeSpaces(text: string): string {
    return text.replace(/\s+/g, '');
  }
}
