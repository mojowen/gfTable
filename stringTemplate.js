ko.templateSources.stringTemplate = function(template, templates) {
	this.templateName = template;
	this.templates = templates;
}

ko.utils.extend(ko.templateSources.stringTemplate.prototype, {
	data: function(key, value) {
		this.templates._data = this.templates._data || {};
		this.templates._data[this.templateName] = this.templates._data[this.templateName] || {};
		if (arguments.length === 1)  return this.templates._data[this.templateName][key]; 
		this.templates._data[this.templateName][key] = value;
	},
	text: function(value) {
		if (arguments.length === 0) return this.templates[this.templateName]; 
		this.templates[this.templateName] = value;   
	},
	foreach: function(value) {
		return '...'
	}
});

//modify an existing templateEngine to work with string templates
function createStringTemplateEngine(templateEngine, templates) {
	templateEngine.makeTemplateSource = function(template) { return new ko.templateSources.stringTemplate(template, templates); }   
	return templateEngine;
}
