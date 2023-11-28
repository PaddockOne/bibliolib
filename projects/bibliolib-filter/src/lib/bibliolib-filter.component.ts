import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  animate,
  animation,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { OnlyNumbersDirective } from './only-numbers.directive';
import { fromEvent, map, throttleTime } from 'rxjs';
import { FilterConfig } from './filter-config.model';
import { BibliolibFilterService } from './bibliolib-filter.service';
import { MatDatepickerModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'lib-bibliolib-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OnlyNumbersDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  template: `
  <!-- Searchbar and btn -->
  <article class="searchbar-container">
    <section class="searchbar-container__action">
      <form class="searchbar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          id="before-svg"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 1664 1664"
        >
          <path
            fill="currentColor"
            d="M1152 704q0-185-131.5-316.5T704 256T387.5 387.5T256 704t131.5 316.5T704 1152t316.5-131.5T1152 704zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124q-143 0-273.5-55.5t-225-150t-150-225T0 704t55.5-273.5t150-225t225-150T704 0t273.5 55.5t225 150t150 225T1408 704q0 220-124 399l343 343q37 37 37 90z"
          />
        </svg>
        <input
          type="search"
          results="5"
          placeholder="Rechercher"
          class="primary-500"
        />
        <button class="text--sm text--medium">Rechercher</button>
      </form>
      <button class="filter-btn" (click)="toggleMenu($event)">
        {{ getFilterButtonLabel() }}
      </button>
    </section>
    <section
      *ngIf="activeFilterList.length > 0 && isMobileDisplay === false"
      class="active-filter-list--desktop"
    >
      <section
        class="badge-group badge-group--primary"
        *ngFor="let filter of activeFilterList"
      >
        <label>{{ filter.label }}</label>
        <span
          class="badge badge--ico badge--md badge--primary"
          (click)="removeFilterItem(value, filter.label)"
          *ngFor="let value of filter.values"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 15 15"
            class="clickable"
          >
            <path
              fill="currentColor"
              d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"
            />
          </svg>
          {{ getFormattedFilterValue(filter.type, value) }}
        </span>
      </section>
    </section>
  </article>

  <!-- Filter and order menu -->

  <article *ngIf="filterModalState !== 'hidden'" class="nav-menu">
    <section @searchandfilter class="menu">
      <section class="menu__header">
        <svg
          class="back-arrow"
          (click)="toggleMenu($event)"
          *ngIf="filterModalState !== 'nav-menu'"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 16 16"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m7.25 3.75l-4.5 4.5l4.5 4.5m6-4.5H2.75"
          />
        </svg>
        <h5
          class="text--lg text--bold primary-500 section-title"
          *ngIf="filterModalState !== 'nav-menu'"
        >
          {{
            filterModalState === "filter-menu"
              ? (currentFilter.label | titlecase)
              : "Trier par"
          }}
        </h5>
        <svg
          class="close-cross"
          (click)="closeMenu($event)"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M24.879 2.879A3 3 0 1 1 29.12 7.12l-8.79 8.79a.125.125 0 0 0 0 .177l8.79 8.79a3 3 0 1 1-4.242 4.243l-8.79-8.79a.125.125 0 0 0-.177 0l-8.79 8.79a3 3 0 1 1-4.243-4.242l8.79-8.79a.125.125 0 0 0 0-.177l-8.79-8.79A3 3 0 0 1 7.12 2.878l8.79 8.79a.125.125 0 0 0 .177 0l8.79-8.79Z"
          />
        </svg>
      </section>
      <section *ngIf="activeFilterList.length > 0" class="btn-reset-filter">
        <section
          *ngIf="activeFilterList.length > 0 && isMobileDisplay === true"
          class="active-filter-list--mobile"
        >
          <section
            class="badge-group badge-group--primary"
            *ngFor="let filter of activeFilterList"
          >
            <label>{{ filter.label }}</label>
            <span
              class="badge badge--ico badge--md badge--primary"
              (click)="removeFilterItem(value, filter.label)"
              *ngFor="let value of filter.values"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 15 15"
                class="clickable"
              >
                <path
                  fill="currentColor"
                  d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"
                />
              </svg>
              {{ getFormattedFilterValue(filter.type, value) }}
            </span>
          </section>
        </section>
        <button class="btn btn--sm btn--white btn--ico" (click)="resetFilter()">
          Réinitialiser
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path fill="currentColor" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
        </button>
      </section>
      <section class="menu__body">
        <!-- Order section -->
        <section *ngIf="mode !== 'filter' && filterModalState === 'nav-menu'" (click)="filterModalState = 'order-menu'" class="order-btn">
          <div class="order-btn__col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 3v18M6 3l4 4M6 3L2 7m16 14V3m0 18l4-4m-4 4l-4-4"
              />
            </svg>
            <h3 class="text--lg text--bold primary-500 m-0">Trier</h3>
          </div>
          <div class="order-btn__col text--sm text--regular gray-600">
            Par {{ currentOrder.label }}
            {{ currentOrder.direction === "asc" ? "croissant" : "décroissant" }}
          </div>
          <div class="order-btn__col">
            <svg
              class="arrow primary-500"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 12 12"
            >
              <path
                fill="currentColor"
                d="M2.646 2.854a.5.5 0 1 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L5.793 6L2.646 2.854ZM10 2.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Z"
              />
            </svg>
          </div>
        </section>
        <section *ngIf="filterModalState === 'order-menu'" class="order-option-list">
          <span *ngFor="let option of orderConfig" class="order-option-list__item" [class.selected]="currentOrder.cat === option.cat">
            <p class="text--md text--regular primary-500">{{ option.label }}</p>
          </span>
        </section>
        <!-- Filter section -->
        <button *ngIf="filterModalState === 'filter-menu' && currentFilter.type !== 'check'" (click)="emitFilterChange()" class="btn btn--sm btn--primary btn-emit-filter">Valider</button>
        <input *ngIf="filterModalState === 'filter-menu' && currentFilter.type === 'list'" type="texte" placeholder="Rechercher...." [formControl]="filterSearchCtrl" class="input--text">
        <section *ngIf="mode !== 'order' && filterModalState === 'nav-menu'" class="filter-header">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="#697586"
              stroke-linecap="round"
              stroke-width="2"
            >
              <path d="M3 5h4m14 0H11m-8 7h12m6 0h-2M3 19h2m16 0H9" />
              <circle cx="9" cy="5" r="2" />
              <circle cx="17" cy="12" r="2" />
              <circle cx="7" cy="19" r="2" />
            </g>
          </svg>
          <h3 class="text--lg text--bold primary-500 m-0">Filtrer</h3>
        </section>
        <!-- Filter category -->
        <section *ngIf="mode !== 'order' && filterModalState === 'nav-menu' && filterConfig.length > 0" class="filter-category-list">
          <!-- Filter category with check -->
          <div class="filter-category-list__item" (click)="handleCategoryClick($event, category)" [attr.type]="category.type" [class.selected]="isCategoryActive(category.cat)" *ngFor="let category of filterConfigWithoutRangeItems">
            <p class="text--md text--regular primary-500">{{ category.label }}</p>
            <svg
            *ngIf="category.type !== 'check'"
            class="arrow primary-500"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 12 12"
          >
            <path
              fill="currentColor"
              d="M2.646 2.854a.5.5 0 1 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L5.793 6L2.646 2.854ZM10 2.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Z"
            />
          </svg>
          </div>
          <!-- Filter category for range -->
          <div class="filter-category-list__item range-item" [attr.type]="item.type" [class.selected]="isCategoryActive(item.cat)" *ngFor="let item of filterConfigWithRangeItems">
            <p class="text--md text--regular primary-500">{{ item.label }}</p>
            <section class="input-container">
              <input [formControl]="rangeMinControl" type="text" appOnlyNumbers class="input--text" placeholder="Minimum" (focus)="setCurrentFilter(item)">
              <input [formControl]="rangeMaxControl" type="text" appOnlyNumbers class="input--text" placeholder="Maximum" (focus)="setCurrentFilter(item)">
            </section>
          </div>
        </section>
        <!-- Filter category - list -->
        <section *ngIf="filterModalState === 'filter-menu' && currentFilter.type === 'list'" class="filter-option-list">
          <span *ngFor="let option of currentFilter.values" class="filter-option-list__item" (click)="handleAddFilterValue(option)" [class.selected]="isValueActive(option)">
            <p class="text--md text--regular primary-500">{{ option }}</p>
          </span>
        </section>
        <!-- Filter category - date -->
        <section *ngIf="filterModalState === 'filter-menu' && currentFilter.type === 'date'" class="filter-option-date">
          <span *ngFor="let date of dateListLabel" class="filter-option-date__item" (click)="addDateFilter(date.value)" [class.selected]="isSelectedDateFilter(date.value)">
            <p class="text--md text--regular primary-500">{{ date.label }}</p>
          </span>
          <mat-form-field style="width: calc(100% - 0.5em);">
            <mat-label>Période personalisée</mat-label>
            <mat-date-range-input
              [formGroup]="dateRange"
              (click)="date.open()"
              [rangePicker]="date"
            >
              <input matStartDate formControlName="start" />
              <input matEndDate formControlName="end" />
            </mat-date-range-input>
            <mat-datepicker-toggle class="picker" matSuffix [for]="date">
            </mat-datepicker-toggle>
            <mat-date-range-picker touchUi #date></mat-date-range-picker>
          </mat-form-field>
        </section>
      </section>
    </section>
  </article>

  `,
  styles: ``
})
export class BibliolibFilterComponent implements OnInit {
  @Input({ required: true }) mode!: 'filter' | 'order' | 'filter-order';
  @Input() orderConfig: FilterConfig.IOrderItemConfig[] = [];
  @Input() filterConfig: FilterConfig.IFullFilterItemConfig[] = [];
  @Input() activeFilterList: FilterConfig.IFullFilterItemConfig[] = [];

  @Output() orderChange: EventEmitter<FilterConfig.IOrderItemForRequest> = new EventEmitter<FilterConfig.IOrderItemForRequest>();
  @Output() filterChange: EventEmitter<FilterConfig.IFullFilterItemConfig[]> = new EventEmitter<FilterConfig.IFullFilterItemConfig[]>();
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.filterModalState !== 'hidden') {
      this.filterModalState = 'hidden';
      this.onStateChange();
    }
  }

  @HostListener('document:click', ['$event']) clickout(event: Event) {
    if (this.filterModalState !== 'hidden' && !this.isChildOfMenu(event, '.menu') && !this.isChildOfMenu(event, '.mat-datepicker-content')) {
      this.filterModalState = 'hidden';
      this.onStateChange();
    }
  }


  filterModalState: 'hidden' | 'nav-menu' | 'order-menu' | 'filter-menu' = 'nav-menu';
  currentOrder!: FilterConfig.IOrderItemForRequest;
  currentFilter!: FilterConfig.IFullFilterItemConfig;

  tempSelectedFilter: FilterConfig.IFullFilterItemConfig[] = [];

  filterSearchCtrl: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  dateRange!: FormGroup;
  startDateControl: FormControl = new FormControl();
  endDateControl: FormControl = new FormControl();

  rangeMinControl: FormControl = new FormControl('', { nonNullable: true });
  rangeMaxControl: FormControl = new FormControl('', { nonNullable: true });

  filterConfigWithoutRangeItems: FilterConfig.IFullFilterItemConfig[] = [];
  filterConfigWithRangeItems: FilterConfig.IFullFilterItemConfig[] = [];

  isMobileDisplay: boolean = false;

  dateListLabel = [
    {
      value: 'today',
      label: 'Aujourd\'hui'
    },
    {
      value: 'yesterday',
      label: 'Hier'
    },
    {
      value: 'week',
      label: 'Semaine en cours'
    },
    {
      value: 'month',
      label: 'Mois en cours'
    },
    {
      value: 'trimester',
      label: 'Trimestre en cours'
    },
    {
      value: 'year',
      label: 'Année en cours'
    }
  ]


  constructor(private datePipe: DatePipe, private renderer: Renderer2, private dateService: BibliolibFilterService) { }

  ngOnInit(): void {
    if (this.mode === 'order' || this.mode === 'filter-order') {
      this.currentOrder = {
        cat: this.orderConfig[0].cat,
        label: this.orderConfig[0].label,
        direction: 'asc'
      }
    }

    if(this.mode === 'filter' || this.mode === 'filter-order') {

      this.filterConfigWithoutRangeItems = this.filterConfig.filter(f => f.type !== 'numeric_range');
      this.filterConfigWithRangeItems = this.filterConfig.filter(f => f.type === 'numeric_range');

      this.dateRange = new FormGroup({
        start: this.startDateControl,
        end: this.endDateControl
      }, { updateOn: 'blur' });

      this.dateRange.valueChanges.subscribe(value => {
        if (value.start && value.end) {
          this.addDateFilter('custom');
        }
      });

      this.filterSearchCtrl.valueChanges.subscribe(value => { 
        if (value !== '') {
          const _currentCategory = this.filterConfig.find(f => f.cat === this.currentFilter.cat);
          if (_currentCategory) {
            const newValues = _currentCategory.values.filter(v => v.toLowerCase().includes(value.toLowerCase()));
            this.currentFilter = { ...this.currentFilter, values: newValues };
          }
        } else {
          // Si la valeur est vide, utilisez les valeurs d'origine de _currentCategory
          const _currentCategory = this.filterConfig.find(f => f.cat === this.currentFilter.cat);
          if (_currentCategory) {
            this.currentFilter = { ...this.currentFilter, values: _currentCategory.values };
          }
        }
        
      });

      this.rangeMinControl.valueChanges.subscribe(value => {
        if (value.length > 0) {
          this.addNumericRangeFilter(value, 'min');
        } else {
          this.addNumericRangeFilter('null', 'min');
        }
      })

      this.rangeMaxControl.valueChanges.subscribe(value => {
        if (value.length > 0) {
          this.addNumericRangeFilter(value, 'max');
        } else {
          this.addNumericRangeFilter('null', 'max');
        }
      })
    }

    this.isMobileDisplay = document.body.offsetWidth < 1200;

    const checkScreenSize = () => document.body.offsetWidth < 1200;

    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(throttleTime(500), map(checkScreenSize));

    screenSizeChanged$.subscribe(isMobile => {
      if (isMobile) {
        this.isMobileDisplay = true;
      } else {
        this.isMobileDisplay = false;
      }
    });
  }

  /**
   * Permet de réinitialiser le module de filtre/tri
   */
  resetFilter() {
    this.tempSelectedFilter = [];
    this.emitFilterChange();
    this.filterModalState = 'hidden';
    this.onStateChange();
  }

  removeFilterItem(value: string, label: string) {
    const filterIndex = this.tempSelectedFilter.findIndex(f => f.label === label);
    console.log(filterIndex);
    if (this.tempSelectedFilter[filterIndex] && this.tempSelectedFilter[filterIndex].values.length === 1) {
      this.removeFilter(filterIndex);
    } else {
      this.removeValueFromExistingFilter(filterIndex, value);
    }
    this.emitFilterChange();
  }

  /**
   * Retourne le label du bouton de filtre en fonction du mode sélectionné
   * @returns {string} 'Filtrer' | 'Trier' | 'Filtrer/Trier'
   */
  getFilterButtonLabel(): string {
    switch (this.mode) {
      case 'filter':
        return 'Filtrer';
      case 'order':
        return 'Trier';
      case 'filter-order':
        return 'Filtrer/Trier';
      default:
        return 'Filtrer/Trier';
    }
  }

  /**
   * Retourne la valeur du filtre formatée pour l'affichage en fonction du type de filtre
   * @param {string} filterType 'date' | 'numeric_range' | 'list'
   * @param {string} value valeur du filtre
   * @returns {string} valeur formatée pour l'affichage
   */
  getFormattedFilterValue(filterType: string, value: string): string {
    switch (filterType) {
      case 'date':
        return this.datePipe.transform(value.split('|')[0], 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(value.split('|')[1], 'dd/MM/yyyy');
      case 'numeric_range':
        return (value.split('|')[0] != 'null' ? value.split('|')[0] : '0') + ' - ' + (value.split('|')[1] != 'null' ? value.split('|')[1] : '∞');
      default:
        return value;
    }
  }

  /**
   * Permet d'ouvrir le menu de filtre/tri
   * @param {Event} e Event
   */
  toggleMenu(e: Event) {
    e.stopPropagation();
    this.filterModalState = 'nav-menu';
    this.onStateChange();
  }

  /**
   * Permet de fermer le menu de filtre/tri
   * @param {Event} e Event
   */
  closeMenu(e: Event) {
    e.stopPropagation();
    this.filterModalState = 'hidden';
    this.onStateChange();
  }

  /**
   * Permet de bloquer le scroll de la page lorsque le menu de filtre/tri est ouvert
   */
  onStateChange() {
    this.filterModalState !== 'hidden' ? this.renderer.setStyle(document.body, 'overflow', 'hidden') : this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  /**
   * Permet de determiner si l'élément cliqué est dans le menu de filtre/tri
   * @param {Event} event Event
   * @param {string} className nom de la classe à sélectionner
   * @returns {boolean} true si l'élément cliqué est dans le menu de filtre/tri
   */
  isChildOfMenu(event: Event, className: string): boolean {
    const elements = document.querySelector(className);
    return elements != null && elements.contains(event.target as Node);
  }

  /**
   * Permet de déclencher le bon évènement en fonction du type de filtre
   * @param {Event} e Event
   * @param {FilterConfig.IOrderItemConfig} order FilterConfig.IOrderItemConfig
   */
  handleCategoryClick(e: Event, filter: FilterConfig.IFullFilterItemConfig) {
    e.stopPropagation();
    switch (filter.type) {
      case 'check':
        if (this.isCategoryActive(filter.cat)) {
          this.tempSelectedFilter = this.tempSelectedFilter.filter(f => f.cat !== filter.cat);
        } else {
          this.tempSelectedFilter.push(filter);
        }
        this.filterChange.emit(this.tempSelectedFilter);
        break;
      default:
        this.filterModalState = 'filter-menu';
        this.currentFilter = filter;
        break;
    }
  }

  /**
   * Permet de savoir si la catégorie du filtre est active
   * @param {string} cat catégorie du filtre
   */
  isCategoryActive(cat: string): boolean {
    return this.activeFilterList.some(filter => filter.cat === cat);
  }

    /**
   * Permet de savoir si la valeur du filtre est active
   * @param {string} cat catégorie du filtre
   */
  isValueActive(value: string): boolean {
    return this.activeFilterList.some(filter => filter.cat === this.currentFilter.cat && filter.values.includes(value)) || this.tempSelectedFilter.some(filter => filter.cat === this.currentFilter.cat && filter.values.includes(value));
  }

  /**
   * Permet de déclencher le bon évènement en fonction de l'etat de la catégorie du filtre (actif/inactif)
   * @param {string} value valeur du filtre
   */
  handleAddFilterValue(value: string) {
    const filterExists = this.tempSelectedFilter.some(filter => filter.cat === this.currentFilter.cat);
    if (filterExists) {
      this.updateExistingFilter(value);
    } else {
      this.createNewFilter(value);
    }
  }

  /**
   * Permet de mettre à jour une catégorie de filtre actif
   * @param {string} value valeur du filtre
   */
  private updateExistingFilter(value: string) {
    const catIndex = this.tempSelectedFilter.findIndex(filter => filter.cat === this.currentFilter.cat);

    if (this.isValueActive(value)) {
      this.removeValueFromExistingFilter(catIndex, value);

    } else {
      this.addValueToExistingFilter(catIndex, value);
    }

    if (catIndex !== -1 && this.tempSelectedFilter[catIndex].values.length === 0) {
      this.removeFilter(catIndex);
    }
  }
  
  /**
   * Permet de supprimer une valeur d'une catégorie de filtre actif
   * @param {number} catIndex index de la catégorie dans le tableau de filtre
   * @param {string} value valeur du filtre
   */
  private removeValueFromExistingFilter(catIndex: number, value: string) {
    const values = this.tempSelectedFilter[catIndex].values;
    const valueIndex = values.indexOf(value);

    if (valueIndex !== -1) {
      this.tempSelectedFilter[catIndex] = { ...this.tempSelectedFilter[catIndex], values: values.filter(v => v !== value) };
    }
    this.filterChange.emit(this.tempSelectedFilter);
  }

  /**
   * Permet d'ajouter une valeur à une catégorie de filtre actif
   * @param {number} catIndex index de la catégorie dans le tableau de filtre
   * @param {string} value valeur du filtre
   */
  private addValueToExistingFilter(catIndex: number, value: string) {
    const existingFilter = this.tempSelectedFilter[catIndex];

    if (existingFilter) {
      this.tempSelectedFilter[catIndex] = { ...existingFilter, values: [...existingFilter.values, value] };
    }
  }

  /**
   * Permet de supprimer une catégorie de filtre du tableau de filtre actif
   * @param {number} catIndex index de la catégorie dans le tableau de filtre
   */
  private removeFilter(catIndex: number) {
    this.tempSelectedFilter = [...this.tempSelectedFilter.filter((filter, index) => index !== catIndex)];
    this.filterChange.emit(this.tempSelectedFilter);
  }


  /**
   * Permet de rajouter une catégorie de filtre au tableau de filtre actif
   * @param {string} value valeur du filtre
   */
  private createNewFilter(value: string) {
    this.tempSelectedFilter.push({
      cat: this.currentFilter.cat,
      label: this.currentFilter.label,
      type: this.currentFilter.type,
      values: [value]
    });
  }

  emitFilterChange() {
    this.filterChange.emit(this.tempSelectedFilter);
    this.dateRange.reset();
  }

  /**
   * Vérifie si une valeur de date spécifiée est sélectionnée dans les filtres temporaires
   * @param {string} value La valeur du label de la date à vérifier (today, yesterday, week, month, trimester, year)
   * @returns {boolean} Retourne true si la date est sélectionnée, sinon false
   */
  isSelectedDateFilter(value: string): boolean {
    switch (value) {
      case 'today':
        const today = new Date();
        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0, 0).toISOString() + '|' + new Date(today.getFullYear(), today.getMonth(), today.getDate(), 25, 59, 0, 0).toISOString()) ? true : false;
      case 'yesterday':
        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(this.dateService.getStartYesterdayDate() + '|' + this.dateService.getEndYesterdayDate()) ? true : false;
      case 'week':
        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(this.dateService.getStartWeekDate() + '|' + this.dateService.getEndWeekDate()) ? true : false;
      case 'month':
        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(this.dateService.getStartMonthDate() + '|' + this.dateService.getEndMonthDate()) ? true : false;
      case 'trimester':
        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(this.dateService.getStartTrimesterDate() + '|' + this.dateService.getEndTrimesterDate()) ? true : false;
      case 'year':
        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(this.dateService.getStartYearDate() + '|' + this.dateService.getEndYearDate()) ? true : false;
      default:
        return false;
    }
  }

  /**
   * Vérifie si un filtre de date spécifié est actuellement sélectionné parmi les filtres temporaires
   * @param {string} label Le label du filtre de date à vérifier
   * @returns {boolean} Retourne true si le filtre de date est actuellement sélectionné, sinon false
   */
  checkCurrentDateFilter(label: string): boolean {
    return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === label) ? true : false;
  }

  /**
   * Ajoute un filtre de date à la liste des filtres temporaires en fonction de la valeur spécifiée
   * @param {string} value La valeur du filtre de date à ajouter (today, yesterday, week, month, trimester, year, custom)
   */
  addDateFilter(value: string) {
    if (value !== 'custom') {
      const dateServiceFunctions: any = {
        today: ['getStartTodayDate', 'getEndTodayDate'],
        yesterday: ['getStartYesterdayDate', 'getEndYesterdayDate'],
        week: ['getStartWeekDate', 'getEndWeekDate'],
        month: ['getStartMonthDate', 'getEndMonthDate'],
        trimester: ['getStartTrimesterDate', 'getEndTrimesterDate'],
        year: ['getStartYearDate', 'getEndYearDate'],
      };
    
      const dateService: any = this.dateService;
      const [startFunc, endFunc] = dateServiceFunctions[value];
    
      if (!this.checkCurrentDateFilter(this.currentFilter.label)) {
        this.createNewFilter(dateService[startFunc]() + '|' + dateService[endFunc]());
      } else {
        const indexToReplace = this.tempSelectedFilter.findIndex(item => item.label === this.currentFilter.label);
        this.tempSelectedFilter[indexToReplace] = { ...this.tempSelectedFilter[indexToReplace], values: [dateService[startFunc]() + '|' + dateService[endFunc]()] };
      }
    } else {
      if (!this.checkCurrentDateFilter(this.currentFilter.label)) {
        this.createNewFilter(this.dateRange.value.start + '|' + this.dateRange.value.end);
      } else {
        const indexToReplace = this.tempSelectedFilter.findIndex(item => item.label === this.currentFilter.label);
        this.tempSelectedFilter[indexToReplace] = { ...this.tempSelectedFilter[indexToReplace], values: [this.dateRange.value.start + '|' + this.dateRange.value.end] };
      }
    }
  }

  setCurrentFilter(value: FilterConfig.IFullFilterItemConfig) {
    this.currentFilter = value;
  }

  emitOnChangeNumericRange() {
    if (this.rangeMinControl.value !== '' && this.rangeMaxControl.value !== '') {
      this.emitFilterChange();
    }
  }

  checkIfFilterIsInTemp() {
    return this.tempSelectedFilter.find(item => item.cat === this.currentFilter.cat);
  }

  addNumericRangeFilter(value: string, input: 'min' | 'max') {
    if (this.checkIfFilterIsInTemp()) {
      const categoryIndex = this.tempSelectedFilter.findIndex(item => item.label === this.currentFilter.label);
      switch (input) {
        case 'min':
          const max = this.tempSelectedFilter[categoryIndex].values[0].split('|')[1];
          this.tempSelectedFilter[categoryIndex] = max != 'null' 
            ? 
            {
              ...this.tempSelectedFilter[categoryIndex],
              values: [value + '|' + max] 
            }
            : 
            {
              ...this.tempSelectedFilter[categoryIndex],
              values: [value + '|null']
            };
          break;
        case 'max':
          const min = this.tempSelectedFilter[categoryIndex].values[0].split('|')[0];
          this.tempSelectedFilter[categoryIndex] = min != 'null' 
            ? 
            {
              ...this.tempSelectedFilter[categoryIndex],
              values: [min + '|' + value] 
            }
            : 
            {
              ...this.tempSelectedFilter[categoryIndex],
              values: ['null|' + value]
            };
          break;
        default:
          break;
      }
    }
    else {
      switch (input) {
        case 'min':
          this.createNewFilter(value + '|null');
          break;
        case 'max':
          this.createNewFilter('null|' + value);
          break;
        default:
          break;
      }
    }

    const filter = this.checkIfFilterIsInTemp();

    if (filter) {
      const max = filter.values[0].split('|')[1];
      const min = filter.values[0].split('|')[0];
      if (max !== 'null' && min !== 'null') {
        if(+max > +min) {
          this.filterChange.emit(this.tempSelectedFilter);
        }
      }
    }
  }
}
