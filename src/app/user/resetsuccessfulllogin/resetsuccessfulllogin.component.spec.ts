import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResetsuccessfullloginComponent } from './resetsuccessfulllogin.component';

describe('ResetsuccessfullloginComponent', () => {
  let component: ResetsuccessfullloginComponent;
  let fixture: ComponentFixture<ResetsuccessfullloginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetsuccessfullloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetsuccessfullloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
