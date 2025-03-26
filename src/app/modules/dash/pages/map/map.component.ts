import { Component } from '@angular/core';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  constructor(public publicService: PublicService) { }
}
