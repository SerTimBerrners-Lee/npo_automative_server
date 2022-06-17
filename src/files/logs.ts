import * as fs from 'fs';
import { DateMethods } from './date.methods';
import { STATIC_DIR } from './enums';

/**
 * Класс пишет логи определенного формата в начало файла logs.log
 * Перовой строкой выводит дату и время
 * Второй строкой выводит зоголовок
 * Третий строкой выводит переданные аргументы 
 * @param title 
 * @param args 
 */
class Loggus {

  private dat: any;
  private file: any;
  private str: string;
  private args: any;
  private buffer: Buffer;
  public title: string;

  constructor(title: any = 'Логирование', ...args: any) {
    this.dat = new DateMethods();
    this.file = `${STATIC_DIR}logs.log`;
    this.title = title;
    this.args = args;
    this.str = `
    \n
    -------------------------------------------
    ${this.dat.date()} :: ${this.dat.time()}
    ${this.title}:  \n
    ${this.args}
    -------------------------------------------
    `;
    this.buffer = new Buffer(this.str, 'utf-8');

    if (!fs.existsSync(this.file))
      fs.writeFileSync(this.file, '');
  }

  public clear() {
    const { fd } = this._open();
    const newBuffer = new Buffer('', 'utf-8');

    fs.writeSync(fd, newBuffer, 0, newBuffer.length, 0);
    fs.close(fd);
  }

  public append() {
    const { data, fd } = this._open();
    
    fs.writeSync(fd, this.buffer, 0, this.buffer.length, 0);
    fs.writeSync(fd, data, 0, data.length, this.buffer.length);
    fs.close(fd);
  }

  private _open() {
    const data = fs.readFileSync(this.file);
    const fd = fs.openSync(this.file, 'w+');

    return { data, fd }
  }
}

export const logs = (title: any = '', ...args: any) => new Loggus(title, ...args).append();
export const logsClear = () => new Loggus().clear();