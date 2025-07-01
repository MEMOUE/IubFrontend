import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpartenairesComponent } from './newpartenaires.component';

describe('NewpartenairesComponent', () => {
  let component: NewpartenairesComponent;
  let fixture: ComponentFixture<NewpartenairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewpartenairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewpartenairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
