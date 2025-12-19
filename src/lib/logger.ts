// Structured logging utility with production safety

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
    [key: string]: unknown
}

class Logger {
    private isDevelopment = process.env.NODE_ENV !== 'production'

    private log(level: LogLevel, message: string, context?: LogContext) {
        if (!this.isDevelopment && level === 'debug') {
            return // Skip debug logs in production
        }

        const timestamp = new Date().toISOString()
        const logData = {
            timestamp,
            level,
            message,
            ...context,
        }

        // In development, use console for better DX
        if (this.isDevelopment) {
            const consoleMethod = level === 'error' ? console.error :
                level === 'warn' ? console.warn :
                    console.log
            consoleMethod(`[${timestamp}] ${level.toUpperCase()}: ${message}`, context || '')
        } else {
            // In production, use structured logging (JSON)
            // This can be piped to external logging services like Datadog, Sentry, etc.
            console.log(JSON.stringify(logData))
        }
    }

    info(message: string, context?: LogContext) {
        this.log('info', message, context)
    }

    warn(message: string, context?: LogContext) {
        this.log('warn', message, context)
    }

    error(message: string, context?: LogContext) {
        this.log('error', message, context)
    }

    debug(message: string, context?: LogContext) {
        this.log('debug', message, context)
    }
}

export const logger = new Logger()
