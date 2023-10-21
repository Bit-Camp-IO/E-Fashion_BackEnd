import morgan, { StreamOptions } from "morgan";
import { Express } from 'express';
import Logger from "../../config/Logger";

function morganMiddleware(app: Express) {
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms",
    { stream }));
}

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

export default morganMiddleware;

