import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCta } from './contact-cta';

describe('ContactCta', () => {
  let component: ContactCta;
  let fixture: ComponentFixture<ContactCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactCta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactCta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
