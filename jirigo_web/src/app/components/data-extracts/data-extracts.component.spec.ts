import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExtractsComponent } from './data-extracts.component';

describe('DataExtractsComponent', () => {
  let component: DataExtractsComponent;
  let fixture: ComponentFixture<DataExtractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExtractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExtractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
