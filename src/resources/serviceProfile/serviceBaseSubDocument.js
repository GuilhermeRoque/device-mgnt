const {NotFoundError, DuplicatedError, ValidationError, TypeError} = require('web-service-utils/serviceErrors')
const mongoose = require("mongoose")
const mongooseErrors = mongoose.Error
const mongodb = require("mongodb")
const MongoServerError = mongodb.MongoServerError
const ServiceBase = require("web-service-utils/serviceBase")
const MongoErrorCodes = {
    DUPLCIATE: 11000
}

class ServiceBaseSubDocument extends ServiceBase{
    constructor(parent, collection, model, topDocument=null){
        super(model)
        this.model = model
        this.parent = parent
        this.collection = collection
        if(!topDocument){
            this.topDocument = parent
        }else{
            this.topDocument=topDocument
        }
    }

    async _findOne(filter) {
        try {
            if (filter._id) return await this.collection.id(filter._id)
        } catch (error) {
            throw this.getServiceError(error)        
        }            
    }

    async _create (document){
        try{
            console.log('\n', 'Saving...', document, '\n')
            const newDoc = new this.model(document)
            this.collection.push(newDoc)
            await this.topDocument.save()
            return newDoc
        }catch(error){
            throw (this.getServiceError(error))
        }
    }

    async _getOne(filter){
        const document = await this._findOne(filter)
        return this.checkDocumentFound(filter, document)
    }

    async _getById(id){
        const filter = {_id: id}        
        return await this._getOne(filter)
    }

    async _getAll(){
        return this.collection
    }

    async _deleteOne(filter){
        const deleteReport = await this.model.deleteOne(filter) 
        return this.checkDeleteReport(filter, deleteReport)
    }

    async _deleteById(id){
        this.collection.id(id).remove()
        return await this.topDocument.save()
    }

    async _updateById(id, document){
        const registeredDoc = this.collection.id(id)
        for(const k of Object.keys(document)){
            registeredDoc[k] = document[k]
        }
        try {
            return await this.topDocument.save()

        } catch (error) {
            throw (getModelError(error))
        }        
    }
    
    checkDocumentFound(filter, document) {
        if(document) return document
        throw new NotFoundError(filter)
    }

    checkDeleteReport(filter, deleteReport){
        if(deleteReport.deletedCount !==1) throw new NotFoundError(filter)
    }
    
    checkUpdateReport(filter, updateReport){
        if(!updateReport.matchedCount) throw new NotFoundError(filter)
    }

    is_validation_error(error){
        return error instanceof mongooseErrors.ValidationError
    }

    is_duplicated_error(error){
        return error instanceof MongoServerError && error.code === MongoErrorCodes.DUPLCIATE
    }

    is_cast_error(error){
        return error instanceof mongooseErrors.CastError
    }

    getServiceError(error){
        if(this.is_validation_error(error)) return new ValidationError(error)
        if(this.is_duplicated_error(error)) return new DuplicatedError(error)
        if(this.is_cast_error(error)) return new TypeError(error)
        return error
    }

}

module.exports = ServiceBaseSubDocument