import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService,
         NbSidebarService, NbThemeService,  NbCheckboxModule, } from '@nebular/theme';

import { Observable, Subject } from 'rxjs';
import { delay, share, map, takeUntil  } from 'rxjs/operators';

import { menu } from './dashboardmenu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              // private userService: UserData,
              // private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private route: Router) {
}



  menus =  menu;
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  protected layoutSize$ = new Subject();

  // onChangeLayoutSize(): Observable<any> {
  //   return this.layoutSize$.pipe(
  //     share(),
  //     delay(1),
  //   );
  // }


  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;


    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);


    this.themeService.onThemeChange()
    .pipe(
      map(({ name }) => name),
      takeUntil(this.destroy$),
    )
    .subscribe(themeName => this.currentTheme = themeName);

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  changeLayoutSize() {
    this.layoutSize$.next();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    this.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return true;
  }




}



