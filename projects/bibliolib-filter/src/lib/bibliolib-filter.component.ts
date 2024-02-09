import { Component, EventEmitter, HostListener, OnInit, Output, Renderer2, computed, input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, map, throttleTime } from 'rxjs';
import { FilterConfig } from './filter-config.model';
import { BibliolibFilterService } from './bibliolib-filter.service';
import { getAnimations } from './animations';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { OnlyNumbersDirective } from './only-numbers.directive';

@Component({
  selector: 'bibliolib-filter',
  templateUrl: './bibliolib-filter.component.html',
  styleUrls: ['./bibliolib-filter.component.scss'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [TitleCasePipe, OnlyNumbersDirective],
  animations: getAnimations()
})
export class BibliolibFilterComponent implements OnInit {
  mode = input.required<'filter' | 'order' | 'filter-order' | 'search-only'>();
  orderConfig = input<FilterConfig.IOrderItemConfig[]>([]);
  filterConfig = input<FilterConfig.IFullFilterItemConfig[]>([]);
  activeFilterList = input<FilterConfig.IFullFilterItemConfig[]>([]);
  lang = input<'fr-FR' | 'en-US'>('fr-FR');

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
    const targettedElement = event.target as HTMLElement;

    if (this.filterModalState !== 'hidden' && !this.isChildOfMenu(event, '.menu') && !this.isChildOfMenu(event, '.mat-datepicker-content')) {
      if (!targettedElement.classList.contains('dont-hide')) {
        this.filterModalState = 'hidden';
        this.onStateChange();
      }
    }
  }

  filterModalState: 'hidden' | 'nav-menu' | 'order-menu' | 'filter-menu' = 'hidden';
  currentOrder!: FilterConfig.IOrderItemForRequest;
  currentFilter!: FilterConfig.IFullFilterItemConfig;

  tempSelectedFilter: FilterConfig.IFullFilterItemConfig[] = [];

  filterSearchCtrl: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  dateRange!: FormGroup;
  startDateControl: FormControl = new FormControl();
  endDateControl: FormControl = new FormControl();

  rangeMinControl: FormControl = new FormControl('', { nonNullable: true, updateOn: 'blur' });
  rangeMaxControl: FormControl = new FormControl('', { nonNullable: true, updateOn: 'blur' });

  filterConfigWithoutRangeItems = computed(() => this.filterConfig().filter(f => f.type !== 'numeric_range'));
  filterConfigWithRangeItems = computed(() => this.filterConfig().filter(f => f.type === 'numeric_range'));;

  isMobileDisplay: boolean = false;

  dateListLabel = [
    {
      value: 'today',
      label: this.lang() === 'fr-FR' ? 'Aujourd\'hui' : 'Today'
    },
    {
      value: 'yesterday',
      label: this.lang() === 'fr-FR' ? 'Hier' : 'Yesterday'
    },
    {
      value: 'week',
      label: this.lang() === 'fr-FR' ? 'Semaine en cours' : 'Current week'
    },
    {
      value: 'month',
      label: this.lang() === 'fr-FR' ? 'Mois en cours' : 'Current month'
    },
    {
      value: 'trimester',
      label: this.lang() === 'fr-FR' ? 'Trimestre en cours' : 'Current trimester'
    },
    {
      value: 'year',
      label: this.lang() === 'fr-FR' ? 'Année en cours' : 'Current year'
    }
  ]

  constructor( private renderer: Renderer2, private dateService: BibliolibFilterService) { }

  ngOnInit(): void {
    if (this.mode() === 'order' || this.mode() === 'filter-order') {
      this.currentOrder = {
        cat: this.orderConfig()[0].cat,
        label: this.orderConfig()[0].label,
        direction: 'asc'
      }
    }

    if (this.mode() === 'filter' || this.mode() === 'filter-order') {

      this.tempSelectedFilter = [...this.activeFilterList()];


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
          const _currentCategory = this.filterConfig().find(f => f.cat === this.currentFilter.cat);
          if (_currentCategory) {
            const newValues = _currentCategory.values.filter(v => v.toLowerCase().includes(value.toLowerCase()));
            this.currentFilter = { ...this.currentFilter, values: newValues };
          }
        } else {
          // Si la valeur est vide, utilisez les valeurs d'origine de _currentCategory
          const _currentCategory = this.filterConfig().find(f => f.cat === this.currentFilter.cat);
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

  onOrderChange(label: string, cat: string, direction: 'asc' | 'desc') {
    this.currentOrder = {
      label: label,
      cat: cat,
      direction: direction
    }

    this.filterModalState = 'nav-menu';
    this.orderChange.emit(this.currentOrder);
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
    switch (this.mode()) {
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
        return value.split('|')[0].split(' ')[0] + ' - ' + value.split('|')[1].split(' ')[0];
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
    return this.activeFilterList().some(filter => filter.cat === cat);
  }

  /**
 * Permet de savoir si la valeur du filtre est active
 * @param {string} cat catégorie du filtre
 */
  isValueActive(value: string): boolean {
    return this.activeFilterList().some(filter => filter.cat === this.currentFilter.cat && filter.values.includes(value)) || this.tempSelectedFilter.some(filter => filter.cat === this.currentFilter.cat && filter.values.includes(value));
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
    if(!this.tempSelectedFilter[catIndex]) {
      this.filterChange.emit(this.tempSelectedFilter);
    }
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
        const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 0);
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Utilisez toLocaleString avec l'option timeZone
        const startTodayLocal = startToday.toLocaleString(undefined, { timeZone });
        const endTodayLocal = endToday.toLocaleString(undefined, { timeZone });

        return this.tempSelectedFilter.find(item => item.type === 'date' && item.label === this.currentFilter.label)?.values.includes(startTodayLocal + '|' +  endTodayLocal) ? true : false;
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
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = new Date(this.dateRange.value.start.getFullYear(), this.dateRange.value.start.getMonth(), this.dateRange.value.start.getDate(), 0, 0, 0, 0);
        const endDate = new Date(this.dateRange.value.end.getFullYear(), this.dateRange.value.end.getMonth(), this.dateRange.value.end.getDate(), 23, 59, 59, 0);
        const start = startDate.toLocaleString(undefined, { timeZone });
        const end = endDate.toLocaleString(undefined, { timeZone });
        this.createNewFilter(start + '|' + end);
      } else {
        const indexToReplace = this.tempSelectedFilter.findIndex(item => item.label === this.currentFilter.label);
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = new Date(this.dateRange.value.start.getFullYear(), this.dateRange.value.start.getMonth(), this.dateRange.value.start.getDate(), 0, 0, 0, 0);
        const endDate = new Date(this.dateRange.value.end.getFullYear(), this.dateRange.value.end.getMonth(), this.dateRange.value.end.getDate(), 23, 59, 59, 0);
        const start = startDate.toLocaleString(undefined, { timeZone });
        const end = endDate.toLocaleString(undefined, { timeZone });
        this.tempSelectedFilter[indexToReplace] = { ...this.tempSelectedFilter[indexToReplace], values: [start + '|' + end] };
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
        if (+max > +min) {
          this.filterChange.emit(this.tempSelectedFilter);
        }
      }
    }
  }

  onSearchChange() {
    this.searchChange.emit(this.filterSearchCtrl.value);
  }
}
