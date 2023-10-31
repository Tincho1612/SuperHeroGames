import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFavoritoComponent } from './item-favorito.component';

describe('ItemFavoritoComponent', () => {
  let component: ItemFavoritoComponent;
  let fixture: ComponentFixture<ItemFavoritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFavoritoComponent]
    });
    fixture = TestBed.createComponent(ItemFavoritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
