const fs = require('fs');
const path = require('path');

// Obtiene el nombre del módulo como argumento de la línea de comandos
const parameter = process.argv[2];

if (!parameter) {
  console.error('Por favor, proporciona un nombre para el módulo.');
  process.exit(1);
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function lowerCaseFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const moduleName = lowerCaseFirstLetter(parameter);
let className = capitalizeFirstLetter(moduleName);

// Rutas de los directorios y archivos que queremos crear
const modulePath = path.join('src/app/modules', moduleName);
const subfolders = ['components', 'models', 'pages', 'shared', ];
const constantsFolder = ['constants','services'];// Nueva carpeta a agregar
const routesFileName = `${moduleName}.routes.ts`;
const routesFilePath = path.join(modulePath, routesFileName);

// Crear la carpeta del módulo
fs.mkdirSync(modulePath);

// Crear las subcarpetas dentro de la carpeta del módulo
subfolders.forEach(subfolder => {
  const subfolderPath = path.join(modulePath, subfolder);
  fs.mkdirSync(subfolderPath);
});

// Crear las carpetas de constantes y servicios dentro de la carpeta "shared"
constantsFolder.forEach(folder => {
  const folderPath = path.join(modulePath, 'shared', folder);
  fs.mkdirSync(folderPath);
});

// Contenido predeterminado para el archivo de rutas
const defaultRoutesContent = `import { VexRoutes } from '@mele/template/interfaces';

const routes: VexRoutes = [
  {
    path: '',
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: false,
      footerVisible: false
    },
    children: []
  }
];

export default routes;
`;

fs.writeFileSync(routesFilePath, defaultRoutesContent);
if (moduleName.includes('-')) {
  className = moduleName.split('-').map(word => capitalizeFirstLetter(word)).join('');
}


// Contenido para el archivo de constantes
const constantsContent = `export class ${className}RoutingConstant {
  static EXAMPLE_ROUTE = '';
}
`;

// Crear el archivo de constantes dentro de la carpeta "constants"
const constantsFileName = `${moduleName}-routing.constant.ts`;
const constantsFilePath = path.join(modulePath, 'shared', 'constants', constantsFileName);
fs.writeFileSync(constantsFilePath, constantsContent);

console.log(`Estructura del módulo ${moduleName} creada exitosamente.`);
