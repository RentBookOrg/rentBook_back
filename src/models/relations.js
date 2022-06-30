import { Model, DataTypes } from 'sequelize'


export default async function({ sequelize }) {
    const User = sequelize.models.User
    const Book = sequelize.models.Book
    const Category = sequelize.models.Category
    const Location = sequelize.models.Location
    const Order = sequelize.models.Order

    Location.hasOne(User, {
        foreignKey: {
            name: "location_id",
            type: DataTypes.UUID,
            allawNull: false
        }
    })

    Category.hasOne(Book, {
        foreignKey: {
            name: "category_id",
            type: DataTypes.UUID,
            allawNull: false
        }
    })

    User.hasMany(Book, {
        foreignKey: {
            name: "user_id",
            type: DataTypes.UUID,
            allawNull: false
        }
    })

    Book.hasMany(Order, {
        foreignKey: {
            name: "book_id",
            type: DataTypes.UUID,
            allawNull: false
        }
    })

   
}