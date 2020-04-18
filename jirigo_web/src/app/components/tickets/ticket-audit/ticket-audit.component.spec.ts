import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAuditComponent } from './ticket-audit.component';

describe('TicketAuditComponent', () => {
  let component: TicketAuditComponent;
  let fixture: ComponentFixture<TicketAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
