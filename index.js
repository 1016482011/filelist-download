const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.post('/file/list', (req, res) => {
  fs.readdir(`../../java/logs/${req.body.name}`, function(err, files) {
    if (err) {
      res.send({ code: 1, data: err, message: '查询失败' })
    }
    res.send({ code: 0, data: files, message: '查询成功' })
  })
})

app.get('/file/download', (req, res) => {
  const filePath = `../../java/logs/${req.query.name}/${req.query.file}`
  const stats = fs.statSync(filePath)
  if (stats.isFile()) {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + req.query.file,
      'Content-Length': stats.size
    })
    fs.createReadStream(filePath).pipe(res)
  } else {
    res.end(404)
  }
})

app.listen(3222, () => console.log('file listening on port 3222!'))
