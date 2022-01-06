import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { opendir } from 'fs/promises';
import { DateMethods } from 'src/files/date.methods';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

interface AttrFilesReturn {
    readonly name: string;
    readonly date: string;
    readonly size: string;
}

const DIR_SCRIPT = '/home/npo/Desktop/script/pg_dump.sh'
const DIR_BACKUP = '/home/npo/Desktop/db'
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
                await exec(`sh ${DIR_SCRIPT}`)
                return true
            }
            return false
        } catch (e) {
            throw new HttpException('Произошла ошибка Дириктории не найдено', HttpStatus.INTERNAL_SERVER_ERROR)
        }
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
}
