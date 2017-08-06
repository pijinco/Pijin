import marked from 'marked'
import fs from 'fs'
import path from 'path'

import sandy from './sandbox'

const file = fs.readFileSync(path.resolve(__dirname, '..', 'template', 'http', 'raw.md')).toString()
const parsed = marked.lexer(file)

const { text } = parsed.find(x => x.type === 'code')

const exp = sandy.run(text)

const req = {}

exp(req)

