


import { Component, ChangeDetectorRef } from '@angular/core';
import {
  User,
  ViewportInfo,
  ConfigurationSettings,
} from './interfaces/virtualize-interfaces';

const CONFIGURATION_SETTINGS: ConfigurationSettings = {
  parentHeight: 500,
  itemHeight: 50,
  numberOfVisibleItems: 10,
  prefetchedItems: 8,
  dataLength: 20000,
  minIndex: 0,
  maxIndex: 0,
  startIndex: 0,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-virtual-scroll';
  testData: User[] = [];
  parentViewportInfo: ViewportInfo;
  topPaddingHeight: number = 0;
  bottomPaddingHeight: number = 0;
  parentClassName: string = 'parent-scroll-viewport';
  parentStyle = {
    'overflow-y': 'auto',
    height: `${CONFIGURATION_SETTINGS.parentHeight}px`,
    border: '2px solid #4caf50',
  };

  constructor(public cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.buildMockData(CONFIGURATION_SETTINGS.dataLength);
    this.parentViewportInfo = this.setParentViewportInfo(
      CONFIGURATION_SETTINGS
    );
  }

  ngAfterViewInit() {
    const { initialIndexPosition } = this.parentViewportInfo;
    const elem = document.querySelector(`.${this.parentClassName}`);
    elem.scrollTop = initialIndexPosition;
    if (!initialIndexPosition) {
      this.onParentScroll({ target: { scrollTop: 0 } });
    }
  }

  setParentViewportInfo(settings: ConfigurationSettings): ViewportInfo {
    const {
      itemHeight,
      numberOfVisibleItems,
      prefetchedItems,
      minIndex,
      startIndex,
    } = settings;
    let { maxIndex } = settings;
    if (maxIndex === 0) {
      maxIndex = settings.dataLength - 1;
      settings.maxIndex = maxIndex;
    }
    const viewportHeight = numberOfVisibleItems * itemHeight;
    const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
    const prefetchedHeight = prefetchedItems * itemHeight;
    const bufferHeight = viewportHeight + 2 * prefetchedHeight;
    const bufferedItems = numberOfVisibleItems + 2 * prefetchedItems;
    const itemsAbove = startIndex - prefetchedItems - minIndex;
    const topPaddingHeight = itemsAbove * itemHeight;
    const bottomPaddingHeight = totalHeight - topPaddingHeight;
    const initialIndexPosition = topPaddingHeight + prefetchedHeight;
    return {
      settings,
      viewportHeight,
      totalHeight,
      prefetchedHeight,
      bufferHeight,
      bufferedItems,
      topPaddingHeight,
      bottomPaddingHeight,
      initialIndexPosition,
      data: [],
    };
  }

  onParentScroll({ target: { scrollTop } }: any): void {
    const {
      totalHeight,
      prefetchedHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = this.parentViewportInfo;
    const index =
      minIndex + Math.floor((scrollTop - prefetchedHeight) / itemHeight);
    const data = this.getPortionOfData(index, bufferedItems);
    this.topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    this.bottomPaddingHeight = Math.max(
      totalHeight - this.topPaddingHeight - data.length * itemHeight,
      0
    );
    this.testData = data;
    this.cd.detectChanges();
  }

  getPortionOfData(index, bufferedItems) {
    let data = [];
    const start = Math.max(CONFIGURATION_SETTINGS.minIndex, index);
    const end = Math.min(
      index + bufferedItems - 1,
      CONFIGURATION_SETTINGS.maxIndex
    );
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        data.push({
          id: i,
          name: `user name ${i}`,
        });
      }
    }
    return data;
  }

  buildMockData(num: number) {
    for (let i = 0; i < num; i++) {
      this.testData.push({
        id: i,
        name: `user name ${i}`,
      });
    }
  }
}
