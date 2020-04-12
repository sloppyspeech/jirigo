import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditTicketsComponent } from './view-edit-tickets.component';

describe('ViewEditTicketsComponent', () => {
  let component: ViewEditTicketsComponent;
  let fixture: ComponentFixture<ViewEditTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
