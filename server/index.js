const pbjs = require("protobufjs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

let seetongPerson;

pbjs
  .load(path.resolve("./proto/person.proto"))
  .then((root) => {
    // Obtain a message type
    seetongPerson = root.lookupType("seetong.Person");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();
app.use(bodyParser.raw());
app.use(bodyParser.json());

// 全局 中间件  解决所有路由的 跨域问题
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

// 在decode之前需要用raw中间件处理一遍protobuf数据
app.post("/pb", function (req, res) {
  // Assume `req.body` contains the protobuf as a utf8-encoded string
  const buffer = Buffer.from(req.body);
  const user = seetongPerson.decode(buffer);
  console.log("/pb",user);
  res.end(buffer);
});
// 在decode之前需要用raw中间件处理一遍protobuf数据
app.post("/json", function (req, res) {
  // Assume `req.body` contains the protobuf as a utf8-encoded string
  console.log("/json",req.body);
  res.end(JSON.stringify(req.body));
});

app.listen(3000);
