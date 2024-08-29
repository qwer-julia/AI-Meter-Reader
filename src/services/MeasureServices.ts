import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
//utils
import saveBase64Image from '../utils/saveBase64Image'
//services
import CustomerServices from './CustomerServices';
//types
import {Measure, MeasureBody, NewMeasureRequestBody, UpdateMeasureRequestBody} from '../types/measureTypes'

const customerServices = new CustomerServices();
const dataSource = require('../models');
const measureTable = dataSource['Measure'];

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
        try{
            const newMeasureDate = new Date(measureData.measure_datetime);
            const startOfMonth = new Date(newMeasureDate.getFullYear(), newMeasureDate.getMonth(), 1);
            const endOfMonth = new Date(newMeasureDate.getFullYear(), newMeasureDate.getMonth() + 1, 0, 23, 59, 59, 999);
    
            const customerId = await customerServices.findOrCreateCustomer(measureData.customer_code)
    
            const measure = await measureTable.findOne({
                where: {
                    measure_datetime: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    },
                    measure_type: measureData.measure_type,
                    customer_id: customerId
                }
            });
            return measure;
        } catch (error) {
            throw new Error('Erro ao buscar medida.');
        }
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