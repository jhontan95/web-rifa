
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { RaffleSectionRoutingConstant } from './modules/raffleSection/shared/constants/raffleSection-routing.constant';

export const appRoutes: VexRoutes = [
  {
    path: ``,
    loadChildren: () => import('./modules/raffleSection/raffleSection.routes').then(m => m.routes)
  },
  {
    path: `${RaffleSectionRoutingConstant.PARENT_ROUTE}`,
    loadChildren: () => import('./modules/raffleSection/raffleSection.routes').then(m => m.routes)
  },
];
