const express = require("express");
const path = require("path");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { v4 } = require("uuid");
const { log } = require("console");
const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "todo.db");
let db = null;
const initializeServerAndDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4500, () => {
      console.log("listening at http://localhost:4500/");
    });
  } catch (e) {
    console.log(`Database error: ${e.message}`);
  }
};
initializeServerAndDB();

app.get("/todos", async (req, res) => {
  const dbQuery = `
  select * from todos`;
  const dbResponse = await db.all(dbQuery);
  res.send(dbResponse).status(200);
});

app.post("/todos", async (req, res) => {
  const { todo, status } = req.body;
  const dbQuery = `
  insert into todos (id,todo,status)
  values ("${v4()}","${todo}",${status ? 1 : 0})
  `;
  const dbResponse = await db.run(dbQuery);
  res.status(200).send("todo added successfully");
});

app.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const dbQuery = `
  delete from todos
  where id="${todoId}"
  `;
  await db.run(dbQuery);
  res.status(200).send("todo deleted successfully");
});

app.put("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const dbQuery = `
  update todos
  set status=1
  where id="${todoId}"`;
  await db.run(dbQuery);
  res.status(200).send("todo updated successfully");
});
