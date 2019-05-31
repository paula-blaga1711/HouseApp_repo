import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashpanalComponent } from './dashpanal.component';

describe('DashpanalComponent', () => {
  let component: DashpanalComponent;
  let fixture: ComponentFixture<DashpanalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashpanalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashpanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
