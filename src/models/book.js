import { Model, DataTypes } from 'sequelize'

export default async function({ sequelize }) {
    class Book extends Model{}

    Book.init({
        book_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        book_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 256],
                    msg: `book name's length should be between 2 and 256 character`
                }
            }
        }, 
        book_author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 256],
                    msg: `author name should be between 2 and 256 character`
                }
            }
        },
        book_category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Fiction", "Non-Fiction", "Novel", "Romance", "Self-Help Books", "Children’s Books", 
                    "Biography", "Autobiography", "Text-books", "Political Books", "Academic Books", "Mystery",
                    "Thrillers", "Poetry Books", "Spiritual Books", "Cook Books", "Art Books", "Young Adult Books",
                    "Board Books", "History Books"]]
            }
        },
        book_mode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['rent', 'sell']]
            }
        },
        book_page: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 6,
                    msg: 'minimum length of the book should be more than 5'
                },
                max: {
                    args: 1000,
                    msg: 'maximum length of the book should not be more than 1000'
                }
            }
        },
        book_description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [100, 1000],
                    msg: 'book description should be between 100 and 1000 characters'
                }
            }
        },
        book_prize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 1000,
                    msg: 'the least prize should be 1000 sum'
                },
                max: {
                    args: 1000000,
                    msg: 'maximum prize should not be more than 1000000 sum'
                }
            }
        },
        book_rent_prize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: 1000,
                    msg: 'the least prize should be 1000 sum'
                },
                max: {
                    args: 1000000,
                    msg: 'maximum prize should not be more than 1000000 sum'
                }
            }
        }
    }, {
        tableName: 'books',
        modelName: 'Book',
        updatedAt: 'book_updated_at',
        createdAt: 'book_created_at',
        underscored: true,
        sequelize,
    })
}