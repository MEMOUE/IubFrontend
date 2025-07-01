import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeformationComponent } from './listeformation.component';

describe('ListeformationComponent', () => {
  let component: ListeformationComponent;
  let fixture: ComponentFixture<ListeformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
