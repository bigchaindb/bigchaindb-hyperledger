/**
 * error handling middleware module
 */
import { ValidationError } from 'express-json-validator-middleware';

const handleErrors = (error, req, res, next) => {
    
    if(error){

        if(error instanceof ValidationError) {
            let message = error.validationErrors.body[0].message;
            res.status(400).send({success: "false", message});
            next();
        }
        else {
            let message = error.message ? error.message : error;
            res.status(500).json({success: "false", message});
            next();
        }
    }
}


export { handleErrors };