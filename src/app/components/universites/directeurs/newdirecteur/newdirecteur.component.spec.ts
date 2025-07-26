import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdirecteurComponent } from './newdirecteur.component';

describe('NewdirecteurComponent', () => {
  let component: NewdirecteurComponent;
  let fixture: ComponentFixture<NewdirecteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewdirecteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewdirecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
