import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasComponent} from "../canvas/canvas.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CanvasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
