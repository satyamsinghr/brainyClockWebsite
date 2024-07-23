import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrybeforebuyComponent } from './trybeforebuy.component';

describe('TrybeforebuyComponent', () => {
  let component: TrybeforebuyComponent;
  let fixture: ComponentFixture<TrybeforebuyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrybeforebuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrybeforebuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
