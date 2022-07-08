import { Model, DataTypes } from 'sequelize'

export default async function({ sequelize }) {
    class Order extends Model{}

    Order.init({
        order_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 256],
                    msg: `Getter name's length should be between 2 and 256 character`
                }
            }
        }, 
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 256],
                    msg: `Getter surname's length should be between 2 and 256 character`
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^998[389][012345789][0-9]{7}$/,
                    msg: 'only uzbek contacts are allowed!'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        order_mode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['rent', 'buy']],
                    msg: 'Getter only get book for renting or whole buying'
                }
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 100],
                    msg: 'please, enter valid address'
                }
            }
        },
        order_returning_date: {
            type: DataTypes.DATE,
            validate: {
                customValidator(value) {
                    if (value && new Date(value) < new Date()) {
                      throw new Error("invalid date");
                    }
                }
            }
        },
        order_approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'orders',
        modelName: 'Order',
        updatedAt: 'order_updated_at',
        createdAt: 'order_created_at',
        deletedAt: 'order_deleted_at',
        underscored: true,
        paranoid: true,
        sequelize,
    })
}