import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMenusToRoleComponent } from './assign-menus-to-role.component';

describe('AssignMenusToRoleComponent', () => {
  let component: AssignMenusToRoleComponent;
  let fixture: ComponentFixture<AssignMenusToRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignMenusToRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMenusToRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
