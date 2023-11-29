import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DronePreview} from "../canvas/drone-preview.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DronePreview],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
