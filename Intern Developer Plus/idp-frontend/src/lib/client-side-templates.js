htmx.defineExtension('client-side-templates', {
    transformResponse : function(text, xhr, elt) {
        var handlebarsTemplate = htmx.closest(elt, "[handlebars-template]");
        if (handlebarsTemplate) {
            var data = JSON.parse(text);
            var templateId = handlebarsTemplate.getAttribute('handlebars-template');
            var templateElement = htmx.find('#' + templateId).innerHTML;
            var renderTemplate = Handlebars.compile(templateElement);
            if (renderTemplate) {
                return renderTemplate(data);
            } else {
                throw "Unknown handlebars template: " + templateId;
            }
        }

        var handlebarsArrayTemplate = htmx.closest(elt, "[handlebars-array-template]");
        if (handlebarsArrayTemplate) {
            var data = JSON.parse(text);
            var templateId = handlebarsArrayTemplate.getAttribute('handlebars-array-template');
            var templateElement = htmx.find('#' + templateId).innerHTML;
            var renderTemplate = Handlebars.compile(templateElement);
            if (renderTemplate) {
                return renderTemplate(data);
            } else {
                throw "Unknown handlebars template: " + templateId;
            }
        }

        return text;
    }
});