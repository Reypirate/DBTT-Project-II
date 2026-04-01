import pino from "pino";

const isServer = typeof window === "undefined";
const isDev = process.env.NODE_ENV === "development";

const transport =
  isServer && isDev
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      })
    : undefined;

const logger = pino(
  {
    level: isDev ? "debug" : "info",
    browser: {
      asObject: true,
    },
  },
  transport,
);

export default logger;
