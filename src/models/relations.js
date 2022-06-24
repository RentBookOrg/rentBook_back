import { Model, DataTypes } from 'sequelize'


export default async function({ sequelize }) {
    const User = sequelize.models.User
    const Book = sequelize.models.Book

    User.hasMany(Book, {
        foreignKey: {
            name: "user_id",
            type: DataTypes.UUID,
            allawNull: false
        }
    })
}