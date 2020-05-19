import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatedByComponent } from './duplicated-by.component';

describe('DuplicatedByComponent', () => {
  let component: DuplicatedByComponent;
  let fixture: ComponentFixture<DuplicatedByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatedByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
