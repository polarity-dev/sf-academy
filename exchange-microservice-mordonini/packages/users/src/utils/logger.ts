import { createLogger, transports, format} from "winston";
const { combine, timestamp, printf} = format

const { NODE_ENV = 'development'} = process.env

// Format to print to console
const consoleFormat = printf(({message, level}) => {
    return `[${level.toUpperCase()}]: ${message}`
})

// Format to print to file
const fileFormat = printf(({message}) => {
    return `${message}`
})

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({
            // day-month-year hour:minute:second:millisecond
            format: "DD-MM-YYYY HH:mm:ss:SSS"
        }),
        fileFormat,
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error'}),
        new transports.File({ filename: 'logs/combined.log'})
    ]
})

if (NODE_ENV !== 'production'){
    logger.add(new transports.Console({
        format: combine(consoleFormat)
    }))
}

export default logger