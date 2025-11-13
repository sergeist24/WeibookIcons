"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = void 0;
const schematics_1 = require("@angular-devkit/schematics");

const banner = [
  '',
  'Weibook Icons',
  '1. Add the following providers to your root module:',
  '   • ...provideWeibookIconDefaults()',
  '   • ...provideWeibookIconManifest()',
  '2. Run "npm run icons:manifest" whenever you add or change SVGs.',
  '3. Store SVG sources under "icons/<variant>/<name>.svg" and commit generated files.',
  '',
].join('\n');

const ngAdd = (_options) => {
  return (tree, context) => {
    context.logger.info(banner);
    return tree;
  };
};
exports.ngAdd = ngAdd;

exports.default = (0, schematics_1.chain)([exports.ngAdd]);

