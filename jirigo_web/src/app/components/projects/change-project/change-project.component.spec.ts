import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProjectComponent } from './change-project.component';

describe('ChangeProjectComponent', () => {
  let component: ChangeProjectComponent;
  let fixture: ComponentFixture<ChangeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
