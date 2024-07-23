import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetappComponent } from './getapp.component';

describe('GetappComponent', () => {
  let component: GetappComponent;
  let fixture: ComponentFixture<GetappComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GetappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
