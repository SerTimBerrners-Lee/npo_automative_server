<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Описание

```bash
# Для работы библиотеки конфертации pdf -> png 
# выполняем установку зависимости
$ sudo apt-get install imagemagick ghostscript poppler-utils
```

## Code Style 
1. Controller
  - Контроллер должен иметь название соответствующее функции к которой он обращается в Сервисе.
Предварительно необходимо установить:
MongoDB - последнюю версию
NodeJS - 9-10 версию

## Code Style Git
1. Оставляйте пустую строку между заголовком и описанием.
2. Указываем тип коммита.
    - feature — используется при добавлении новой функциональности уровня приложения
    - fix — если исправили какую-то серьезную багу
    - docs — всё, что касается документации
    - style — исправляем опечатки, исправляем форматирование
    - refactor — рефакторинг кода приложения
    - test — всё, что связано с тестированием
    - chore — обычное обслуживание кода
3. Указываем область действия коммита
Сразу после типа коммита без всяких пробелов указываем в скобках область, на которую распространяется наш коммит.
После этого пишем наш стандартный коммит.
Например при добавлении нового функционала в код модуля:
```
refactor(audio-controls) use common library for all controls
```
или в файле:
```
chore(Gruntfile.js) add watch task
```
Если областей несколько указываем их через запятую.

С новыми ветками наименование так же с коммитами:
```
refactor(audio-controls)_new_branch
```
