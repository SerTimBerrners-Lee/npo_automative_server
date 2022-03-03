import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { opendir } from 'fs/promises';
import { DateMethods } from 'src/files/date.methods';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { parse } from 'node-html-parser';
const archiver = require('archiver');

interface AttrFilesReturn {
    readonly name: string;
    readonly date: string;
    readonly size: string;
}

const DIR_SCRIPT = '/home/npo/Desktop/script/'
const DIR_BACKUP = '/home/npo/Desktop/db'
const HOME_DIR = '/home/david/'
const PUBLIC_DIR = `${HOME_DIR}Desktop/npo_automative_server/dist/static/public/`
const STATIC_DIR = `${HOME_DIR}Desktop/npo_automative_server/dist/static/`
@Injectable()
export class FilesService {

    async getAllFilesBackup() {
        try{
            const date: Array<AttrFilesReturn> = [];
            const comparison = new DateMethods().comparison

            const dir = await opendir(DIR_BACKUP)
            for await (const dirent of dir) {
                const file = fs.statSync(`${DIR_BACKUP}/${dirent.name}`)
                const size = String((file.size / (1024*1024)).toFixed(2)) + ' мб'
                const date_time = String(new Date(file.birthtime).toLocaleString('ru-RU'))
                date.push({
                    name: dirent.name,
                    size: size,
                    date: date_time
                })
            }

            for(let i = 0; i < date.length; i++) {
                for(let j = 0; j < date.length; j++) {
                    if(comparison(date[i].date.split(',')[0], date[j].date.split(',')[0], '>')) {
                        let copy = date[i]
                        date[i] = date[j]
                        date[j] = copy
                    }
                }
            }

            return JSON.stringify(date)
        } catch(e) {
            throw new HttpException('Произошла ошибка при записи Получении файлов', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async newBackup() {
        try {
            if(fs.existsSync(DIR_SCRIPT)) {
                await exec(`sh ${DIR_SCRIPT}pg_dump.sh`)
                return true
            }
            return false
        } catch (e) {
            throw new HttpException('Произошла ошибка Дириктории не найдено', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async writeServerLog() {
        if(!fs.existsSync(PUBLIC_DIR))
            fs.mkdirSync(PUBLIC_DIR, { recursive: true })

        try {
            await exec(`sh ${DIR_SCRIPT}logger.sh`)
            return true
        } catch(e) { 
            throw new HttpException('Произошла ошибка При Создании логера', HttpStatus.BAD_GATEWAY)
        }
    }

    async getLoggerServer() {

        if(!fs.existsSync(PUBLIC_DIR)) {
            fs.mkdirSync(PUBLIC_DIR, { recursive: true })
        }

        const data = fs.readFileSync(`${STATIC_DIR}logger.log`, 'utf8')
        const html = this.returnTemplate(data)
        
        fs.writeFileSync(`${PUBLIC_DIR}logger.html`, html)
        return fs.readFileSync(`${PUBLIC_DIR}logger.html`, 'utf8')

    } 

    returnTemplate(data: string) {
        const format = `
                <p>
                    ${data.split('\n').join('</p><p>')}
                </p>
            `;

        const html = parse(format)
        let result = []
        for(const item of html.querySelectorAll('p')) {
            const pos = item.innerText.indexOf(':')
            if(pos != -1) {
                let arr = item.innerText.split(':')
                const text = [`<span class='param'> ${[arr[0]]} :</span> `].concat(arr[1]).join('')
                item.innerHTML = text
            }
            result.push(item)
        }
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        .main {
                            font-size: 20px;
                            padding: 25px;
                        }
                        .param {
                            font-weight: bold;
                            font-size: 21;
                        }
                    </style>
                    <title>Лог Сервера</title>
                </head>
                <body>
                    <div class='main'>
                        ${result.join('')}
                    </div>
                </body>
            </html>
        `;

    }

    async dropDumpDB(dump_name: string) {
        try {
            const path = DIR_BACKUP + '/' + dump_name
            if(fs.existsSync(path)) {
                fs.unlink(path, (err) => {
                    if(err)
                        throw new HttpException('Произошла ошибка Файла не найдено', HttpStatus.INTERNAL_SERVER_ERROR)
                    return true
                })
            }
        } catch(e) {
            throw new HttpException('Произошла ошибка Файла не найдено', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createZipper(type: string = 'zip', z_lvl: number = 9) {
        const pathName = (new DateMethods().date() + '__+__') + uuid.v4() +'.'+ type;
		const filePath = path.resolve(__dirname, '..', `static/${type}`);
        if(!fs.existsSync(filePath)) 
			fs.mkdirSync(filePath,  {recursive: true});

        const nameZip = filePath +'/' + pathName;
        const output = fs.createWriteStream(nameZip);
        const archive = archiver('zip', {
			zlib: { level: z_lvl }
		});

        archive.pipe(output);

        return {
            archive, nameZip: 'zip/' + pathName
        }
    }
}
