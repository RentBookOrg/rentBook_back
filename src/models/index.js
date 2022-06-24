import path from 'path'
import fs from 'fs/promises'

export default async function({ sequelize }) {
    const dir = await fs.readdir(path.join(path.resolve(), 'src', 'models'))
    
    for await(let file of dir) {
        if(file == 'index.js' || file == 'relations.js') continue

        const { default: Model } = await import(path.join(path.resolve(), 'src', 'models', file))
        Model({ sequelize })
    }

    const { default: Model } = await import(path.join(path.resolve(), 'src', 'models', 'relations.js'))
    Model({ sequelize })
}