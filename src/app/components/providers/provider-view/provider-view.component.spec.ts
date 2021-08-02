import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderViewComponent } from './provider-view.component';

describe('ProviderViewComponent', () => {
  let component: ProviderViewComponent;
  let fixture: ComponentFixture<ProviderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
