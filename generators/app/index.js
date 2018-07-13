const Generator = require('yeoman-generator')
const csv = require('fast-csv')
const fSys = require('fs')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)
    this.argument('csv_path', {type: String, required: true})
  }

  install() {
    const stringsArray = []
    const that = this
    fSys.createReadStream(this.options['csv_path'])
      .pipe(csv())
      .on('data', function (data) {
        if (data.some(item => item !== '')) {
          stringsArray.push(data)
        }
      })
      .on('end', function () {
        that._generateValues(that, stringsArray)
      })
  }

  _generateValues(that, arr) {
    const folders = arr.shift()
    for (let i in folders) {
      const values = arr.map(item => item[i])
      that.fs.copyTpl(
        that.templatePath('_strings'),
        that.destinationPath('strings-values/' + folders[i] + '/strings.xml'),
        {strings: values}
      )
    }
  }
}
