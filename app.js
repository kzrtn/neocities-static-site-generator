const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const ROOT = process.argv[3]

const nunjucks = require('nunjucks')
const MarkdownIt = require('markdown-it')
const matter = require('gray-matter')
const dayjs = require('dayjs')

const config = require(path.join(ROOT, '/config/config.js'))
const createFolderPathifNotExists = require(path.join(__dirname, '/utils/create_folderpath_if_not_exists.js'))
const copyFilesFromPath = require(path.join(__dirname, '/utils/copy_files_from_folder.js'))
const removeIllegalChar = require(path.join(__dirname, '/utils/remove_illegal_char_from_string.js'))
const { randomUUID } = require('node:crypto')

const md = new MarkdownIt()
nunjucks.configure(path.join(ROOT, config.TEMPLATES_PATH), { autoescape: false })

// Delete dist folder, recreate and copy stylesheets over
// It's important to delete any previous posts that are no longer in _posts
const distFolderSetUp = () => {
  fs.rmSync(path.join(ROOT, config.OUTPUT_PATH), { recursive:true, force: true })
  createFolderPathifNotExists(path.join(ROOT, config.OUTPUT_PATH))
  createFolderPathifNotExists(path.join(ROOT, config.POST_OUTPUT_PATH))
  copyFilesFromPath(path.join(ROOT, config.STYLE_PATH), path.join(ROOT, config.OUTPUT_PATH))
  console.log("Successfuly created output folders and copied style sheets.")
}

const generateBlogPosts = () => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const postsPath = path.join(ROOT, config.POST_PATH)
  const posts = fs.readdirSync(postsPath)
  for (const post of posts) {
    const rawData = fs.readFileSync(path.join(postsPath, post), { encoding: 'utf-8', flag: 'r' })
    const dataObj = matter(rawData)
    
    const HTMLcontent = md.render(dataObj.content)
    const title = dataObj.data.title
    const date = new Date(dataObj.data.date)
    const filename = dayjs(date).format('YYYY-MM-DD') + '-' + removeIllegalChar(title)

    postsData.push({
      content: HTMLcontent,
      title: title,
      date: `${dayjs(date).format('YYYY-MM-DD')}`,
      day: weekdays[date.getDay()],
      id: randomUUID(),
      filename: `${filename}.html`
    })

    // Copy images to appropriate destination in dist if they exist
    parseImages(dataObj.content)

    // Render the page with new data and final HTML to output
    const output = nunjucks.render(`${config.BLOG_POST}.html`, {content: HTMLcontent, title: title, date: date.toDateString()})
    fs.writeFileSync(path.join(ROOT, config.OUTPUT_PATH, '/posts/', `${filename}.html`), output)
  }
  console.log('Successfully generated blog posts.')
}

const generateBlogIndex = postsData => {
  // Render the index page with all the posts
  const result = nunjucks.render(`${config.BLOG_INDEX}.html`, {posts: postsData.reverse()})
  fs.writeFileSync(path.join(ROOT, config.OUTPUT_PATH, `${config.BLOG_INDEX}.html`), result)
  console.log('Successfully generated blog index.')
}


// Accepts string of markdown data and copies any images referenced to output folder
const parseImages = rawData => {
  const imagePaths = rawData.match(/(?<=!\[.*\]\().*(?=\))/g)
  if (imagePaths == null) return
  
  imagePaths.forEach(imagePath => {
    if (!imagePath.includes('http')) {
      if (imagePath.includes('<') && imagePath.includes('>')) {
        imagePath = (imagePath.match(/(?<=<).*(?=>)/g))[0]
      }
      
      const imageHomePath = imagePath.match(/^.*[\/$]/g) // This regex gives the closest parent folder to the image file
      createFolderPathifNotExists(path.join(ROOT, `/${config.OUTPUT_PATH}/posts/${imageHomePath}`))
      const sourcePath = path.join(ROOT, `/_posts/${imagePath}`)
      const destPath = path.join(ROOT, `/${config.OUTPUT_PATH}/posts/${imagePath}`)

      try {
        fs.copyFileSync(sourcePath, destPath)
        // console.log(`COPIED FILE: FROM '${sourcePath}' TO '${destPath}'`)
      } catch (err) {
        console.error(err.message)
      }
    }
  })  
}

let postsData = []
distFolderSetUp()
generateBlogPosts(postsData)
generateBlogIndex(postsData)