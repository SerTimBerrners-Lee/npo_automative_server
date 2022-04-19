import * as fs from 'fs';
import { DateMethods } from './date.methods';
import { STATIC_DIR } from './enums';

export function logs(title: string = 'Логирование: ', ...args: any) {
  const dat = new DateMethods();

    const str = `
    \n
    -------------------------------------------
    ${dat.date()} :: ${dat.time()}
    ${title}\n
    ${args}
    -------------------------------------------
    `;

    if (!fs.existsSync(`${STATIC_DIR}logs.log`))
      fs.writeFileSync(`${STATIC_DIR}logs.log`, str);
    else fs.appendFileSync(`${STATIC_DIR}logs.log`, str);
}