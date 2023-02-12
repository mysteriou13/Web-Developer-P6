const express = require('express')
const app = express()
const port = 4200

app.get('/', (req, res) => {
    res.sendFile('/opt/lampp/htdocs/Web-Developer-P6/src/index.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})