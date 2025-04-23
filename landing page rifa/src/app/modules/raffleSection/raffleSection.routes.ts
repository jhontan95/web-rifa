import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RaffleService } from './shared/services/raffle.service';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Raffle Section',
      scrollDisabled: false,
      toolbarShadowEnabled: false,
      footerVisible: false
    },
    children: [
      {
        path: RaffleService.LANDING_PAGE_ID_ROUTE,
        component: LandingPageComponent
      }
    ]
  }
];
