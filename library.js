const body = document.body

const canvas = document.createElement('div')
Object.assign(canvas.style,{
    width:"60%",
    height:"max-content",
    position:"fixed",
    left:'50%',
    transform:'translate(-50%, 0)',
    border:"2px solid red"
})
body.append(canvas)

async function generateBlog(slug) {
  const response = await fetch(`https://blogify-three-weld.vercel.app/api/findblog/${slug}`);
  const data = await response.json();
  console.log(data)
    canvas.append(renderBlogPost(data.blog))
}

function bold(b){
    let boldText = document.createElement('b')
    boldText.append(b)
    return (boldText)
}

function italics(i){
    let italicText = document.createElement('i')
    italicText.append(i)
    return (italicText)
}

function underline(u){
    let underlineText = document.createElement('u')
    underlineText.append(u)
    return (underlineText)
}

function code(s){
    let span = document.createElement('span')
    span.style.fontFamily = 'monospace'
    span.style.color = '#ff6666'
    span.append(s)
    return (span)
}

function bulletNumber(a){
    let ol = document.createElement('ol')
    a.forEach((i)=>{
        let li = document.createElement('li')
        li.append(i)
        ol.append(li)
    })
    return (ol)
}

function renderBlogPost(blog){

    // EACH BLOG WILL BE INSIDE AN ARTICLE
    let article = document.createElement('article')

    //  TITLE IS FROM JSON
    let title = document.createElement('h1')
    title.innerText = blog.title
    title.style.textAlign = 'center'
    article.append(title)

    //  ALIGNMENT SECTION TYPE[HEADING OR PARAGRAPH] FUNCTION CALLING
    blog.content.forEach((element)=>{
        article.append(sectionSetup(element))
    })
    return article
}   

function sectionSetup(element){
    let tag

    //  SWITCH FOR CREATING CUSTOM TAG
    switch (element.type){
        case "heading-one":{
            tag = document.createElement('h2')
            break;
        }
        case "heading-two":{
            tag = document.createElement('h3')
            break;
        }
        case "paragraph":{
            tag = document.createElement('p')
            break;
        }
        default:{
            tag = document.createElement('div')
            break;
        }
    }

    //  SWITCH FOR ALIGNING CUSTOM CREATED TAG
    switch(element.align){
        case "right":{
            tag.style.textAlign = 'right'
            break;
        }
        case "center":{
            tag.style.textAlign = 'center'
            break;
        }
        case "justify":{
            tag.style.textAlign = 'justify'
            break;
        }
        default:{
            tag.style.textAlign = 'left'
            break;
        }
    }

    element.children.forEach((child)=>{
        tag.append(createText(child))
    })

    return tag

}

function createText(child){
    let text = child.text

    /*  CREATE CONDITION FOR EMPTY STRING   */

    if(child.bold){
        text = bold(text)
    }
    if(child.italic){
        text = italics(text)
    }
    if(child.underline){
        text = underline(text)
    }
    if(child.code){
        text = code(text)
    }
    return text
}