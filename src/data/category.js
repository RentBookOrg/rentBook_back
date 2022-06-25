
const categories = ["Fiction", "Non-Fiction", "Novel", "Romance", "Self-Help Books", "Children’s Books", 
"Biography", "Autobiography", "Text-books", "Political Books", "Academic Books", "Mystery",
"Thrillers", "Poetry Books", "Spiritual Books", "Cook Books", "Art Books", "Young Adult Books",
"Board Books", "History Books"]

export default async function({ sequelize }) {
    const Category = sequelize.models.Category

    for(let el of categories) {
        await Category.create({ category_name: el })
    }
}