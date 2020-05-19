import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependsOnComponent } from './depends-on.component';

describe('DependsOnComponent', () => {
  let component: DependsOnComponent;
  let fixture: ComponentFixture<DependsOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependsOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependsOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
