import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Item} from '../services/types';
import {ItemService} from '../services/item.service';

@Component({
  selector: 'app-dragged-item',
  templateUrl: './dragged-item.component.html',
})
export class DraggedItemComponent implements OnInit {

  @Input()
  item: Item | null;

  x: number;
  y: number;

  constructor(public itemService: ItemService) { }

  ngOnInit(): void {
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent): void {
    this.x = event.clientX;
    this.y = event.clientY;
  }

  getTransform(): string {
    return `translate(${this.x}px, ${this.y}px)`;
  }
}
