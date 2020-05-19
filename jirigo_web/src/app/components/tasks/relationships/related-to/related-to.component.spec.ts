import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedToComponent } from './related-to.component';

describe('RelatedToComponent', () => {
  let component: RelatedToComponent;
  let fixture: ComponentFixture<RelatedToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
