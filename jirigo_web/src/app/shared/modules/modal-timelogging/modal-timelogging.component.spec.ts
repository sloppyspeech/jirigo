import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTimeloggingComponent } from './modal-timelogging.component';

describe('ModalTimeloggingComponent', () => {
  let component: ModalTimeloggingComponent;
  let fixture: ComponentFixture<ModalTimeloggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTimeloggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTimeloggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
