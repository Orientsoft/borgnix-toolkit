import Nedb from 'nedb'
import path from 'path'

let db = new Nedb({
  filename: path.join(gui.App.dataPath, 'store.db')
})

export default db
