import { isBase64 } from '../utils/isBase64';
import { isValidDate } from '../utils/isValidDate';
import { isString } from '../utils/isString';
import InvalidDataError from '../errors/InvalidData';
import axios from 'axios'
import dotenv from 'dotenv';
import CustomerServices from '../services/CustomerServices'
import MeasureServices from '../services/MeasureServices'
import DoubleReport from '../errors/DoubleReport';

const customerServices = new CustomerServices();
const measureServices = new MeasureServices();

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY não está definida");
}

export interface MeasureRequestBody {
    image: string;
    customer_code: string;
    customer_id: number;
    measure_datetime: string;
    measure_type: 'WATER' | 'GAS';
}

class MeasureController {
    async post(body: MeasureRequestBody){
        const measureValue = await this.extractTextFromImage(body.image);
        const customerId = await customerServices.findOrCreateCustomer(body.customer_code);
        const measureBody = {
            measure_type: body.measure_type,
            measure_datetime: body.measure_datetime,
            customer_id: customerId,
            measure_value: measureValue
        }
        const newMeasure = await measureServices.createMeasure(measureBody)
        return newMeasure;
    }

    validateData(body: MeasureRequestBody) {
        const { image, customer_code, measure_datetime, measure_type }: MeasureRequestBody = body;

        if (!image || !customer_code || !measure_datetime || !measure_type) {
            throw new InvalidDataError('All fields are required.');
        }

        if (!['WATER', 'GAS'].includes(measure_type)) {
            throw new InvalidDataError('Invalid measure type. Must be "WATER" or "GAS".');
        }

        if (!isBase64(image)) {
            throw new InvalidDataError('Image must be a valid Base64 string.');
        }

        if (!isValidDate(measure_datetime)) {
            throw new InvalidDataError('Invalid datetime format.');
        }

        if (!isString(customer_code)) {
            throw new InvalidDataError('Customer code must be a string.');
        }
    }

    async extractTextFromImage(base64Image: string) {
        try {
            const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${geminiApiKey}`, {
                requests: [
                    {
                        image: {
                            content: base64Image,
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                            },
                        ],
                    },
                ],
            });
            const detections = response.data.responses[0].textAnnotations;
            if (detections && detections.length > 0) {
                const extractedText = detections[0].description;
                const regex = /\b0\d+\b/g;
                const matches = extractedText.match(regex);
                if (matches && matches.length > 0) {
                    return matches[0]
                } else {
                    throw new InvalidDataError('No numerical value found in the text');
                }
            } else {
                throw new InvalidDataError('No text found in the text');
            }
        } catch (error) {
            throw new InvalidDataError(`Error extracting text from image: ${error}`);
        }
    }

    async validateMeasureMonth(body: MeasureRequestBody) {
        const measure = await measureServices.findMeasure(body)
        if(measure){
            throw new DoubleReport('Leitura do mês já realizada')
        }
    }

}

export default MeasureController;