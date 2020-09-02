import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
})
export class TabComponent {
  @HostBinding('class.active')
  get contentActive(): boolean {
    return this.active;
  }

  @Input() tabTitle: string;
  @Input() active = false;
}
