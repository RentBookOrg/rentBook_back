import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'


export default async function({ sequelize }) {
    class User extends Model{}

    User.init({
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'username length should be between 2 and 50 characters'
                }
            }
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'username length should be between 2 and 50 characters'
                }
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 16],
                    msg: 'password length should be between 8 and 16 characters'
                }
            }
        },  
        user_contact: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^998[389][012345789][0-9]{7}$/,
                    msg: 'only uzbek contacts are allowed!'
                }
            }
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        user_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'users',
        modelName: 'User',
        updatedAt: 'user_updated_at',
        createdAt: 'user_created_at',
        deletedAt: 'user_deleted_at',
        underscored: true,
        paranoid: true,
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSaltSync(11, 'a')
                user.password = bcrypt.hashSync(user.password, salt);
           }
        } 
    })
}