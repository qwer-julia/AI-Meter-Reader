class DoubleReport extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, errorCode: string = 'DOUBLE_REPORT') {
        super(message);
        this.name = 'DoubleReport'; 
        this.statusCode = 409;
        this.errorCode = errorCode;
    } 
}

export default DoubleReport;
