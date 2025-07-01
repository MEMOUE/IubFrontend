import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailspartenairesComponent } from './detailspartenaires.component';

describe('DetailspartenairesComponent', () => {
  let component: DetailspartenairesComponent;
  let fixture: ComponentFixture<DetailspartenairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailspartenairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailspartenairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
