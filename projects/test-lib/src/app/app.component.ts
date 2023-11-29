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

  mode: 'filter' | 'order' | 'filter-order' = 'filter-order';
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
        'Auteur 3'
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
    this.activeFilterList = [...event].slice();
  }

  onSearchChange(event: any) {

  }
}
