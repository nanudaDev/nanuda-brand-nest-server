require('dotenv').config();
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import * as mysql from 'mysql';

let connection;

function generateCommonCodeTypeFile(callback) {
  connection.query(
    // tslint:disable-next-line: quotemark
    "SELECT `key`, `value`, `category` FROM `common_code` WHERE `score_code_yn` = 'N' ORDER BY `key` ASC, `value` ASC",
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

function generateScoreCodeTypeFile(callback) {
  connection.query(
    // tslint:disable-next-line: quotemark
    "SELECT `key`, `value`, `category` FROM `common_code` WHERE `score_code_yn` = 'Y' ORDER BY `key` ASC, `value` ASC",
    (err, items) => {
      if (err) throw err;

      console.log(`[generator] common_code data length = ${items.length}`);

      let output = '';
      let codes = {};

      codes = items.reduce((acc, cur, i) => {
        if (!acc[cur.category]) {
          acc[cur.category] = [];
        }
        acc[cur.category].push([cur.key, cur.value]);
        return acc;
      }, {});

      Object.keys(codes).forEach(category => {
        output += `export enum ${category} {\n`;
        codes[category].forEach(value => {
          output += `  ${value[0]} = '${value[1]}',\n`;
        });
        output += `}\n`;
        output += `export const CONST_${category}  = Object.values(${category});\n`;
        output += `\n`;
      });

      const filePath = resolve('src/shared/score-code.type.ts');

      writeFileSync(filePath, output, { encoding: 'utf8' });
      console.log(`[generator] generated file: ${filePath}`);

      if (callback) callback();
    },
  );
}

function generateKbFoodMediumCategory(callback) {
  connection.query(
    // tslint:disable-next-line: quotemark
    "SELECT *  FROM `kb_category_info` WHERE `large_category_cd` = 'F'  GROUP BY `medium_category_cd`",
    (err, items) => {
      if (err) throw err;

      console.log(`[generator] kb_category_info data length = ${items.length}`);

      let output = '';
      let codes = {};

      codes = items.reduce((acc, cur, i) => {
        if (!acc[cur.large_category_cd]) {
          acc[cur.large_category_cd] = [];
        }
        acc[cur.large_category_cd].push([
          cur.medium_category_cd,
          cur.medium_category_nm,
        ]);
        return acc;
      }, {});

      Object.keys(codes).forEach(large_category_cd => {
        output += `export enum KB_FOOD_CATEGORY {\n`;
        codes[large_category_cd].forEach(value => {
          output += `  ${value[0]} = '${value[1]}',\n`;
        });
        output += `}\n`;
        output += `export const CONST_KB_FOOD_CATEGORY  = Object.values(KB_FOOD_CATEGORY);\n`;
        output += `\n`;
      });

      const filePath = resolve('src/shared/kb-food-category.type.ts');

      writeFileSync(filePath, output, { encoding: 'utf8' });
      console.log(`[generator] generated file: ${filePath}`);

      if (callback) callback();
    },
  );
}

function generateCommonCodeCategoryFile(callback) {
  connection.query(
    // tslint:disable-next-line: quotemark
    'SELECT * FROM `common_code`  GROUP BY `category`',
    (err, items) => {
      if (err) throw err;

      console.log(
        `[generator] common_code category data length = ${items.length}`,
      );

      let output = '';
      let codes = {};

      codes = items.reduce((acc, cur, i) => {
        if (!acc[cur.category]) {
          acc[cur.category] = [];
        }
        acc[cur.category].push(cur.category);
        return acc;
      }, {});

      Object.keys(codes).forEach(category => {
        output += `export enum COMMON_CODE_CATEGORY {\n`;
        codes[category].forEach(value => {
          output += `  ${value} = '${value}',\n`;
        });
        output += `}\n`;
        output += `export const COMMON_CODE_CATEGORY  = Object.values(COMMON_CODE_CATEGORY);\n`;
        output += `\n`;
      });

      const filePath = resolve('src/shared/common-code-category.type.ts');

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

  // generateCommonCodeTypeFile(() => {
  //   // if (connection) connection.end();
  //   // process.exit();
  // });

  generateScoreCodeTypeFile(() => {});

  // generateCommonCodeCategoryFile(() => {
  //   if (connection) connection.end();
  // });
})();

const generateKbCategory = (async () => {
  //   const envConfigServcie = new EnvConfigService();
  //   const envConfig = envConfigServcie.env();
  //   console.log(envConfig);
  //   if (!envConfig) {
  //     console.log('No environment');
  //   }
  connection = mysql.createConnection({
    host: process.env.ANALYSIS_DB_HOST,
    port: process.env.ANALYSIS_DB_PORT,
    user: process.env.ANALYSIS_DB_USERNAME,
    password: process.env.ANALYSIS_DB_PASSWORD,
    database: process.env.ANALYSIS_DB_DATABASE,
  });

  generateKbFoodMediumCategory(() => {
    if (connection) connection.end();
    // process.exit();
  });
})();

export { generate, generateKbCategory };
