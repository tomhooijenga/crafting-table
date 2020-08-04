import {Component, HostListener, Input} from '@angular/core';
import {Item} from '../services/types';

@Component({
  selector: 'app-dragged-item',
  templateUrl: './dragged-item.component.html',
})
export class DraggedItemComponent {

  @Input()
  item: Item | null;

  x: number;
  y: number;

  constructor() { }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent): void {
    this.x = event.clientX;
    this.y = event.clientY;
  }

  getTransform(): string {
    return `translate(${this.x}px, ${this.y}px)`;
  }
}
