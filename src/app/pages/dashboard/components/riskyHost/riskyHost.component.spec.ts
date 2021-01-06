import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskyHostComponent } from './riskyHost.component';

describe('RiskyHostComponent', () => {
  let component: RiskyHostComponent;
  let fixture: ComponentFixture<RiskyHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskyHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskyHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
