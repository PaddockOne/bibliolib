import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BibliolibFilterComponent, FilterConfig } from 'bibliolib-filter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BibliolibFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test-lib';

  mode: 'filter' | 'order' | 'filter-order' | 'search-only' = 'search-only';
  orderConfig: FilterConfig.IOrderItemConfig[] = [
    { label: 'Date', cat: 'date' },
    { label: 'Sortie', cat: 'sortie' },
    { label: 'Auteur', cat: 'author' }
  ];
  filterConfig: FilterConfig.IFullFilterItemConfig[] = [
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
      label: 'Prix2',
      cat: 'price2',
      type: 'numeric_range',
      values: []
    },
    {
      label: 'Prix3',
      cat: 'price3',
      type: 'numeric_range',
      values: []
    },
    {
      label: 'Prix4',
      cat: 'price4',
      type: 'numeric_range',
      values: []
    }
  ];
  activeFilterList: FilterConfig.IFullFilterItemConfig[] = [];

  constructor() { }

  onOrderChange(event: any) {

  }

  onFilterChange(event: FilterConfig.IFullFilterItemConfig[]) {
    console.log(event); 
    this.activeFilterList = [...event].slice();
  }

  onSearchChange(event: any) {

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
        label: 'Prix2',
        cat: 'price2',
        type: 'numeric_range',
        values: []
      },
      {
        label: 'Prix3',
        cat: 'price3',
        type: 'numeric_range',
        values: []
      },
      {
        label: 'Prix4',
        cat: 'price4',
        type: 'numeric_range',
        values: []
      }
    ];
  }
}
