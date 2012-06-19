Go Fight Table
===

gfTable is a flexible table binding built on Knockout JS and jQuery. Originally built for use in @mojowen/go-fight-win but can operate in any project you want a flexible table system.

To use it:

 * Add Knockout JS and jQuery to a doc
 * Add table.js
 * Add ` <div class="table" data-bind=" gfTable: grid "></div> ` to your document
 * Make two arrays, rows and fields, and pass them to a new tableModel and then bind the document... like so: `	var grid = new tableModel(_rows, _fields); grid.bind(); `
 * See /lib/factories.js for what these row and field arrays might look like
 * See templates.js for how to add row templates with the `tableModel.__addTemplate(name, template, _width_)` method
 * UPDATED so it plays nice with existing KO templating engine

Work in progress...