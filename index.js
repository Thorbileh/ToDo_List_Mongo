const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const path = require('path')

const TodoTask = require("./TodoTask");

PORT = 3002;
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.use("/static",express.static("public"))
/* app.use(express.static("public")) */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//to view images
app.use(express.static(path.join ( __dirname, 'public') ))
//connect to database
mongoose.connect('mongodb://localhost:27017/ToDo', {
    useNewUrlParser: true,
    useUnifiedtopology: true
});

//POST METHOD
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({ content: req.body.content });
    try {
        await
            todoTask.save(); res.redirect("/");
    } catch (err) { res.redirect("/"); }
});
// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({},
        (err, tasks) => {
            res.render("todo.ejs", {
                todoTasks: tasks
            });
        });
});
//UPDATE
app.route("/edit/:id").get((req, res) => {
    const id =
        req.params.id; TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", {
                todoTasks: tasks, idTask: id
            });
        });
}).post((req, res) => {
    const id =
        req.params.id; TodoTask.findByIdAndUpdate(id, {
            content:
                req.body.content
        }, err => {
            if (err) return res.send(500,
                err); res.redirect("/");
        });
});
//DELETE
app.route("/remove/:id").get((req, res) => {
    const id =
        req.params.id; TodoTask.findByIdAndRemove(id, err => {
            if (err)
                return res.send(500, err); res.redirect("/");
        });
});
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})
