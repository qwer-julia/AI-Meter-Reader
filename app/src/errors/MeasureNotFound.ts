class MeasureNotFound extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, errorCode: string = 'MEASURE_NOT_FOUND') {
        super(message);
        this.name = 'MeasureNotFound'; 
        this.statusCode = 404;
        this.errorCode = errorCode;
    } 
}

export default MeasureNotFound;