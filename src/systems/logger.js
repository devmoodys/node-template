import { Logger, transports } from "winston";

export default new Logger({
  transports: [
    new transports.Console({
      colorize: true,
      timestamp: true
    })
  ],
  exceptionHandlers: [new transports.Console()]
});
