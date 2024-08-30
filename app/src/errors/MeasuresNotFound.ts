class MeasuresNotFound extends Error {
    public statusCode: number;
    public errorCode: string;

    constructor(message: string, errorCode: string = 'MEASURES_NOT_FOUND') {
        super(message);
        this.name = 'MeasuresNotFound'; 
        this.statusCode = 404;
        this.errorCode = errorCode;
    } 
}

export default MeasuresNotFound;