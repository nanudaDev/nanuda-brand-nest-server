require('dotenv').config();
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import * as mysql from 'mysql';

let connection;

function generateCommonCodeTypeFile(callback) {
  connection.query(
    'SELECT `key`, `value`, `category` FROM `common_code` ORDER BY `key` ASC, `value` ASC',
    (err, items) => {
      if (err) throw err;

      console.log(`[generator] common_code data length = ${items.length}`);

      let output = '';
      let codes = {};

      codes = items.reduce((acc, cur, i) => {
        if (!acc[cur.category]) {
          acc[cur.category] = [];
        }
        acc[cur.category].push(cur.value);
        return acc;
      }, {});

      Object.keys(codes).forEach(category => {
        output += `export enum ${category} {\n`;
        codes[category].forEach(value => {
          output += `  ${value} = '${value}',\n`;
        });
        output += `}\n`;
        output += `export const CONST_${category}  = Object.values(${category});\n`;
        output += `\n`;
      });

      const filePath = resolve('src/shared/common-code.type.ts');

      writeFileSync(filePath, output, { encoding: 'utf8' });
      console.log(`[generator] generated file: ${filePath}`);

      if (callback) callback();
    },
  );
}

const generate = (async () => {
  //   const envConfigServcie = new EnvConfigService();
  //   const envConfig = envConfigServcie.env();
  //   console.log(envConfig);
  //   if (!envConfig) {
  //     console.log('No environment');
  //   }
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  generateCommonCodeTypeFile(() => {
    if (connection) connection.end();
    // process.exit();
  });
})();

export { generate };
