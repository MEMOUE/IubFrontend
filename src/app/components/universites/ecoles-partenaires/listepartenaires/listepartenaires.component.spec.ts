import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListepartenairesComponent } from './listepartenaires.component';

describe('ListepartenairesComponent', () => {
  let component: ListepartenairesComponent;
  let fixture: ComponentFixture<ListepartenairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListepartenairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListepartenairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
