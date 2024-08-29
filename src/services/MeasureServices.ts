import { MeasureRequestBody } from '../controllers/measureController';
import { Op } from 'sequelize';
import DoubleReport from '../errors/DoubleReport';
import CustomerServices from './CustomerServices';
const customerServices = new CustomerServices();
const dataSource = require('../models');
const measureTable = dataSource['Measure'];

interface MeasureBody {
    measure_type: string,
    measure_datetime: string,
    customer_id: number,
    measure_value: string
}

class MeasureServices {
    async createMeasure(measureBody: MeasureBody) {
        //await this.checkMeasureMonth(measureBody);
        const measure = await measureTable.create(measureBody);
        return {
            image_url: "teste",
            measure_value: measure.dataValues.measure_value,
            measure_uuid: measure.dataValues.measure_uuid
           }
    }

    async findMeasure(measureData: MeasureRequestBody){
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
}

export default MeasureServices;