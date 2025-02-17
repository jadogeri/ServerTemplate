"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express_1 = __importDefault(require("express"));
const MongoDatabase_1 = __importDefault(require("./src/entities/MongoDatabase"));
const errorHandler = require("./src/middlewares/errorHandler");
const { corsOptions } = require("./src/configs/cors");
const cors = require("cors");
const app = (0, express_1.default)();
const port = process.env.PORT || 6000;
app.use(express_1.default.json());
//app.use("/api/contacts", require("./src/routes/contactRoutes"))
app.use("/api/users", require("./src/routes/userRoutes"));
app.use(errorHandler);
app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.send({ message: "home" });
});
MongoDatabase_1.default.getInstance();
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Backend is running on http://localhost:${port}`);
    });
}
//# sourceMappingURL=index.js.map