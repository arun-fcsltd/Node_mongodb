const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const generatePDF = async (data) => {
    const templatePath = path.join(__dirname, 'templates', 'po_invoice.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = await ejs.render(template, { data });
    // Logic to convert HTML to PDF goes here
};

module.exports = { generatePDF };
