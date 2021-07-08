const pluginTOC = require('eleventy-plugin-nesting-toc')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h1'],
    wrapper: 'div',
    wrapperClass: ''
  })

  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }
    return array.slice(0, n)
  })

  // create a collection from the `slides` directory
  eleventyConfig.addCollection('slides', function (collection) {
    return collection.getFilteredByGlob('./src/slides/*.md')
  })

  //Sort by fileSlug
  eleventyConfig.addFilter('sortBySlugs', (array) => {
    return array.sort((a, b) => a.fileSlug.localeCompare(b.fileSlug))
  })

  /* Markdown Plugins */
  let markdownIt = require('markdown-it')
  let markdownItAnchor = require('markdown-it-anchor')
  let options = {
    html: true,
    breaks: true,
    linkify: true
  }
  let opts = {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: ' '
  }

  eleventyConfig.setLibrary('md', markdownIt(options).use(markdownItAnchor, opts))

  return {
    templateFormats: ['md', 'njk'],
    pathPrefix: '/',
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    setQuietMode: false,
    passthroughFileCopy: true,
    dir: {
      input: './src',
      templates: '_includes',
      data: '_data',
      output: './src/site'
    }
  }
}
