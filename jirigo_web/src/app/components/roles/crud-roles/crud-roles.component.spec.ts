import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudRolesComponent } from './crud-roles.component';

describe('CrudRolesComponent', () => {
  let component: CrudRolesComponent;
  let fixture: ComponentFixture<CrudRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
