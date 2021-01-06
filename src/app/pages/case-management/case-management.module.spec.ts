import { CaseManagementModule } from './case-management.module';

describe('CaseManagementModule', () => {
  let caseManagementModule: CaseManagementModule;

  beforeEach(() => {
    caseManagementModule = new CaseManagementModule();
  });

  it('should create an instance', () => {
    expect(caseManagementModule).toBeTruthy();
  });
});
