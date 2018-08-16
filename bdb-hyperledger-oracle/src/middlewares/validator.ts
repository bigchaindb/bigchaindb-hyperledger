/**
 * middlemware module to validate incoming request schemas 
 * before passing it further to processors.
 */
import { Validator } from 'express-json-validator-middleware';


const validator = new Validator({allErrors: true});

export default validator.validate;