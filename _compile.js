var fs = require('fs');

var list = JSON.parse(fs.readFileSync('./db/list.json').toString().trim());
var entryTemplateHtml = fs.readFileSync('./db/template.html').toString().trim();
var indexTemplateHtml = fs.readFileSync('./index.template.html').toString().trim();
var massReplace = function (template, context) {
    return template.replace(/\{\{ (.+?) \}\}/g, function () {
        return context[arguments[1]] || '!!!!!ERROR!!!!!';
    })
};

var fillEntryTemplate = function (entryObj) {
    var entryObj_ = JSON.parse(JSON.stringify(entryObj));
    entryObj_.entryContent = entryObj_.entryContent.replace(/\n/g, '<br>');
    return massReplace(entryTemplateHtml, entryObj_);
};

var fillIndexTemplate = function (indexObj) {
    var indexObj_ = JSON.parse(JSON.stringify(indexObj));
    return massReplace(indexTemplateHtml, indexObj_);
};

Object.keys(list).map(function (entryCode) {
    fs.writeFileSync('./entry/' + entryCode + '.html',
        fillEntryTemplate({
            entryContent: fs.readFileSync('./db/' + entryCode + '.txt').toString().trim(),
            entryTitle: list[entryCode],
        })
    );
});

fs.writeFileSync('./index.html',
    fillIndexTemplate({
        indexList: Object.keys(list).map(function (entryCode) {
            return massReplace('<li><a href="./entry/{{ entryCode }}.html">{{ entryTitle }}</a></li>',
            {
                entryCode: entryCode,
                entryTitle: list[entryCode]
            });
        }).join('')
    })
);
