import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskyIPComponent } from './risky-ip.component';

describe('RiskyIPComponent', () => {
  let component: RiskyIPComponent;
  let fixture: ComponentFixture<RiskyIPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskyIPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskyIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
