export interface User {
    id: number;
    name: string;
}

export interface ConfigurationSettings {
    parentHeight: number;
    itemHeight: number;
    numberOfVisibleItems: number;
    prefetchedItems: number;
    dataLength: number;
    minIndex: number;
    maxIndex: number;
    startIndex: number;
}

export interface ViewportInfo {
    topPaddingHeight: number;
    bottomPaddingHeight: number;
    bufferHeight: number;
    bufferedItems: number;
    data: User[];
    settings: ConfigurationSettings;
    prefetchedHeight: number;
    totalHeight: number;
    viewportHeight: number;
    initialIndexPosition: number;
}