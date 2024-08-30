import axios from 'axios'
import dotenv from 'dotenv';
//utils
import { isBase64 } from '../utils/isBase64';
import { isValidDate } from '../utils/isValidDate';
import { isString } from '../utils/isString';
//erros
import InvalidDataError from '../errors/InvalidData';
import MeasureNotFound from '../errors/MeasureNotFound';
import MeasuresNotFound from '../errors/MeasuresNotFound';
import ConfirmationDuplicate from '../errors/ConfirmationDuplicate';
import InvalidType from '../errors/InvalidType';
import DoubleReport from '../errors/DoubleReport';
//services
import CustomerServices from '../services/CustomerServices'
import MeasureServices from '../services/MeasureServices'
//types
import {UpdateMeasureRequestBody, NewMeasureRequestBody} from '../types/measureTypes'

const customerServices = new CustomerServices();
const measureServices = new MeasureServices();

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY não está definida");
}

class MeasureController {
    async post(body: NewMeasureRequestBody){
        const measureValue = await this.extractTextFromImage(body.image);
        const customerId = await customerServices.findOrCreateCustomer(body.customer_code);
        const measureBody = {
            measure_type: body.measure_type,
            measure_datetime: body.measure_datetime,
            customer_id: customerId,
            measure_value: measureValue,
            image: body.image
        }
        const newMeasure = await measureServices.createMeasure(measureBody)
        return newMeasure;
    }

    async patch(body: UpdateMeasureRequestBody){
        const measure = await measureServices.findMeasureByUuid(body.measure_uuid);
        if(!measure){
            throw new MeasureNotFound('Leitura do mês não foi encontrada.');
        }
        if(measure.has_confirmed){
            throw new ConfirmationDuplicate('Leitura do mês já realizada.')
        }
        return await measureServices.updateMeasure(measure, body);
    }

    async getCustomerList(customer_code: string, measure_type: any){
        const validMeasureTypes = ['WATER', 'GAS'];

        if(measure_type && !validMeasureTypes.includes(measure_type.toUpperCase())) {
            throw new InvalidType('Tipo de medição não permitida.');
        }

        const customerId = await customerServices.findOrCreateCustomer(customer_code);
        const measures = await measureServices.findMeasureByCustomer(customerId, measure_type);

        if (measures.length === 0) {
            throw new MeasuresNotFound('Nenhuma leitura encontrada.');
        }

        return measures;
    }

    validateNewMeasureData(body: NewMeasureRequestBody) {
        const { image, customer_code, measure_datetime, measure_type }: NewMeasureRequestBody = body;

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
            throw new InvalidDataError('customer_code must be a string.');
        }
    }

    
    validateUpdateMeasureData(body: UpdateMeasureRequestBody) {
        const { measure_uuid, confirmed_value}: UpdateMeasureRequestBody = body;

        if (!measure_uuid || !confirmed_value) {
            throw new InvalidDataError('All fields are required.');
        }

        if (!Number.isInteger(confirmed_value)) {
            throw new InvalidDataError('confirmed_value must be a integer.');
        }

        if (!isString(measure_uuid)) {
            throw new InvalidDataError('customer_code must be a string.');
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
                    return Number(matches[0]);
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

    async validateMeasureMonth(body: NewMeasureRequestBody) {
        const measure = await measureServices.findMeasureInMonth(body)
        if(measure){
            throw new DoubleReport('Leitura do mês já realizada')
        }
    }

}

export default MeasureController;