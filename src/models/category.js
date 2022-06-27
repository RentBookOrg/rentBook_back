import { Model, DataTypes } from 'sequelize'


export default async function({ sequelize }) {
    class Category extends Model{}

    Category.init({
        category_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        category_name: {
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
        tableName: 'categories',
        modelName: 'Category',
        updatedAt: 'category_updated_at',
        createdAt: 'category_created_at',
        deletedAt: 'category_deleted_at',
        underscored: true,
        paranoid: true,
        sequelize
    })
}