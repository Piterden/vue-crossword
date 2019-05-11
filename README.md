# Vue Crossword

![Travis (.com) branch](https://img.shields.io/travis/com/Piterden/vue-crossword/master.svg?style=for-the-badge)[![awesome-vue](https://img.shields.io/static/v1.svg?label=Vue.JS&message=AWESOME&logo=vue.js&style=for-the-badge&color=ff69b4)](//github.com/vuejs/awesome-vue) [![GitHub stars](https://img.shields.io/github/stars/Piterden/vue-crossword.svg?style=for-the-badge)](https://github.com/Piterden/vue-crossword/stargazers) [![GitHub forks](https://img.shields.io/github/forks/Piterden/vue-crossword.svg?style=for-the-badge)](https://github.com/Piterden/vue-crossword/network) [![GitHub license](https://img.shields.io/github/license/Piterden/vue-crossword.svg?style=for-the-badge)](https://github.com/Piterden/vue-crossword/blob/master/LICENSE)

A Vue.js based crossword puzzle builder and filler front-end application.

![1547090130650](https://raw.githubusercontent.com/Piterden/vue-crossword/master/preview01.png)

## Demo

[**DEMO** _Russian Words Database_](https://piterden.github.io/vue-crossword)

## Features and ToDo

- [x] Supports 2-31 symbols words lengths.
- [x] Supports any grid size.
- [x] Random symmetric grid generator.
- [x] Automatic calculation of required to fill letter cells and clues numeration.
- [x] Words suggestions from API depending on length and filled letters.
- [x] Clues suggestions for filled words from API.
- [x] Add different types of symmetry to grid generation.
- [x] Add analyzer and smart corrector for generated grids (to control words length).
- [ ] User login (OAuth2).
- [ ] Save built crosswords.
- [ ] Add and save new words and clues.
- [ ] Search within suggested words by added letters.
- [ ] Search in clues of suggested words.
- [ ] Add taxonomy for clues.
- [ ] Automatic generation of full filled crossword.
- [ ] Improve the logic of API queries.
- [ ] Make a print version.
- [ ] Fix mobile version.

## Usage

There are a few simple rules:

- Generated forms of vertical and horizontal questions allow you to fill cells inside them with letters.
- Grid cells do not allow you to fill them with letters but you can edit a grid geometry by clicking on them.
- You can change the size of a grid pressing the `Change Size` button which enables *the size change mode*. In this mode requests to the API are temporarily disabled and suggesting words would be updated on exit to the normal edit mode.
- When word is filled, you could select the clue or enter your one. The cells of filled words are marked with a green color.

## Build Setup

```bash
# install dependencies
npm i

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# lint project
npm run lint
```

## Built With

- [VueJS](https://vuejs.org/) - The Progressive JavaScript Framework.
- [CodeSandbox](https://codesandbox.io) - The online code editor for ...
- [Words API](https://github.com/Piterden/crosswords-module) - Words API repository.

## Contributing

PR's are appreciated.

## Authors

- **Denis Efremov** - *Code|Idea* - [Piterden](https://github.com/Piterden)
- **mvrlin** - *Help with styles* - [mvrlin](https://github.com/mvrlin)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Piterden/vue-crossword/blob/master/LICENSE) file for details.

## Donate

![Keybase BTC](https://img.shields.io/keybase/btc/piterden.svg?style=for-the-badge)

