import { Model, DataTypes } from 'sequelize'


export default async function({ sequelize }) {
    class Location extends Model{}

    Location.init({
        location_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        location_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'length of the name of the category should be between 2 and 50 cahracters'
                }
            }
        }
    }, {
        tableName: 'locations',
        modelName: 'Location',
        updatedAt: 'location_updated_at',
        createdAt: 'location_created_at',
        underscored: true,
        sequelize
    })
}