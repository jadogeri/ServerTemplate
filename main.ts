import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface TemplateData {
    name: string;
}

async function compileTemplate(templatePath: string, data: TemplateData): Promise<string> {
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate(data);
  } catch (error: any) {
    throw new Error(`Error compiling template: ${error.message}`);
  }
}

export async function generateEmail(templateName: string, data: TemplateData) {
    const templateDir = path.join(__dirname, 'email-templates', templateName);
    const text = await compileTemplate(path.join(templateDir, 'text.hbs'), data);
    const subject = await compileTemplate(path.join(templateDir, 'subject.hbs'), data);
    const html = await compileTemplate(path.join(templateDir, 'html.hbs'), data);

    return { text, subject, html };
}

// Example usage:
async function main() {
    const emailData = { name: 'John Doe' };
    const welcomeEmail = await generateEmail('welcome', emailData);
    console.log('Subject:', welcomeEmail.subject);
    console.log('Text:', welcomeEmail.text);
    console.log('HTML:', welcomeEmail.html);

    const goodbyeEmail = await generateEmail('goodbye', emailData);
     console.log('Subject:', goodbyeEmail.subject);
    console.log('Text:', goodbyeEmail.text);
    console.log('HTML:', goodbyeEmail.html);
}

main().catch(console.error);