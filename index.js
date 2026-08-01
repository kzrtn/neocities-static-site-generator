const fs = require('node:fs')

const nunjucks = require('nunjucks')
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const dayjs = require('dayjs')

const config = require('./config/config.js')

const createFolderPathifNotExists = require('./utils/create_folderpath_if_not_exists.js')
const copyFilesFromPath = require('./utils/copy_files_from_folder.js')
const { randomUUID } = require('node:crypto')

const md = new MarkdownIt()
nunjucks.configure(config.TEMPLATES_PATH, { autoescape: false })

// dist set up, creates folders and copies stylesheets over
createFolderPathifNotExists(config.OUTPUT_PATH)
createFolderPathifNotExists(config.POST_OUTPUT_PATH)
copyFilesFromPath(config.STYLE_PATH, config.OUTPUT_PATH)

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let postsData = []
for (const post of config.posts) {
  const data = fs.readFileSync(`${config.POST_PATH}/${post}`, { encoding: 'utf-8', flag: 'r' })
  const file = matter(data)

  const content = md.render(file.content)
  const title = file.data.title
  const date = new Date(file.data.date)
  const filename = dayjs(date).format('YYYY-MM-DD') + '-' + removeIllegalChar(title)

  postsData.push({
    content: content,
    title: title,
    date: `${dayjs(date).format('YYYY-MM-DD')}`,
    day: weekdays[date.getDay()],
    id: randomUUID(),
    filename: `${filename}.html`
  })

  // Render the page with new data and final HTML to output
  const output = nunjucks.render(`${config.BLOG_POST}.html`, {content: content, title: title, date: date.toDateString()})
  fs.writeFileSync(`./dist/posts/${filename}.html`, output)
}

// Render the index page with all the posts
const result = nunjucks.render(`${config.BLOG_INDEX}.html`, {posts: postsData.reverse()})
fs.writeFileSync(`./dist/${config.BLOG_INDEX}.html`, result)

function removeIllegalChar(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-'); 
}