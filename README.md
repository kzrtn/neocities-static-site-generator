# A Simple Static Site Generator (simpler-SSG)
This is a simple static site generator for blog entries on neocities.

## How it works
[Markdown](https://www.markdownguide.org/basic-syntax/) files in the `_posts` folder automatically gets converted by Nunjucks and MarkdownIt into HTML files and output them all into the `dist` folder with your own layout and style.

simpler-SSG also supports taking all of those markdown files and indexing them in a final `blog-index.html` file. This way you can easily create new blog posts without worrying about writing raw html for the posts and manually updating your hyperlinks to them.

## Quick Start
First, ensure you have [Node](https://nodejs.org/en/download) installed.

Then run:
```
npx simpler-ssg create (your-site-name)
```
It will generate a folder named after `(your-site-name)` with the following folders:
* `_media` - for assets (images, videos, etc)
* `_posts` - for blog posts written in markdown
* `_styles` - should contain any .css files that `_templates` uses
* `_templates` - holds `blog-index.html` and `blog-post.html`, the template files for blog post and blog index generation
* `config` - contains config.js

To build your site, first enter the working directory of your website:
```
cd (your-site-name)
```

Then run:
```
npx simpler-ssg serve
```
simpler-ssg will generate a folder called `dist` that contains all of the output files your use. It will also open a live preview of the website that also updates whenever you save any file in the project.

## Templating
You can edit the layouts of the generated blog posts and blog index in the `_templates` folder. The content is inserted with Nunjucks, so it uses [Jinja2](https://jinja.palletsprojects.com/en/stable/) style syntax.

Basically:
* `{{ content }}` inserts the blog post contents
* `{{ title }}` inserts the blog post's title
* `{{ date }}` inserts the blog post's date

The blog index is a little bit more tricky. It uses a for loop of all of your posts with these attributes that you can insert:
* `{{ post.content }}`: The post's contents
* `{{ post.date }}`: The post's date
* `{{ post.day }}`: The post's day (but in shortform format only, aka Mon, Tue, Wed etc)
* `{{ post.id }}`: The post's generated ID
* `{{ post.title }}`: The post's title

The posts also rely on the styles.css in the `_styles` folder. The generated site automatically copies the stylesheets there and inserts them at the root of the `dist` folder. Make sure your layout templates correctly links to it!

We also support images! Put them in any folder within the project (even outside `_posts`) and appropriately link to them. The images will get copied over in the same folder format to `dist`.

## Dependencies
* Nunjucks
* MarkdownIt
* Browser-server

## To-do:
* ~~Add ability for posts to include images~~ DONE
* ~~Add an easier way for users to install this with the templates, configs, etc~~
* Fix this readme, it's not comprehensible enough
* Write unit tests for this (I FEEL like there are bugs but I can't tell yet)
* Add ability for different markdown posts to link to different blog templates
* Add `npx simpler-ssg build` option for builders who don't want to serve
* (maybe) write my own markdown parser
