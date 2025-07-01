import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEntreprisePartenairesComponent } from './liste-entreprise-partenaires.component';

describe('ListeEntreprisePartenairesComponent', () => {
  let component: ListeEntreprisePartenairesComponent;
  let fixture: ComponentFixture<ListeEntreprisePartenairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeEntreprisePartenairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeEntreprisePartenairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
