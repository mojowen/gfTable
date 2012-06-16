Go Fight ... Table
===

gfTable is a flexible table binding built on Knockout JS and jQuery.

To use it:

 * Add Knockout JS and jQuery to a doc
 * Add table.js
 * Add ` <div class="table" data-bind="template: {name: 'table', with: grid } "></div> ` to your document
 * Make two arrays, rows and fields, and pass them to a new tableModel and then bind the document... like so: `	var grid = new tableModel(_rows, _fields); grid.bind(); `
 * See /lib/factories.js for what these might look like
 * See templates.js for how to add row templates

Work in progress...