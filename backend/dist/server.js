"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_server_1 = require("./services/express-server");
const PORT = 4000;
const expressServer = new express_server_1.ExpressServer(PORT);
expressServer.start();
