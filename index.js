const express = require("express");

const accessRouter = require("./routes/access.routes");
const loginRouter = require("./routes/login.routes");
const accountRouter = require("./routes/account.routes");
const PORT = process.env.PORT || 8080;

const app = express();

var cors = require("cors");

// use it before all route definitions
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/app", accessRouter);
app.use("/app", accountRouter);
app.use("/app", loginRouter);

app.listen(PORT, () => console.log(`server started on post ${PORT}`));
