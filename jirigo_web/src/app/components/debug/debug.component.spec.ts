import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferencesService} from '../../services/references/references.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { DebugComponent } from './debug.component';

describe('DebugComponent', () => {
  let component: DebugComponent;
  let fixture: ComponentFixture<DebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [ DebugComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should instantiate', () => {
    let _httpCli:HttpClient;
    let _serReferences:ReferencesService;
    const component : DebugComponent = new DebugComponent(_httpCli,_serReferences);
    expect(component).toBeDefined();
  });

  it('should have project statuses defined', () => {
    let _httpCli:HttpClient;
    let _serReferences:ReferencesService;
    const component : DebugComponent = new DebugComponent(_httpCli,_serReferences);
    expect(component.projStatuses.length).toBeGreaterThan(0);
  });

  it('should have project type initialized to blank', () => {
    let _httpCli:HttpClient;
    let _serReferences:ReferencesService;
    const component : DebugComponent = new DebugComponent(_httpCli,_serReferences);
    expect(component.projectType.length).toEqual(3);
  });

});
