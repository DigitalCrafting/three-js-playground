import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DronePreview } from './drone-preview.component';

describe('CanvasBoxComponent', () => {
  let component: DronePreview;
  let fixture: ComponentFixture<DronePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DronePreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DronePreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
