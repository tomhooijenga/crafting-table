import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {ItemsComponent} from './items/items.component';
import { ItemIconComponent } from './item-icon/item-icon.component';
import { CraftingTableComponent } from './crafting-table/crafting-table.component';
import { DraggedItemComponent } from './dragged-item/dragged-item.component';
import { ItemIconTileComponent } from './item-icon-tile/item-icon-tile.component';
import { ResultListComponent } from './result-list/result-list.component';
import { CraftingGridComponent } from './crafting-grid/crafting-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemIconComponent,
    CraftingTableComponent,
    DraggedItemComponent,
    ItemIconTileComponent,
    ResultListComponent,
    CraftingGridComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
