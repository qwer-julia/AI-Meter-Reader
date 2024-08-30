class ConfirmationDuplicate extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, errorCode: string = 'CONFIRMATION_DUPLICATE') {
        super(message);
        this.name = 'ConfirmationDuplicate'; 
        this.statusCode = 409;
        this.errorCode = errorCode;
    } 
}

export default ConfirmationDuplicate;
