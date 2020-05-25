import { TestBed } from '@angular/core/testing';

import { ProjectWorkflowsService } from './project-workflows.service';

describe('ProjectWorkflowsService', () => {
  let service: ProjectWorkflowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectWorkflowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
