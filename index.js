/* jshint node: true */
'use strict';

var path = require('path');
const map = require('broccoli-stew').map;
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-dropzonejs',
  included() {
    this._super.included.apply(this, arguments);
    if (!process.env.EMBER_CLI_FASTBOOT) {
      this.import('vendor/dropzone.min.js');
      this.import('vendor/dropzone.min.css');
    }
  },
  treeForVendor(vendorTree) {
    if (!process.env.EMBER_CLI_FASTBOOT) {
      let trees = [];
      let dropzoneTree = new Funnel(
        path.join(this.project.root, 'node_modules', 'dropzone/dist/min'),
        {
          files: ['dropzone.min.js']
        }
      );

      dropzoneTree = map(dropzoneTree, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

      trees.push(dropzoneTree);

      let dropzoneCssTree = new Funnel(
        path.join(this.project.root, 'node_modules', 'dropzone/dist/min'),
        {
          files: ['dropzone.min.css']
        }
      );

      trees.push(dropzoneCssTree);

      if (vendorTree) {
        trees.push(vendorTree);
      }
      return new MergeTrees(trees);
    }
  }
};
