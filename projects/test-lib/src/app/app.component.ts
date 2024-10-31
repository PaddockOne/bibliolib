import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BibliolibDatetimePickerComponent, DateTime } from 'bibliolib-datetime-picker';
import { BibliolibFilterComponent, FilterConfig } from 'bibliolib-filter';
import { BibliolibGalleryComponent } from 'bibliolib-gallery';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BibliolibDatetimePickerComponent, BibliolibFilterComponent, BibliolibGalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test-lib';

  mode: 'filter' | 'order' | 'filter-order' | 'search-only' = 'search-only';
  orderConfig: FilterConfig.OrderItemConfig[] = [
    { label: 'Date', cat: 'date' },
    { label: 'Sortie', cat: 'sortie' },
    { label: 'Auteur', cat: 'author' }
  ];
  filterConfig: FilterConfig.FullFilterItemConfig[] = [
    {
      label: 'Date',
      cat: 'date',
      type: 'date',
      values: []
    },
    {
      label: 'Auteur',
      cat: 'author',
      type: 'list',
      values: [
        'Auteur 1',
        'Auteur 2',
        'Auteur 3',
        'Auteur 4',
        'Auteur 5',
        'Auteur 6',
        'Auteur 7',
        'Auteur 8',
        'Auteur 9',
        'Auteur 10',
        'Auteur 11',
        'Auteur 12',
        'Auteur 13',
        'Auteur 14',
        'Auteur 15',
        'Auteur 16',
        'Auteur 17',
        'Auteur 18',
        'Auteur 19',
        'Auteur 20',
        'Auteur 21',
        'Auteur 22',
      ]
    },
    {
      label: 'Sortie',
      cat: 'sortie',
      type: 'check',
      values: []
    },
    {
      label: 'Prix',
      cat: 'price',
      type: 'numeric_range',
      values: []
    },
    {
      label: 'Commentaire',
      cat: 'comment',
      type: 'nullOrNot',
      values: []
    }
  ];
  activeFilterList: FilterConfig.FullFilterItemConfig[] = [];
  dateSignal: WritableSignal<DateTime> = signal<DateTime>({date: '', hour: ''});

  images: string [] = [
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/lights.jpg',
  ];

  constructor() { }

  onOrderChange(event: any) {

  }

  onFilterChange(event: FilterConfig.FullFilterItemConfig[]) {
    console.log(event); 
    this.activeFilterList = [...event];
  }

  onSearchChange(event: any) {
    console.log(event);
  }

  changeFilterConfig() {
    this.filterConfig = [
      {
        label: 'Date',
        cat: 'date',
        type: 'date',
        values: []
      },
      {
        label: 'Auteur',
        cat: 'author',
        type: 'list',
        values: [
          'Auteur 1',
          'Auteur 2'
        ]
      },
      {
        label: 'Sortie',
        cat: 'sortie',
        type: 'check',
        values: []
      },
      {
        label: 'Prix',
        cat: 'price',
        type: 'numeric_range',
        values: []
      },
      {
        label: 'Commentaire',
        cat: 'comment',
        type: 'nullOrNot',
        values: []
      }
    ];
  }

  onValueChange(value: DateTime) {
    console.log(value);
  }

  updateValue() {
    this.dateSignal.set({date: '2021-01-01', hour: '12:00'});
  }
}
