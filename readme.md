Go Fight Table
===

gfTable is a flexible table binding built on Knockout JS and jQuery. Originally built for use in [Go Fight Win](https://github.com/mojowen/Go-Fight-Win) but can operate in any project you want a flexible table system.

To use it:

 * Add Knockout JS and jQuery to a doc
 * Add table.js
 * Add ` <div class="table" data-bind=" gfTable: grid "></div> ` to your document
 * Make two arrays, rows and fields, and pass them to a new tableModel and then bind the document... like so: `	var grid = new tableModel(_rows, _fields); grid.bind(); `
 * The `rows` array should look something like this `rows = [ {field_1: 'data', field_2: 'data'}, ... ]`
 * The `fields` array should look something like this `rows = [ {name: 'field_1'}, {name: 'field_2', type: 'number'}... ]`
 * See /lib/factories.js for a more detailed look what these row and field arrays might look like
 * See templates.js for how to add row templates with the `tableModel.__addTemplate(name, template, _width_)` method
 * UPDATED so it plays nice with existing KO templating engine

Work in progress...

It utilizes
====
 * (jQuery)[http://jquery.com]
 * (Knockout JS)[http://knockoutjs.com]
 * (jQuery UI)[http://jqueryui.com]
 * (jQuery Multiselect)[https://github.com/ehynds/jquery-ui-multiselect-widget]
 * (jQuery Elastic)[http://unwrongest.com/projects/elastic]
 * Native Template engine derived from (Ryan Niemeyer's post on Knock Me Out on native template engines)[http://www.knockmeout.net/2011/10/ko-13-preview-part-3-template-sources.html]
 * And was somewhat inspired by, but I don't believe uses any code from, (Ko Grid)[https://github.com/ericmbarnard/KoGrid]