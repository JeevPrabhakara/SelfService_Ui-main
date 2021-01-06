import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskyUserInfoModalComponent } from './risky-user-info-modal.component';

describe('RiskyUserInfoModalComponent', () => {
  let component: RiskyUserInfoModalComponent;
  let fixture: ComponentFixture<RiskyUserInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskyUserInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskyUserInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
