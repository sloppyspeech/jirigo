import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditTaskComponent } from './view-edit-task.component';

describe('ViewEditTaskComponent', () => {
  let component: ViewEditTaskComponent;
  let fixture: ComponentFixture<ViewEditTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
