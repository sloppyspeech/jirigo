import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateOutageComponent } from './create-update-outage.component';

describe('CreateUpdateOutageComponent', () => {
  let component: CreateUpdateOutageComponent;
  let fixture: ComponentFixture<CreateUpdateOutageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateOutageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateOutageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
