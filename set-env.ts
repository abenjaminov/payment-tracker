const writeFile = require('fs').writeFile;
const dotenv = require('dotenv');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.prod.ts';
// Load node modules
const colors = require('colors');

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   airtableBaseId: '${process.env['AIRTABLE_BASE_ID']}',
   airtableApiKey: '${process.env['AIRTABLE_API_KEY']}',
   production: ${process.env['PRODUCTION'] ?? 'false'}
};
`;
console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
  }
});
