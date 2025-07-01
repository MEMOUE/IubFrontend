import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEntreprisePartenairesComponent } from './detail-entreprise-partenaires.component';

describe('DetailEntreprisePartenairesComponent', () => {
  let component: DetailEntreprisePartenairesComponent;
  let fixture: ComponentFixture<DetailEntreprisePartenairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEntreprisePartenairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEntreprisePartenairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
