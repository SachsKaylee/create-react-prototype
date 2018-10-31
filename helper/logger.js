const logger = (level, ...args) => {
    if (level === logger.ERROR) {
        console.error(level, "", ...args);
    } else if (level === logger.WARNING) {
        console.warn(level, "", ...args);
    } else if (level === logger.DEBUG) {
        if (logger.setDebug.state) {
            console.debug(level, "", ...args);
        }
    } else {
        console.log(level, "", ...args);
    } 
};

logger.setDebug = debug => logger.setDebug.state = !!debug;
logger.setDebug.state = false;

logger.DEBUG = "🐞";
logger.TRACE = "";
logger.INFO = "📚";
logger.SUCCESS = "✨";
logger.WARNING = "🔔";
logger.ERROR = "💥";

module.exports = logger;
