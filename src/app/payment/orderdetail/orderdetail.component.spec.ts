import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderdetailComponent } from './orderdetail.component';

describe('OrderdetailComponent', () => {
  let component: OrderdetailComponent;
  let fixture: ComponentFixture<OrderdetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
