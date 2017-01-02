import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'sway-header',
  templateUrl: '../templates/header.component.html',
})
export class HeaderComponent {
    @Input() sessionId;
}