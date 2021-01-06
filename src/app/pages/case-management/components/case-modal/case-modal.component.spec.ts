import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseModalComponent } from './case-modal.component';

describe('CaseModalComponent', () => {
  let component: CaseModalComponent;
  let fixture: ComponentFixture<CaseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
