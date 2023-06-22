# Bibliolib

Simple social media gallery for angular apps.

## Installation

```bash
npm install bibliolib
```

## Usage

Import the module in your app module:

```typescript
import { BibliolibModule } from "bibliolib";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BibliolibModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Use the component in your app:

```html
<bibliolib [photoList]="images" [currentPhotoZoomGallery]="zoomImages"></bibliolib>
```

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  // List of urls images to display
  images: string[] = ["url1", "url2"];
  // list of urls images to display in zoom gallery (optional)
  // if not provided, the zoom gallery will display the same images as the main gallery
  zoomImages: string[] = ["url1", "url2"];

  constructor() {}
}
```

## License
MIT

## Author
@reyvaxreecded

