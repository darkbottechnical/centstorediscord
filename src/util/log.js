import path from "path";
import { existsSync, mkdirSync, createWriteStream } from "fs";
import { app } from "electron";

class Logger {
    constructor() {
        const baseDir = app.isPackaged ? app.getPath("userData") : process.cwd();
        this.logDir = path.join(baseDir, "logs");

        this.logFile = path.join(this.logDir, `session-${new Date().toISOString().split("T")[0]}.log`);

        if (!existsSync(this.logDir)) {
            mkdirSync(this.logDir, { recursive: true });
        }

        this.stream = createWriteStream(this.logFile, { flags: "a" });
    }

    _log(level, message) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level}] ${message}`;
        console.log(formattedMessage);
        this.stream.write(formattedMessage + "\n");
    }

    debug(msg) {
        this._log("DEBUG", msg);
    }

    info(msg) {
        this._log("INFO", msg);
    }
    warn(msg) {
        this._log("WARN", msg);
    }
    error(msg) {
        this._log("ERROR", msg);
    }

    fatal(msg) {
        this._log("FATAL", msg);
    }

    shutdown() {
        this.info("Logger shutting down.");
        this.stream.end();
    }
}

const logger = new Logger();
export default logger;
