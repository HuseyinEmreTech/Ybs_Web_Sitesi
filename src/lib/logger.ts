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

        // Better error handling for logs
        const processedContext = { ...context }
        if (context?.error instanceof Error) {
            processedContext.error = {
                ...context.error,
                message: context.error.message,
                stack: context.error.stack,
                name: context.error.name,
            }
        }

        const logData = {
            timestamp,
            level,
            message,
            ...processedContext,
        }

        // In development, use console for better DX
        if (this.isDevelopment) {
            const consoleMethod = level === 'error' ? console.error :
                level === 'warn' ? console.warn :
                    console.log

            if (context?.error instanceof Error) {
                consoleMethod(`[${timestamp}] ${level.toUpperCase()}: ${message}`, context.error)
            } else {
                consoleMethod(`[${timestamp}] ${level.toUpperCase()}: ${message}`, context || '')
            }
        } else {
            // In production, use structured logging (JSON)
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
