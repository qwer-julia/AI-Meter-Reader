class InvalidData extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, errorCode: string = 'INVALID_DATA') {
        super(message);
        this.name = 'InvalidData'; 
        this.statusCode = 400;
        this.errorCode = errorCode;
    } 
}

export default InvalidData;