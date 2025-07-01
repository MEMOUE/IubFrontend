import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeactualitesComponent } from './listeactualites.component';

describe('ListeactualitesComponent', () => {
  let component: ListeactualitesComponent;
  let fixture: ComponentFixture<ListeactualitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeactualitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeactualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
