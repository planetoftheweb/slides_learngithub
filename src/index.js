import './scss/rayveal-theme.scss'
import 'animate.css/animate.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/twemoji-amazing.css'
import Menu from './site/js/slideList.json'

//Highlight.js
import hljs from 'highlight.js'
import 'highlight.js/styles/color-brewer.css'
import Footer from './footer.html?raw'

const markdown = import.meta.glob('./src/slides/*.md?raw')

hljs.highlightAll()

//Loading Google Fonts
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Source Code Pro:400', 'Source Sans Pro:200,300,400,500,700,800,900']
  }
})

//get URL Variables so we can load external files if necessary
function getUrlVars() {
  let vars = [],
    hash
  let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')

  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    vars.push(hash[0])
    vars[hash[0]] = hash[1]
  }
  return vars
}

// Load external markdown from URL if it exists
let dataFile = getUrlVars().d
if (getUrlVars().d) {
  document.querySelector('section').dataset.markdown = 'slides/' + dataFile + '.md'
} else {
  dataFile = 'index'
}

import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm'
import Highlight from 'reveal.js/plugin/highlight/highlight.esm'
import Notes from 'reveal.js/plugin/notes/notes.esm'

Reveal.initialize({
  plugins: [Markdown, Highlight, Notes],
  fragments: true, // Globally turn off fragments
  footer: false, //show footer menu
  margin: 0,
  minScale: 0,
  maxScale: 4,
  display: 'flex',
  history: true,
  disableLayout: false,
  center: false,
  hideInactiveCursor: true,
  hideCursorTime: 250,
  controls: false,
  progress: false,
  rollingLinks: false
})

Reveal.addKeyBinding({ keyCode: 84, key: 'T', description: 'Toggle footer display' }, () => {
  var myNode = document.querySelector('.footer')
  if (myNode !== null) {
    myNode.classList.toggle('fadeout')
  }
})

Reveal.addKeyBinding({ keyCode: 77, key: 'M', description: 'Toggle menu display' }, () => {
  var myNode = document.querySelector('.sidebar-menu')

  switch (myNode.className) {
    case 'sidebar-menu':
      myNode.classList.add('menuin')
      break
    case 'sidebar-menu menuin':
      myNode.className = 'sidebar-menu menuout'
      break
    case 'sidebar-menu menuout':
      myNode.className = 'sidebar-menu menuin'
      break
  }
})

// When Reveal.js has finished loading
Reveal.on('ready', () => {
  let mySlides = Reveal.getSlides() // get all the slides
  Reveal.hasPlugin('markdown')

  mySlides.forEach(currSlide => {
    //go through each slide

    // Does the slide use the no-fragment option (see demo)
    let hasFragments = null

      ; (currSlide.dataset.state && currSlide.dataset.state.includes('no-fragment')) || !Reveal.getConfig().fragments
        ? (hasFragments = false)
        : (hasFragments = true)

    if (hasFragments) {
      // Control which items to add fragments
      let fragmentNodes = currSlide.querySelectorAll(
        'li,  section > p, pre code:not(.has-highlights),embed, iframe:not(data-allowfullscreen), table:not(.hljs-ln), canvas'
      )

      fragmentNodes.forEach(item =>
        // Add the fragment class as well as an animation
        item.classList.add('fragment', 'fade-left')
      )
    }

    //Add line numbers to all fenced code
    let preCodeNodes = currSlide.querySelectorAll('pre code')
    preCodeNodes.forEach(item => (item.dataset.lineNumbers = true))

    //Make code tags automatically editable
    let codeNodes = currSlide.querySelectorAll('code')
    codeNodes.forEach(item => (item.contentEditable = true))
  }) // Go through Each slide

  // Load Sidebar Menu
  let targetNode = document.querySelector('.reveal')

  if (Reveal.getConfig().footer == true) {
    let footerContent = document.createElement('footer')
    footerContent.className = 'footer fadein'
    footerContent.innerHTML = Footer
    targetNode.parentNode.insertBefore(footerContent, targetNode.nextSibling)
  }

  let menuNav = document.createElement('nav')
  menuNav.className = 'sidebar-menu menuout'

  targetNode.parentNode.insertBefore(menuNav, targetNode)

  let menuHead = document.createElement('div')
  menuHead.className = 'menu-headline'
  menuHead.innerText = 'Documents'
  menuNav.appendChild(menuHead)

  Menu.sort((a, b) => {
    var x = a.filename.toLowerCase()
    var y = b.filename.toLowerCase()
    if (x < y) {
      return -1
    }
    if (x > y) {
      return 1
    }
    return 0
    return b.filename - a.filename
  }).map(item => {
    if (item.filename !== 'demo' && item.filename !== 'slides' && !item.filename.startsWith('00_') && !item.filename.startsWith('99_')) {
      let container = document.createElement('div')

      let menuFile = document.createElement('div')
      if (item.filename == dataFile) {
        container.className = 'menu-container active'
      } else {
        container.className = 'menu-container'
      }

      menuNav.appendChild(container)

      let menuLink = document.createElement('a')
      menuLink.className = 'menu-link'
      menuLink.href = `?d=${item.filename}&`
      container.appendChild(menuLink)

      menuFile.className = 'menu-filename'
      menuFile.innerText = `${item.filename}`
      menuLink.appendChild(menuFile)

      let menuTitle = document.createElement('div')
      menuTitle.className = 'menu-title'
      menuTitle.innerText = `${item.title}`
      menuLink.appendChild(menuTitle)

      let notes = document.createElement('a')
      notes.className = 'menu-notes'
      notes.href = `site/slides/${item.filename}/index.html`
      notes.innerText = `notes`

      container.appendChild(notes)
    }
  })
}) // Slides are ready to display
