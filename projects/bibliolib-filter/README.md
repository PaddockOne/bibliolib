# BibliolibFilter

[![npm version](https://badge.fury.io/js/bibliolib-filter.svg)](https://badge.fury.io/js/bibliolib-filter)

This library is a filter component for the bibliolib project. It is used to filter and order the list of some items.

# Installation

```bash
npm install bibliolib-filter
```

## Usage

Import the material theme in your angular.json

```json
"styles": [
    "@angular/material/prebuilt-themes/deeppurple-amber.css",
    "other styles..."
]
```

Import animations in your app.module.ts or app.config.ts

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';
// other imports...

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), other providers...]
};
```

Import the module in your app.module.ts

```typescript
import { BibliolibFilterModule } from 'bibliolib-filter';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BibliolibFilterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
```

Use the component in your app.component.html

```html
<bibliolib-filter
    [mode]="mode"
    [orderConfig]="orderConfig"
    [filterConfig]="filterConfig"
    [activeFilterList]="activeFilterList"
    [lang]="'fr-FR'"
    (orderChange)="onOrderChange($event)"
    (filterChange)="onFilterChange($event)"
    (searchChange)="onSearchChange($event)">
</bibliolib-filter>
```

```typescript

```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| mode | string | 'filter-order' | The mode of the filter. Can be 'filter', 'order' or 'filter-order'. |
| orderConfig | FilterConfig.IOrderItemConfig[] | [] | The configuration of the order. |
| filterConfig | FilterConfig.IFullFilterItemConfig[] | [] | The configuration of the filter. |
| activeFilterList | FilterConfig.IFullFilterItemConfig[] | [] | The list of active filters. |
| lang | string | 'fr-FR' | The language of the filter : 'fr-FR' or 'en-US'. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| orderChange | EventEmitter<FilterConfig.IOrderItemForRequest> | The event emitted when the order is changed. |
| filterChange | EventEmitter<FilterConfig.IFullFilterItemConfig[]> | The event emitted when the filter is changed. |
| searchChange | EventEmitter<string> | The event emitted when the search input is changed. |

# License

MIT

# Author

Github [@reyvaxreecded](https://github.com/reyvaxreecded).
Github [@Quezaquo](https://github.com/Quezaquo).

## Keywords

- Angular
- Filter
- Bibliolib
- Material