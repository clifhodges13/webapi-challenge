/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, please read the README word for word, don't worry, you got this
in every task there may be trouble, but if you worry you make it double, don't worry, you got this
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, you got this
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, just API

Go code!
*/

const express = require("express");
const cors = require("cors");
const server = express();
const route = require("./routes/routes");

const port = 8787;

server.use(express.json());
server.use(cors());

// Welcome message
server.get("/", (req, res) => res.send("<h1>Welcome to my API!</>"));

server.use("/projects", route);

server.listen(port, () => console.log(`This is a friendly reminder that your server is working ((for now)) at http://localhost:${port}`));