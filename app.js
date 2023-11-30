const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbToResponseObject = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });
    app.listen(3006, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log("DB Error: ${e.message}");
    process.exit(1);
  }
};
initializeDbToResponseObject();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return requestQuery.priority != undefined && requestQuery.status != undefined;
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority != undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status != undefined;
};

app.get("/todos/", async (request, response) => {
  let getQuery = "";
  let responseData = null;
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      getQuery = `SELECT * FROM todo1 WHERE todo LIKE '%${search_q}%'
      AND priority=${priority}
      AND status =${status};`;
      break;
    case hasPriorityProperty(request.query):
      getQuery = `SELECT * FROM todo1 WHERE todo LIKE '%${search_q}%'
      AND priority=${priority};`;
      break;
    case hasStatusProperty(request.query):
      getQuery = `SELECT * FROM todo1 WHERE todo LIKE '%${search_q}%'
          AND status =${status};`;
      break;
  }
  responseData = await db.all(getQuery);
  response.send(responseData);
});
