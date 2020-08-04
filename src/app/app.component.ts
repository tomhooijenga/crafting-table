import {Component, ElementRef, HostListener} from '@angular/core';
import {Item} from './services/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  currentItem: Item | null;

  constructor(protected elementRef: ElementRef) {
  }

  selectItem(item: Item): void {
    this.currentItem = item;
  }

  @HostListener('document:click', ['$event.target'])
  click(target): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.currentItem = null;
    }
  }
}
