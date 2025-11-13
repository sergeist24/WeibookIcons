"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIcon = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const path_1 = require("path");

const DEFAULT_TEMPLATE = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <!-- ${name} icon -->
  <circle cx="12" cy="12" r="9"/>
</svg>
`;

const generateIcon = (options) => {
  return (tree, context) => {
    const variant = options.variant?.trim() || 'filled';
    const name = options.name?.trim();

    if (!name) {
      throw new schematics_1.SchematicsException('Option "name" is required.');
    }

    const relativePath = (0, path_1.join)('icons', variant, `${name}.svg`);

    if (tree.exists(relativePath)) {
      context.logger.warn(`Icon "${name}" with variant "${variant}" already exists at ${relativePath}.`);
      return tree;
    }

    const parentDir = (0, path_1.dirname)(relativePath);
    if (!tree.exists(parentDir)) {
      tree.create((0, path_1.join)(parentDir, '.gitkeep'), '');
      tree.delete((0, path_1.join)(parentDir, '.gitkeep'));
    }

    tree.create(relativePath, DEFAULT_TEMPLATE(name));
    context.logger.info(`Created ${relativePath}. Run "npm run icons:manifest" to regenerate the manifest.`);
    return tree;
  };
};
exports.generateIcon = generateIcon;

exports.default = (options) => (0, schematics_1.chain)([(0, schematics_1.apply)((0, schematics_1.url)('.'), [
  (0, schematics_1.filter)(() => false),
]), (0, schematics_1.branchAndMerge)((0, schematics_1.chain)([(0, schematics_1.callRule)(generateIcon(options))]))]);

