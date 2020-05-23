import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksTicketsComponent } from './my-tasks-tickets.component';

describe('MyTasksTicketsComponent', () => {
  let component: MyTasksTicketsComponent;
  let fixture: ComponentFixture<MyTasksTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTasksTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTasksTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
