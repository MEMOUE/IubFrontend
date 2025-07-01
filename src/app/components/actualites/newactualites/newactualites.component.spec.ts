import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewactualitesComponent } from './newactualites.component';

describe('NewactualitesComponent', () => {
  let component: NewactualitesComponent;
  let fixture: ComponentFixture<NewactualitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewactualitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewactualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
