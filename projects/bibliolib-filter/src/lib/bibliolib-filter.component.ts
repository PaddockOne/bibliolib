import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit,
  OutputEmitterRef,
  Renderer2,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import { fromEvent, map, throttleTime } from 'rxjs';
import { getAnimations } from './animations';
import { BibliolibFilterService } from './bibliolib-filter.service';
import { FilterConfig } from './filter-config.model';
import { OnlyNumbersDirective } from './only-numbers.directive';

@Component({
  selector: 'bibliolib-filter',
  templateUrl: './bibliolib-filter.component.html',
  styleUrls: ['./bibliolib-filter.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TuiInputDateRangeModule,
  ],
  providers: [TitleCasePipe, OnlyNumbersDirective],
  animations: getAnimations(),
})
export class BibliolibFilterComponent implements OnInit, AfterViewInit {
  mode = input.required<'filter' | 'order' | 'filter-order' | 'search-only'>();
  orderConfig = input<FilterConfig.OrderItemConfig[]>([]);
  filterConfig = input<FilterConfig.FullFilterItemConfig[]>([]);
  activeFilterList = input<FilterConfig.FullFilterItemConfig[]>([]);
  lang = input<'fr-FR' | 'en-US'>('fr-FR');

  orderChange: OutputEmitterRef<FilterConfig.OrderItemForRequest> =
    output<FilterConfig.OrderItemForRequest>();
  filterChange: OutputEmitterRef<FilterConfig.FullFilterItemConfig[]> =
    output<FilterConfig.FullFilterItemConfig[]>();
  searchChange: OutputEmitterRef<string> = output<string>();

  @HostListener('window:resize', [])
  onWindowResize(): void {
    this.updateCSSVariable();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (this.filterModalState !== 'hidden') {
      this.filterModalState = 'hidden';
      this.onStateChange();
    }
  }

  @HostListener('document:click', ['$event']) clickout(event: Event) {
    event.stopPropagation();
    const targettedElement = event.target as HTMLElement;
    if (
      this.filterModalState !== 'hidden' &&
      !this.isChildOfMenu(event, '.menu') &&
      !this.isChildOfMenu(event, '.t-scroll') &&
      !this.isChildOfMenu(event, 'tui-input-date-range') &&
      !this.isChildOfMenu(event, 'tui-calendar-range')
    ) {
      if (
        !targettedElement.classList.contains('dont-hide') &&
        !(targettedElement.id == 'year-btn') &&
        !targettedElement.classList.contains('t-cell')
      ) {
        this.filterModalState = 'hidden';
        this.onStateChange();
      }
    }
  }

  filterModalState: 'hidden' | 'nav-menu' | 'order-menu' | 'filter-menu' =
    'hidden';
  currentOrder!: FilterConfig.OrderItemForRequest;
  currentFilter!: FilterConfig.FullFilterItemConfig;

  tempSelectedFilter: FilterConfig.FullFilterItemConfig[] = [];

  searchCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });
  filterSearchCtrl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
  });

  customDateCtrl = new FormControl<TuiDayRange | null>(null, {
    nonNullable: true,
  });

  rangeControls: {
    [key: string]: FormGroup<{
      min: FormControl<string>;
      max: FormControl<string>;
    }>;
  } = {};

  filterConfigWithoutRangeItems = computed(() =>
    this.filterConfig().filter((f) => f.type !== 'numeric_range')
  );
  filterConfigWithRangeItems = computed(() =>
    this.filterConfig().filter((f) => f.type === 'numeric_range')
  );

  isMobileDisplay: boolean = false;

  dateListLabel = [
    {
      value: 'today',
      label: this.lang() === 'fr-FR' ? "Aujourd'hui" : 'Today',
    },
    {
      value: 'yesterday',
      label: this.lang() === 'fr-FR' ? 'Hier' : 'Yesterday',
    },
    {
      value: 'week',
      label: this.lang() === 'fr-FR' ? 'Semaine en cours' : 'Current week',
    },
    {
      value: 'month',
      label: this.lang() === 'fr-FR' ? 'Mois en cours' : 'Current month',
    },
    {
      value: 'trimester',
      label:
        this.lang() === 'fr-FR' ? 'Trimestre en cours' : 'Current trimester',
    },
    {
      value: 'year',
      label: this.lang() === 'fr-FR' ? 'Année en cours' : 'Current year',
    },
  ];

  constructor(
    @Inject(Renderer2) private renderer: Renderer2,
    private dateService: BibliolibFilterService
  ) {
    effect(() => {
      if (this.mode() === 'filter' || this.mode() === 'filter-order') {
        this.addDefaultValueToCheckFilter();
        this.updateFormControls();
      }
    });
  }

  ngOnInit(): void {
    if (this.mode() === 'order' || this.mode() === 'filter-order') {
      this.currentOrder = {
        cat: this.orderConfig()[0].cat,
        label: this.orderConfig()[0].label,
        direction: 'asc',
      };
    }

    if (this.mode() === 'filter' || this.mode() === 'filter-order') {
      this.tempSelectedFilter = [...this.activeFilterList()];

      this.customDateCtrl.valueChanges.subscribe((value) => {
        this.addDateFilter('custom');
      });

      this.filterSearchCtrl.valueChanges.subscribe((value) => {
        if (value !== '') {
          const normalizedValue = this.removeAccents(value.toLowerCase());

          const _currentCategory = this.filterConfig().find(
            (f) => f.cat === this.currentFilter.cat
          );
          if (_currentCategory) {
            const newValues = _currentCategory.values.filter((v) =>
              this.removeAccents(v.toLowerCase()).includes(normalizedValue)
            );
            this.currentFilter = { ...this.currentFilter, values: newValues };
          }
        } else {
          // Si la valeur est vide, utilisez les valeurs d'origine de _currentCategory
          const _currentCategory = this.filterConfig().find(
            (f) => f.cat === this.currentFilter.cat
          );
          if (_currentCategory) {
            this.currentFilter = {
              ...this.currentFilter,
              values: _currentCategory.values,
            };
          }
        }
      });

      this.searchCtrl.valueChanges.subscribe((value) => {
        if (value === '') {
          this.searchChange.emit(value);
        }
      });
    }

    this.isMobileDisplay = document.body.offsetWidth < 1200;

    const checkScreenSize = () => document.body.offsetWidth < 1200;

    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(
      throttleTime(500),
      map(checkScreenSize)
    );

    screenSizeChanged$.subscribe((isMobile) => {
      if (isMobile) {
        this.isMobileDisplay = true;
      } else {
        this.isMobileDisplay = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateCSSVariable();
  }

  addDefaultValueToCheckFilter() {
    const allCheckFilters = this.filterConfig()
      .filter((f) => f.type === 'check')
      .map((c) => c.cat);
    this.tempSelectedFilter = [...this.activeFilterList()];

    allCheckFilters.forEach((cat) => {
      if (!this.tempSelectedFilter.some((f) => f.cat === cat)) {
        this.tempSelectedFilter.push({
          cat: cat,
          label: this.filterConfig().find((f) => f.cat === cat)?.label || '',
          type: 'check',
          values: ['f'],
        });
      }
    });
  }

  onOrderChange(label: string, cat: string, direction: 'asc' | 'desc') {
    this.currentOrder = {
      label: label,
      cat: cat,
      direction: direction,
    };

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

  removeFilterItem(value: string, label: string, type: string) {
    const filterIndex = this.tempSelectedFilter.findIndex(
      (f) => f.label === label
    );
    if (type === 'check') {
      this.tempSelectedFilter[filterIndex] = {
        ...this.tempSelectedFilter[filterIndex],
        values: ['f'],
      };
    } else if (
      this.tempSelectedFilter[filterIndex] &&
      this.tempSelectedFilter[filterIndex].values.length === 1
    ) {
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
        return (
          value.split('|')[0].split(' ')[0] +
          ' - ' +
          value.split('|')[1].split(' ')[0]
        );
      case 'numeric_range':
        return (
          (value.split('|')[0] != 'null' ? value.split('|')[0] : '0') +
          ' - ' +
          (value.split('|')[1] != 'null' ? value.split('|')[1] : '∞')
        );
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
    this.updateCSSVariable();
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
    this.filterModalState !== 'hidden'
      ? this.renderer.setStyle(document.body, 'overflow', 'hidden')
      : this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  /**
   * Permet de determiner si l'élément cliqué est dans le menu de filtre/tri
   * @param {Event} event Event
   * @param {string} className nom de la classe à sélectionner
   * @returns {boolean} true si l'élément cliqué est dans le menu de filtre/tri
   */
  isChildOfMenu(event: Event, className: string): boolean {
    // Utilisez querySelectorAll pour obtenir tous les éléments correspondants
    const elements = document.querySelectorAll(className);

    // Convertissez NodeList en tableau pour l'itérer
    const elementsArray = Array.from(elements);
    for (let element of elementsArray) {
      if (element.contains(event.target as Node)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Permet de déclencher le bon évènement en fonction du type de filtre
   * @param {Event} e Event
   * @param {FilterConfig.OrderItemConfig} order FilterConfig.OrderItemConfig
   */
  handleCategoryClick(e: Event, filter: FilterConfig.FullFilterItemConfig) {
    e.stopPropagation();
    switch (filter.type) {
      case 'check':
        this.tempSelectedFilter = this.tempSelectedFilter.map((f) => {
          if (f.cat === filter.cat) {
            return {
              ...f,
              values: f.values[0] === 't' ? ['f'] : ['t'],
            };
          } else {
            return f;
          }
        });
        this.filterChange.emit(this.tempSelectedFilter);
        break;
      default:
        this.filterModalState = 'filter-menu';
        this.currentFilter = filter;
        setTimeout(() => this.updateCSSVariable(), 100);
        break;
    }
  }

  /**
   * Permet de savoir si la catégorie du filtre est active
   * @param {string} cat catégorie du filtre
   * @param {string} type type du filtre
   */
  isCategoryActive(cat: string, type: string): boolean {
    if (type === 'check') {
      return this.tempSelectedFilter.some(
        (filter) => filter.cat === cat && filter.values[0] === 't'
      );
    } else {
      return this.activeFilterList().some((filter) => filter.cat === cat);
    }
  }

  /**
   * Permet de savoir si la valeur du filtre est active
   * @param {string} cat catégorie du filtre
   */
  isValueActive(value: string): boolean {
    return (
      this.activeFilterList().some(
        (filter) =>
          filter.cat === this.currentFilter.cat && filter.values.includes(value)
      ) ||
      this.tempSelectedFilter.some(
        (filter) =>
          filter.cat === this.currentFilter.cat && filter.values.includes(value)
      )
    );
  }

  /**
   * Permet de déclencher le bon évènement en fonction de l'etat de la catégorie du filtre (actif/inactif)
   * @param {string} value valeur du filtre
   */
  handleAddFilterValue(value: string) {
    const filterExists = this.tempSelectedFilter.some(
      (filter) => filter.cat === this.currentFilter.cat
    );
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
    const catIndex = this.tempSelectedFilter.findIndex(
      (filter) => filter.cat === this.currentFilter.cat
    );

    if (this.isValueActive(value)) {
      this.removeValueFromExistingFilter(catIndex, value);
    } else {
      this.addValueToExistingFilter(catIndex, value);
    }

    if (
      catIndex !== -1 &&
      this.tempSelectedFilter[catIndex].values.length === 0
    ) {
      this.removeFilter(catIndex);
    }
  }

  /**
   * Permet de supprimer une valeur d'une catégorie de filtre actif
   * @param {number} catIndex index de la catégorie dans le tableau de filtre
   * @param {string} value valeur du filtre
   */
  private removeValueFromExistingFilter(catIndex: number, value: string) {
    if (!this.tempSelectedFilter[catIndex]) {
      this.filterChange.emit(this.tempSelectedFilter);
    }
    const values = this.tempSelectedFilter[catIndex].values;
    const valueIndex = values.indexOf(value);

    if (valueIndex !== -1) {
      this.tempSelectedFilter[catIndex] = {
        ...this.tempSelectedFilter[catIndex],
        values: values.filter((v) => v !== value),
      };
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
      this.tempSelectedFilter[catIndex] = {
        ...existingFilter,
        values: [...existingFilter.values, value],
      };
    }
  }

  /**
   * Permet de supprimer une catégorie de filtre du tableau de filtre actif
   * @param {number} catIndex index de la catégorie dans le tableau de filtre
   */
  private removeFilter(catIndex: number) {
    const filterToRemove = this.tempSelectedFilter[catIndex];
    if (filterToRemove.type === 'numeric_range') {
      this.rangeControls[filterToRemove.cat].controls.min.setValue('', {
        emitEvent: false,
      });
      this.rangeControls[filterToRemove.cat].controls.max.setValue('', {
        emitEvent: false,
      });
    }
    this.tempSelectedFilter = [
      ...this.tempSelectedFilter.filter((filter, index) => index !== catIndex),
    ];
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
      values: [value],
    });
  }

  emitFilterChange() {
    this.filterChange.emit(this.tempSelectedFilter);
    this.customDateCtrl.setValue(null, { emitEvent: false });
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
        const startToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0
        );
        const endToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          0
        );
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Utilisez toLocaleString avec l'option timeZone
        const startTodayLocal = startToday.toLocaleString(undefined, {
          timeZone,
        });
        const endTodayLocal = endToday.toLocaleString(undefined, { timeZone });

        return this.tempSelectedFilter
          .find(
            (item) =>
              item.type === 'date' && item.label === this.currentFilter.label
          )
          ?.values.includes(startTodayLocal + '|' + endTodayLocal)
          ? true
          : false;
      case 'yesterday':
        return this.tempSelectedFilter
          .find(
            (item) =>
              item.type === 'date' && item.label === this.currentFilter.label
          )
          ?.values.includes(
            this.dateService.getStartYesterdayDate() +
              '|' +
              this.dateService.getEndYesterdayDate()
          )
          ? true
          : false;
      case 'week':
        return this.tempSelectedFilter
          .find(
            (item) =>
              item.type === 'date' && item.label === this.currentFilter.label
          )
          ?.values.includes(
            this.dateService.getStartWeekDate() +
              '|' +
              this.dateService.getEndWeekDate()
          )
          ? true
          : false;
      case 'month':
        return this.tempSelectedFilter
          .find(
            (item) =>
              item.type === 'date' && item.label === this.currentFilter.label
          )
          ?.values.includes(
            this.dateService.getStartMonthDate() +
              '|' +
              this.dateService.getEndMonthDate()
          )
          ? true
          : false;
      case 'trimester':
        return this.tempSelectedFilter
          .find(
            (item) =>
              item.type === 'date' && item.label === this.currentFilter.label
          )
          ?.values.includes(
            this.dateService.getStartTrimesterDate() +
              '|' +
              this.dateService.getEndTrimesterDate()
          )
          ? true
          : false;
      case 'year':
        return this.tempSelectedFilter
          .find(
            (item) =>
              item.type === 'date' && item.label === this.currentFilter.label
          )
          ?.values.includes(
            this.dateService.getStartYearDate() +
              '|' +
              this.dateService.getEndYearDate()
          )
          ? true
          : false;
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
    return this.tempSelectedFilter.find(
      (item) => item.type === 'date' && item.label === label
    )
      ? true
      : false;
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
        this.createNewFilter(
          dateService[startFunc]() + '|' + dateService[endFunc]()
        );
      } else {
        const indexToReplace = this.tempSelectedFilter.findIndex(
          (item) => item.label === this.currentFilter.label
        );
        this.tempSelectedFilter[indexToReplace] = {
          ...this.tempSelectedFilter[indexToReplace],
          values: [dateService[startFunc]() + '|' + dateService[endFunc]()],
        };
      }
    } else {
      if (!this.checkCurrentDateFilter(this.currentFilter.label)) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = new Date(
          this.customDateCtrl.value!.from.year,
          this.customDateCtrl.value!.from.month,
          this.customDateCtrl.value!.from.day,
          0,
          0,
          0,
          0
        );
        const endDate = new Date(
          this.customDateCtrl.value!.to.year,
          this.customDateCtrl.value!.to.month,
          this.customDateCtrl.value!.to.day,
          23,
          59,
          59,
          0
        );
        const start = startDate.toLocaleString(undefined, { timeZone });
        const end = endDate.toLocaleString(undefined, { timeZone });
        this.createNewFilter(start + '|' + end);
      } else {
        const indexToReplace = this.tempSelectedFilter.findIndex(
          (item) => item.label === this.currentFilter.label
        );
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startDate = new Date(
          this.customDateCtrl.value!.from.year,
          this.customDateCtrl.value!.from.month,
          this.customDateCtrl.value!.from.day,
          0,
          0,
          0,
          0
        );
        const endDate = new Date(
          this.customDateCtrl.value!.to.year,
          this.customDateCtrl.value!.to.month,
          this.customDateCtrl.value!.from.day,
          23,
          59,
          59,
          0
        );
        const start = startDate.toLocaleString(undefined, { timeZone });
        const end = endDate.toLocaleString(undefined, { timeZone });
        this.tempSelectedFilter[indexToReplace] = {
          ...this.tempSelectedFilter[indexToReplace],
          values: [start + '|' + end],
        };
      }
    }
  }

  /**
   * Ajoute un filtre de type avec/sans à la liste des filtres temporaires en fonction de la valeur spécifiée
   * @param {string} value La valeur du filtre de type avec/sans à ajouter
   */
  addBooleanFilter(value: string) {
    if (!this.checkIfFilterIsInTemp()) {
      this.createNewFilter(value);
    } else {
      const indexToReplace = this.tempSelectedFilter.findIndex(
        (item) => item.label === this.currentFilter.label
      );
      this.tempSelectedFilter[indexToReplace] = {
        ...this.tempSelectedFilter[indexToReplace],
        values: [value],
      };
    }
  }

  isValueBooleanActive(value: string): boolean {
    return this.tempSelectedFilter.some(
      (filter) =>
        filter.cat === this.currentFilter.cat && filter.values.includes(value)
    );
  }

  setCurrentFilter(value: FilterConfig.FullFilterItemConfig) {
    this.currentFilter = value;
  }

  emitOnChangeNumericRange() {
    if (
      this.rangeControls[this.currentFilter.cat].controls.min.value !== '' &&
      this.rangeControls[this.currentFilter.cat].controls.max.value !== ''
    ) {
      this.emitFilterChange();
    }
  }

  checkIfFilterIsInTemp() {
    return this.tempSelectedFilter.find(
      (item) => item.cat === this.currentFilter.cat
    );
  }

  addNumericRangeFilter(value: string, input: 'min' | 'max') {
    if (this.checkIfFilterIsInTemp()) {
      const categoryIndex = this.tempSelectedFilter.findIndex(
        (item) => item.label === this.currentFilter.label
      );
      switch (input) {
        case 'min':
          const max =
            this.tempSelectedFilter[categoryIndex].values[0].split('|')[1];
          this.tempSelectedFilter[categoryIndex] =
            max != 'null'
              ? {
                  ...this.tempSelectedFilter[categoryIndex],
                  values: [value + '|' + max],
                }
              : {
                  ...this.tempSelectedFilter[categoryIndex],
                  values: [value + '|null'],
                };
          break;
        case 'max':
          const min =
            this.tempSelectedFilter[categoryIndex].values[0].split('|')[0];
          this.tempSelectedFilter[categoryIndex] =
            min != 'null'
              ? {
                  ...this.tempSelectedFilter[categoryIndex],
                  values: [min + '|' + value],
                }
              : {
                  ...this.tempSelectedFilter[categoryIndex],
                  values: ['null|' + value],
                };
          break;
        default:
          break;
      }
    } else {
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
        if (+max >= +min) {
          this.filterChange.emit(this.tempSelectedFilter);
        }
      }
    }
  }

  onSearchChange() {
    this.searchChange.emit(this.searchCtrl.value);
  }

  private updateCSSVariable(): void {
    const header = document.querySelector('.menu__header') as HTMLElement;
    const footer = document.querySelector('.btn-emit-filter') as HTMLElement;

    let headerHeight = header?.offsetHeight || 0;
    let footerHeight = footer?.offsetHeight || 0;

    // Ajoute les paddings
    headerHeight +=
      this.getElementPadding(header).top +
      this.getElementPadding(header).bottom;
    footerHeight +=
      this.getElementPadding(footer).top +
      this.getElementPadding(footer).bottom;

    // Ajoute les autres éléments conditionnels
    if (this.mode() != 'order' && this.tempSelectedFilter.length > 0) {
      const reinitBtn = document.querySelector(
        '.btn-reset-filter'
      ) as HTMLElement;
      headerHeight +=
        (reinitBtn?.offsetHeight || 0) +
        this.getElementPadding(reinitBtn).top +
        this.getElementPadding(reinitBtn).bottom;

      if (this.currentFilter?.type === 'list') {
        const searchInput = document.querySelector(
          '.search-filter'
        ) as HTMLElement;
        headerHeight +=
          (searchInput?.offsetHeight || 0) +
          this.getElementPadding(searchInput).top +
          this.getElementPadding(searchInput).bottom;
      }

      if (this.isMobileDisplay) {
        const currentFilter = document.querySelector(
          '.active-filter-list--mobile'
        ) as HTMLElement;
        headerHeight +=
          (currentFilter?.offsetHeight || 0) +
          this.getElementPadding(currentFilter).top +
          this.getElementPadding(currentFilter).bottom;
      }
    }

    if (this.mode() != 'filter') {
      const orderBtn = document.querySelector('.order-btn') as HTMLElement;
      headerHeight +=
        (orderBtn?.offsetHeight || 0) +
        this.getElementPadding(orderBtn).top +
        this.getElementPadding(orderBtn).bottom;
    }

    // Calculer la hauteur disponible
    const availableHeight = window.innerHeight - headerHeight - footerHeight;

    // Mettre à jour la variable CSS
    document.documentElement.style.setProperty(
      '--available-height',
      `${availableHeight}px`
    );
  }

  private getElementPadding(element: HTMLElement): {
    top: number;
    bottom: number;
  } {
    if (!element) return { top: 0, bottom: 0 };

    const computedStyle = window.getComputedStyle(element);
    const paddingTop = parseInt(computedStyle.paddingTop, 10) || 0;
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0;

    return { top: paddingTop, bottom: paddingBottom };
  }

  checkActiveFilterList() {
    return (
      this.activeFilterList().length > 0 &&
      this.activeFilterList().some(
        (f) => !(f.type === 'check' && f.values[0] === 'f')
      )
    );
  }

  removeAccents(str: string) {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  updateFormControls() {
    const items = this.filterConfigWithRangeItems();

    // Parcourir les éléments pour mettre à jour ou ajouter des contrôles
    items.forEach((item) => {
      if (!this.rangeControls[item.cat]) {
        // Si le contrôle n'existe pas, crée-le avec des valeurs par défaut
        this.rangeControls[item.cat] = new FormGroup({
          min: new FormControl('', { nonNullable: true, updateOn: 'blur' }), // Valeur par défaut si absente
          max: new FormControl('', { nonNullable: true, updateOn: 'blur' }), // Valeur par défaut si absente
        });
        this.attachValueChangeSubscriptions(item.cat);
      } else {
        // Si le contrôle existe, mets à jour ses valeurs
        const existingControl = this.rangeControls[item.cat];
        existingControl
          .get('min')
          ?.setValue(existingControl.get('min')?.value || '', {
            emitEvent: false,
          });
        existingControl
          .get('max')
          ?.setValue(existingControl.get('max')?.value || '', {
            emitEvent: false,
          });
      }
    });

    // Supprimer les contrôles qui ne sont plus dans la configuration
    Object.keys(this.rangeControls).forEach((cat) => {
      if (!items.find((item) => item.cat === cat)) {
        delete this.rangeControls[cat];
      }
    });
  }

  attachValueChangeSubscriptions(cat: string) {
    const control = this.rangeControls[cat];

    control.get('min')?.valueChanges.subscribe((value) => {
      if (value.length > 0) {
        this.addNumericRangeFilter(value, 'min');
      } else {
        this.addNumericRangeFilter('null', 'min');
      }
    });

    control.get('max')?.valueChanges.subscribe((value) => {
      if (value.length > 0) {
        this.addNumericRangeFilter(value, 'max');
      } else {
        this.addNumericRangeFilter('null', 'max');
      }
    });
  }

  getFormControl(cat: string, type: 'min' | 'max'): FormControl {
    return this.rangeControls[cat]?.get(type) as FormControl;
  }
}
