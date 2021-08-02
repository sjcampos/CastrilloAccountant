import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxempViewComponent } from './proxemp-view.component';

describe('ProxempViewComponent', () => {
  let component: ProxempViewComponent;
  let fixture: ComponentFixture<ProxempViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxempViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxempViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
