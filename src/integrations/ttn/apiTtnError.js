const { ServiceError } = require('web-service-utils/serviceErrors')

class ApiTtnError extends ServiceError{
    constructor(error){
        const message = "Error during integration with TTN"
        const httpStatusCode = error.response.status
        const value = {
            url: error.config.url,
            auth: error.config.headers.Authorization,
            data: JSON.parse(error.config.data),
            details: []
        }
        const details = error.response.data.details
        for(const detail of details){
            value.details.push(detail.cause)
        }
        super(httpStatusCode, message, value)
    }
}

module.exports = ApiTtnError