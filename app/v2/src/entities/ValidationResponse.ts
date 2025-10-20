import { ErrorResponse } from "./ErrorResponse";

export class ValidationResponse{

    private valid: boolean; 
    private errorResponse?: ErrorResponse

    constructor(valid : boolean, errorResponse?: ErrorResponse){
        this.valid = valid;
        this.errorResponse = errorResponse;
    }
    isValid(): boolean{
        return this.valid;
    } 

    getErrorResponse(): ErrorResponse | undefined{
        return this.errorResponse;
    }
    
}