const express = require("express");
const router = express.Router();
let STUDENT_ARR = require("../data/students.json");
const fs = require("fs/promises");
const path = require("path");

router.get("/list", (req, res) => {
  res.render("students", { stus: STUDENT_ARR });
});

// 添加学生的路由
router.post("/add", (req, res, next) => {
  const id = STUDENT_ARR.at(-1) ? STUDENT_ARR.at(-1).id + 1 : 1;

  const newUser = {
    id,
    name: req.body.name,
    age: +req.body.age,
    gender: req.body.gender,
    address: req.body.address,
  };

  STUDENT_ARR.push(newUser);

  //调用next交由后续路由继续处理
  next();
});

// 删除学生的路由
router.get("/delete", (req, res, next) => {
  const id = +req.query.id;

  STUDENT_ARR = STUDENT_ARR.filter((stu) => stu.id !== id);

  next();
});

router.use((req, res) => {
  fs.writeFile(
    path.resolve(__dirname, "../data/students.json"),
    JSON.stringify(STUDENT_ARR)
  ).then(() => {
    // 请求重定向
    res.redirect("/students");
  });
});

module.exports = router;
