import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignWorkflowComponent } from './assign-workflow.component';

describe('AssignWorkflowComponent', () => {
  let component: AssignWorkflowComponent;
  let fixture: ComponentFixture<AssignWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
