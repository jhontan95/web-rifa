import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RaffleService } from './shared/services/raffle.service';
import { RaffleSectionRoutingConstant } from './shared/constants/raffleSection-routing.constant';

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
        path: RaffleSectionRoutingConstant.LANDING_PAGE_ID_ROUTE,
        component: LandingPageComponent
      }
    ]
  }
];
