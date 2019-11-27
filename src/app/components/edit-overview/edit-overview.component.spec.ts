import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOverviewComponent } from './edit-overview.component';

describe('EditOverviewComponent', () => {
  let component: EditOverviewComponent;
  let fixture: ComponentFixture<EditOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
