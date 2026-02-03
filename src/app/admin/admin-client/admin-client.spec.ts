import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClient } from './admin-client';

describe('AdminClient', () => {
  let component: AdminClient;
  let fixture: ComponentFixture<AdminClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
