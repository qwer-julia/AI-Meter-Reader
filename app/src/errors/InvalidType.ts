class InvalidType extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, errorCode: string = 'INVALID_TYPE') {
        super(message);
        this.name = 'InvalidType'; 
        this.statusCode = 400;
        this.errorCode = errorCode;
    } 
}

export default InvalidType;