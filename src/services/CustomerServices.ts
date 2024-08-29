const dataSource = require('../models');
const customerTable = dataSource['Customer'];

class CustomerServices {
    async findOrCreateCustomer(customer_code: string) {
        const customer = await customerTable.findOne({
            where: {
                customer_code: customer_code,
            },
        });
        if (!customer) {
            const newCustomer = await customerTable.create({ customer_code: customer_code });
            return newCustomer.id
        }
        return customer.dataValues.id
    }
}

export default CustomerServices;