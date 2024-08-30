import { NewMeasureRequestBody, UpdateMeasureRequestBody } from '../controllers/measureController';
import { Op } from 'sequelize';
import CustomerServices from './CustomerServices';
import { v4 as uuidv4 } from 'uuid';
import saveBase64Image from '../utils/saveBase64Image'

const customerServices = new CustomerServices();
const dataSource = require('../models');
const measureTable = dataSource['Measure'];

interface MeasureBody {
    measure_type: string,
    measure_datetime: string,
    customer_id: number,
    measure_value: number,
    image: string
}

interface Measure {
    id: number, 
    measure_uuid: string,
    measure_datetime: string,
    measure_type: 'WATER' | 'GAS',
    measure_value: number,
    has_confirmed: boolean,
    image_url: string,
    customer_id: number,
    createdAt: string,
    updatedAt: string
}

class MeasureServices {
    async createMeasure(measureBody: MeasureBody) {
        const image_url = await this.createImageUrl(measureBody.image)
        const measure = await measureTable.create(measureBody);
        return {
            image_url: image_url,
            measure_value: measure.dataValues.measure_value,
            measure_uuid: measure.dataValues.measure_uuid
           }
    }

    async updateMeasure(measure: Measure, body: UpdateMeasureRequestBody){
        const updatedMeasures = await measureTable.update({measure_value: body.confirmed_value, has_confirmed: true}, { where: {id: measure.id}})
        if (updatedMeasures[0] === 0) {
            return false
        } else { 
            return true
        }
    }

    async findMeasureByUuid(measure_uuid: string){
        return await measureTable.findOne({
            where: {
                measure_uuid: measure_uuid,
            }
        });
    }

    async findMeasureInMonth(measureData: NewMeasureRequestBody){
        const newMeasureDate = new Date(measureData.measure_datetime);
        const year = newMeasureDate.getFullYear();
        const month = newMeasureDate.getMonth();
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const customerId = await customerServices.findOrCreateCustomer(measureData.customer_code)
        return await measureTable.findOne({
            where: {
                measure_datetime: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
                measure_type: measureData.measure_type,
                customer_id: customerId
            }
        });
    }

    async findMeasureByCustomer(customer_id: number, measure_type: 'WATER' | 'GAS' | null){
        const whereClause = measure_type
        ? {
              measure_type: measure_type.toUpperCase(),
              customer_id: customer_id
          }
        : { customer_id: customer_id };
        const measures = await measureTable.findAll({
            where: whereClause,
        });

        return measures
    }

    async createImageUrl(base64Image: string){
        const fileName = `${uuidv4()}.png`;
        const filePath = await saveBase64Image(base64Image, fileName);
        return filePath;
    }
}

export default MeasureServices;