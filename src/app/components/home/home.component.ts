import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasBoxComponent} from "../canvas-box/canvas-box.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CanvasBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
