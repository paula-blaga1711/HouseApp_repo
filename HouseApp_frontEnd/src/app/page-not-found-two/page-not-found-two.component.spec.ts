import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundTwoComponent } from './page-not-found-two.component';

describe('PageNotFoundTwoComponent', () => {
  let component: PageNotFoundTwoComponent;
  let fixture: ComponentFixture<PageNotFoundTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotFoundTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
