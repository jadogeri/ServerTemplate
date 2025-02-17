"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connects to a MongoDB database using the provided MongoDB URL.
 * Logs the connection details upon successful connection.
 * Throws an error and exits the process if the connection fails.
 *
 * @param mongoURL - The MongoDB connection string.
 * @returns Promise<void>
 * @throws Error if the connection to the database fails.
 */
const connectMongoDB = (mongoURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connect = yield mongoose_1.default.connect(mongoURL);
        //console.log(  "Database connected: ",  connect.connection.host, connect.connection.name  );
    }
    catch (err) {
        //console.log(err);
        process.exit(1);
    }
});
exports.connectMongoDB = connectMongoDB;
//# sourceMappingURL=mongoDB.js.map