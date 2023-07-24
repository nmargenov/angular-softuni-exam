import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseFeedComponent } from './choose-feed.component';

describe('ChooseFeedComponent', () => {
  let component: ChooseFeedComponent;
  let fixture: ComponentFixture<ChooseFeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseFeedComponent]
    });
    fixture = TestBed.createComponent(ChooseFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
