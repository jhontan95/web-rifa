const fs = require('fs');
const path = require('path');
const parameter = process.argv[2];

if (!parameter) {
  console.error('Por favor, proporciona un nombre para el state.');
  process.exit(1);
}

const moduleName = lowerCaseFirstLetter(parameter);
const currentDirectory = process.env.INIT_CWD || process.cwd();
console.log(`Ruta en ${currentDirectory}.`);
const modulePath = path.join(currentDirectory, moduleName);

const filesToCreate = [
  `${moduleName}.actions.ts`,
  `${moduleName}.effects.ts`,
  `${moduleName}.reducer.ts`,
  `${moduleName}.selector.ts`,
  `${moduleName}.states.ts`,
];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function lowerCaseFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

fs.mkdirSync(modulePath);

filesToCreate.forEach(file => {
  const filePath = path.join(modulePath, file);
  let fileContent = '';
  let className = capitalizeFirstLetter(moduleName);

  if (moduleName.includes('-')) {
    className = moduleName.split('-').map(word => capitalizeFirstLetter(word)).join('');
  }

  if (file.endsWith('.actions.ts')) {
    fileContent = `import { createActionGroup, props } from '@ngrx/store';
export const ${className}PageActions = createActionGroup({
  source: '${className} Page',
  events: {
    'Common Failure': props<{ page: string; event: string; response: any }>()
  }
});
`;
  } else if (file.endsWith('.effects.ts')) {
    fileContent = `import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ${className}State } from './${moduleName}.states';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService } from '@mele/template/components/notification';
import { EventLoggerService } from '@mele/template/services';
import { tap, of } from 'rxjs';
import { ${className}PageActions as from${className} } from './${moduleName}.actions';

@Injectable()
export class ${className}Effects {
  notifyCommonError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(from${className}.commonFailure),
        tap(action => {
          this.notificationService.showNotification(action.response?.error?.message ?? 'error_service', 'accept');
          this.logger.error(action.page, action.event, action.response);
        })
      ),
    { dispatch: false }
  );

  notifyFailure(page: string, event: string, response: any) {
    return of(from${className}.commonFailure({ page, event, response }));
  }

  constructor(
    private actions$: Actions,
    private notificationService: NotificationService,
    private logger: EventLoggerService,
    private store: Store<${className}State>
  ) {}
}
`;
  } else if (file.endsWith('.reducer.ts')) {
    fileContent = `import { createReducer, on } from '@ngrx/store';
import { ${className}State } from './${moduleName}.states';
import { ${className}PageActions } from './${moduleName}.actions';

export const initialState: ${className}State = { isLoading: false };

export const ${className}Reducer = createReducer(
  initialState,
  on(${className}PageActions.commonFailure, state => {
    return { ...state, isLoading: false };
  })
);
`;
  } else if (file.endsWith('.selector.ts')) {
    fileContent = `import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ${className}State } from './${moduleName}.states';

export const selectFeature = createFeatureSelector<${className}State>('${moduleName}');

// Add your selectors here
export const selectLoading = createSelector(selectFeature, (state: ${className}State) => state.isLoading);
`;
  } else if (file.endsWith('.states.ts')) {
    fileContent = `export interface ${className}State {
  // Add your state properties here
  isLoading: boolean;
}
`;
  }
  fs.writeFileSync(filePath, fileContent);
});

console.log(`Estructura del state ${moduleName} creada exitosamente en ${modulePath}.`);
