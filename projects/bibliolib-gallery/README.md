# Bibliolib

Simple social media gallery for angular apps.

## Installation

```bash
npm install bibliolib-gallery
```

## Usage

Import the module in your app module:

```typescript
import { BibliolibGalleryModule } from "bibliolib-gallery";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BibliolibGalleryModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Use the component in your app:

```html
<bibliolib-gallery [photoList]="images" [currentPhotoZoomGallery]="zoomImages"></bibliolib-gallery>
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
[github: @reyvaxreecded]('https://github.com/reyvaxreecded')

