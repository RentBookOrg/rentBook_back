
const locations = ['Toshkent', 'Andijon', 'Samarqand', "Farg'ona", 'Buxoro', 'Jizzax', 'Navoiy', 'Namangan', 'Qashqadaryo', 'Xorazm', 'Sirdaryo',
'Surxandaryo', "Qoraqalpog'iston"]

export default async function({ sequelize }) {
    const Location = sequelize.models.Location

    const location = await Location.findOne({  })
    if(!location) {
        for(let el of locations) {
            await Location.create({ location_name: el })
        }
    }
}