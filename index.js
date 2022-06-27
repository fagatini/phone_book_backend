const express = require("express");
const accessRouter = require("./routes/access.routes");
const accountRouter = require("./routes/account.routes");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use("/app", accessRouter);
app.use("/app", accountRouter);

app.listen(PORT, () => console.log(`server started on post ${PORT}`));
