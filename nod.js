var express = require('express');
const ical = require('node-ical');
var cors = require('cors');
var formidable = require('formidable');
var fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
var app = express();
var streznik ="C:/Users/aldin/Desktop/UniServerZ/www/test1/"
var sampleFilepath = null;
app.use(cors({
  origin:'*'
}));
app.use(fileUpload());

app.post('/', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let sampleFile = req.files.upl;
  sampleFilepath = streznik + "file";
  sampleFile.mv('file', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
});
});

app.get('/give', function (req, res) {
  const events = ical.sync.parseFile(sampleFilepath);
  res.send(events)
});
app.listen(3000);

