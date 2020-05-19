import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAndTaskLinksComponent } from './ticket-and-task-links.component';

describe('TicketAndTaskLinksComponent', () => {
  let component: TicketAndTaskLinksComponent;
  let fixture: ComponentFixture<TicketAndTaskLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAndTaskLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAndTaskLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
