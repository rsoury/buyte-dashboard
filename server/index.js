require("colors");
const app = require("./app");

const port = 9000 || process.env.PORT;

app.listen(port, () => {
	console.log(`We are live on ${port}`.green);
});
