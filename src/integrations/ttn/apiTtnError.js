const { ServiceError } = require('web-service-utils/serviceErrors')

class ApiTtnError extends ServiceError{
    constructor(error){
        const message = "Error during integration with TTN"
        const httpStatusCode = error.response.status
        const value = {
            url: error.config.url,
            auth: error.config.headers.Authorization,
            data: JSON.parse(error.config.data?error.config.data:null),
        }
        const details = error.response.data.details
        if(details?.length){
            const detailsList = []
            for(const detail of details){
                detailsList.push(detail.cause)
            }
            value.details = detailsList
        }else{
            value.details = details
        }
        super(httpStatusCode, message, value)
    }
}

module.exports = ApiTtnError