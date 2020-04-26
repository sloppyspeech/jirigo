import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSprintsComponent } from './edit-sprints.component';

describe('EditSprintsComponent', () => {
  let component: EditSprintsComponent;
  let fixture: ComponentFixture<EditSprintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSprintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
