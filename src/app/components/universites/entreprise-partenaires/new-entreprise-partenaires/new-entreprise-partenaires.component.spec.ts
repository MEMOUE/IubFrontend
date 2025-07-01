import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntreprisePartenairesComponent } from './new-entreprise-partenaires.component';

describe('NewEntreprisePartenairesComponent', () => {
  let component: NewEntreprisePartenairesComponent;
  let fixture: ComponentFixture<NewEntreprisePartenairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEntreprisePartenairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEntreprisePartenairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
