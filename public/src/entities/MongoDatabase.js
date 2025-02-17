"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mongoDB_1 = require("../configs/mongoDB");
dotenv.config();
class MongoDatabase {
    constructor() {
        const dbUrl = process.env.MONGODB_URI;
        if (dbUrl) {
            (0, mongoDB_1.connectMongoDB)(dbUrl);
        }
    }
    /**
         * Retrieves the singleton instance of the MongoDatabase.
         * If the instance does not exist, it creates a new one.
         *
         * @returns {MongoDatabase} The singleton instance of MongoDatabase.
         * @throws {Error} Throws an error if the database connection fails during instantiation.
         */
    static getInstance() {
        if (this._database != null) {
            return this._database;
        }
        else {
            this._database = new MongoDatabase();
            return this._database;
        }
    }
}
MongoDatabase._database = null;
exports.default = MongoDatabase;
//# sourceMappingURL=MongoDatabase.js.map