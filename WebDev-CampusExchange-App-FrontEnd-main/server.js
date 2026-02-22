const path = require("path");
const express = require("express");
const morgan = require("morgan");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

app.use("/", routes);

app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "Not Found | Campus Exchange",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
