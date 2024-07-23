import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainwithoutfooterComponent } from './mainwithoutfooter.component';

describe('MainwithoutfooterComponent', () => {
  let component: MainwithoutfooterComponent;
  let fixture: ComponentFixture<MainwithoutfooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainwithoutfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainwithoutfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
