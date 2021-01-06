import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseGlobeComponent } from './pulse-globe.component';

describe('PulseGlobeComponent', () => {
  let component: PulseGlobeComponent;
  let fixture: ComponentFixture<PulseGlobeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulseGlobeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
