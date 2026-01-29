const canvas = document.getElementById('canvas');

Object.assign(canvas.style, {
    // Layout & Positioning
    width: "90%",           
    maxWidth: "800px",            
    height: "auto",               
    margin: "40px auto",          
    
    // Visual Styling (The "Card" Look)
    backgroundColor: "#ffffff",
    border: "1px solid #e1e4e8",  
    borderRadius: "12px",        
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
    
    // Typography & Spacing
    padding: "40px",            
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#333",                
    lineHeight: "1.6",            
    boxSizing: "border-box"       
});

let setTheme

const now = new Date();
const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

async function generateBlog(slug,themeName) {
    console.log("library: ",themeName)
  const response = await fetch(`https://blogify-three-weld.vercel.app/api/viewblog/${slug}`);
  const data = await response.json();
    if(themeName){
        setTheme = themes.find((theme)=>theme.names.includes(themeName))
        Object.assign(canvas.style,setTheme.canvas)

    }else{
        setTheme = null
    }
    // console.log(setTheme)
    canvas.append(renderBlogPost(data.blog,setTheme))
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
    if(setTheme){
        Object.assign(span.style,setTheme.code)
    }else{
        span.style.color = '#ff6666'
    span.style.backgroundColor = '#ededed'
    }
    span.style.borderRadius = '4px'
    span.style.padding = '2px 6px'
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

function renderBlogPost(blog,theme){

    // EACH BLOG WILL BE INSIDE AN ARTICLE
    let article = document.createElement('article')
    
    if(theme){
        Object.assign(article.style,theme.article)
    }else{
        Object.assign(article.style,{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
    color: "#333",             
    lineHeight: "1.6",            
    boxSizing: "border-box"
    })
    }

    //  TITLE IS FROM JSON
    let title = document.createElement('h1')
    title.innerText = blog.title

    
    if(theme){
        Object.assign(title.style,theme.title)
    }else{
    title.style.textAlign = 'left'
    title.style.color = '#3f3f3f'
    }
    article.append(title)
    console.log(blog.createdAt)

    // CREATED DATE AND TIME GENERATION
    const dateOfCreation = new Date(blog.createdAt);
    const dateString = dateOfCreation.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); 
    const timeString = dateOfCreation.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit',});

    let publlishedOn = document.createElement('h5')
    if(theme){
        Object.assign(publlishedOn.style,theme.publlishedOn)
    }else{
        publlishedOn.style.color = '#90abb5'
    publlishedOn.style.fontWeight = '200'
    }
    publlishedOn.append("Published on ",dateString," • ",timeString)

    article.append(publlishedOn)
    let hr = document.createElement('hr')
    if(theme){
        Object.assign(hr.style,theme.hr)
    }
    article.append(hr)

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
            tag = document.createElement('h1')
            break;
        }
        case "heading-two":{
            tag = document.createElement('h2')
            break;
        }
        case "paragraph":{
            tag = document.createElement('p')
            // tag.style.marginBottom = '100px'     //  ADD THIS LINE ONLY IN FURTHER CSS STYLING
            break;
        }
        case "numbered-list":{
            tag = document.createElement('ol')
            break;
        }
        case "bulleted-list":{
            tag = document.createElement('ul')
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
    if(!(tag.tagName == 'OL' || tag.tagName == "UL")){
            element.children.forEach((child)=>{
            tag.append(createText(child))
        })
    }
    if(tag.tagName == 'OL' || tag.tagName == "UL"){
            element.children.forEach((listItem)=>{
                tag.append(createList(listItem))
            })
    }

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

function createList(listItem){
    let li = document.createElement('li')

    listItem.children.forEach((item)=>{
        li.append(createText(item))
    })

    return li    
}


/*          COLOR THEMES FOR BLOG RENDERING LIBRARY         */

const themes = [
    // 1. TOKYO NIGHT (Your existing theme)
    {
        names: ['tokyoNight', 'tokyo_night', 'TokyoNight', 'Tokyo_night', 'Tokyo_Night'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#24283b",
            border: "1px solid #414868",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            padding: "40px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "#a9b1d6",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#24283b", fontFamily: "'JetBrains Mono', monospace", color: "#a9b1d6", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#7aa2f7" },
        publlishedOn: { fontWeight: '200', color: '#565f89' },
        hr: { color: '#414868' },
        heading1: { color: "#c0caf5" },
        heading2: { color: '#f7768e' },
        text: { color: "#a9b1d6" },
        boldText: { color: "#7dcfff", fontWeight: "800" },
        li: { fontWeight: "bold", color: "#bb9af7" },
        code: { color: "#7dcfff", backgroundColor: "#292e42" }
    },

    // 2. DRACULA (High Contrast Dark)
    {
        names: ['dracula', 'Dracula', 'vampire'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#282a36", // Dracula Background
            border: "1px solid #44475a",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            padding: "40px",
            fontFamily: "'Fira Code', monospace",
            color: "#f8f8f2",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#282a36", fontFamily: "'Fira Code', monospace", color: "#f8f8f2", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#bd93f9" }, // Purple
        publlishedOn: { fontWeight: '200', color: '#6272a4' }, // Comment Purple
        hr: { color: '#44475a' },
        heading1: { color: "#ff79c6" }, // Pink
        heading2: { color: '#50fa7b' }, // Green
        text: { color: "#f8f8f2" },
        boldText: { color: "#ffb86c", fontWeight: "800" }, // Orange
        li: { fontWeight: "bold", color: "#bd93f9" },
        code: { color: "#f1fa8c", backgroundColor: "#44475a" } // Yellow text on selection bg
    },

    // 3. SOLARIZED LIGHT (Warm, Paper-like)
    {
        names: ['solarized', 'solarizedLight', 'Solarized', 'day'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#fdf6e3", // Base3
            border: "1px solid #eee8d5", // Base2
            borderRadius: "8px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)", // Very subtle shadow
            padding: "40px",
            fontFamily: "'Merriweather', serif", // Serif looks great on Solarized
            color: "#657b83", // Base00
            lineHeight: "1.8",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#fdf6e3", fontFamily: "'Merriweather', serif", color: "#657b83", lineHeight: "1.8", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#b58900" }, // Yellow
        publlishedOn: { fontWeight: '200', color: '#93a1a1' }, // Base1
        hr: { color: '#eee8d5' },
        heading1: { color: "#cb4b16" }, // Orange
        heading2: { color: '#268bd2' }, // Blue
        text: { color: "#657b83" },
        boldText: { color: "#d33682", fontWeight: "800" }, // Magenta
        li: { fontWeight: "bold", color: "#859900" }, // Green
        code: { color: "#2aa198", backgroundColor: "#eee8d5" } // Cyan on Base2
    },

    // 4. GITHUB MODERN (Clean, Professional, White)
    {
        names: ['github', 'clean', 'light', 'GitHub'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #d0d7de",
            borderRadius: "6px",
            boxShadow: "0 3px 6px rgba(140, 149, 159, 0.15)",
            padding: "40px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
            color: "#24292f",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#ffffff", fontFamily: "sans-serif", color: "#24292f", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#1f2328" },
        publlishedOn: { fontWeight: '200', color: '#6e7781' },
        hr: { color: '#d0d7de' },
        heading1: { color: "#24292f" },
        heading2: { color: '#24292f' }, // GitHub uses dark headers usually
        text: { color: "#24292f" },
        boldText: { color: "#24292f", fontWeight: "800" },
        li: { fontWeight: "bold", color: "#0969da" }, // GitHub Blue
        code: { color: "#24292f", backgroundColor: "#f6f8fa" }
    },

    // 5. MONOKAI PRO (Vibrant, Colorful, Artistic)
    {
        names: ['monokai', 'Monokai', 'sublime'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#2d2a2e",
            border: "1px solid #403e41",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
            padding: "40px",
            fontFamily: "'Operator Mono', 'Fira Code', monospace",
            color: "#fcfcfa",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#2d2a2e", fontFamily: "monospace", color: "#fcfcfa", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#ffd866" }, // Yellow
        publlishedOn: { fontWeight: '200', color: '#939293' },
        hr: { color: '#403e41' },
        heading1: { color: "#ff6188" }, // Red/Pink
        heading2: { color: '#a9dc76' }, // Green
        text: { color: "#fcfcfa" },
        boldText: { color: "#78dce8", fontWeight: "800" }, // Cyan
        li: { fontWeight: "bold", color: "#ab9df2" }, // Purple
        code: { color: "#ff6188", backgroundColor: "#403e41" }
    },

    // 6. NORD (Arctic, Matte, Cool Blues)
    {
        names: ['nord', 'arctic', 'Nord'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#2e3440", // Polar Night
            border: "1px solid #3b4252",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            padding: "40px",
            fontFamily: "'Rubik', sans-serif",
            color: "#d8dee9", // Snow Storm
            lineHeight: "1.7",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#2e3440", fontFamily: "sans-serif", color: "#d8dee9", lineHeight: "1.7", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#88c0d0" }, // Frost Blue
        publlishedOn: { fontWeight: '200', color: '#4c566a' },
        hr: { color: '#434c5e' },
        heading1: { color: "#81a1c1" }, // Frost Blue Darker
        heading2: { color: '#5e81ac' }, // Frost Blue Darkest
        text: { color: "#d8dee9" },
        boldText: { color: "#ebcb8b", fontWeight: "800" }, // Aurora Yellow
        li: { fontWeight: "bold", color: "#a3be8c" }, // Aurora Green
        code: { color: "#d8dee9", backgroundColor: "#3b4252" }
    },

    // 7. CYBERPUNK (Neon, Black, Aggressive)
    {
        names: ['cyberpunk', 'neon', 'future'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#000b1e", // Deep deep blue/black
            border: "2px solid #00f3ff", // Neon Cyan Border
            borderRadius: "0px", // Sharp corners
            boxShadow: "0 0 15px rgba(0, 243, 255, 0.3), 0 0 30px rgba(0, 243, 255, 0.1)", // Glow
            padding: "40px",
            fontFamily: "'Orbitron', 'Roboto', sans-serif",
            color: "#e0e0e0",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#000b1e", fontFamily: "sans-serif", color: "#e0e0e0", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#fee801" }, // Cyber Yellow
        publlishedOn: { fontWeight: '200', color: '#00f3ff' }, // Cyan
        hr: { color: '#ff003c' }, // Neon Red
        heading1: { color: "#ff003c" }, // Neon Red
        heading2: { color: '#00f3ff' }, // Neon Cyan
        text: { color: "#e0e0e0" },
        boldText: { color: "#fee801", fontWeight: "800" },
        li: { fontWeight: "bold", color: "#ff00ff" }, // Magenta
        code: { color: "#fee801", backgroundColor: "#111" }
    },
    // 8. SPIDER-MAN (Classic Red & Blue)
    {
        names: ['spiderman', 'spider-man', 'spidey', 'peter_parker'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#0b162c", // Deep "Suit Blue"
            border: "3px solid #e62429", // Marvel Red
            borderRadius: "16px", // Softer, organic curves
            boxShadow: "0 0 25px rgba(230, 36, 41, 0.25)", // Subtle radioactive red glow
            padding: "40px",
            fontFamily: "'Roboto', 'Arial', sans-serif", // Clean and heroic
            color: "#edf2f4", // "Eye White" for readability
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#0b162c", fontFamily: "sans-serif", color: "#edf2f4", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#e62429", textTransform: 'uppercase', letterSpacing: '1.5px' }, // Bold Comic Header
        publlishedOn: { fontWeight: 'bold', color: '#48cae4' }, // Electric "Web-Shooter" Blue
        hr: { color: '#e62429' },
        heading1: { color: "#e62429" },
        heading2: { color: '#ffffff' }, // White headers for contrast
        text: { color: "#edf2f4" },
        boldText: { color: "#e62429", fontWeight: "800" },
        li: { fontWeight: "bold", color: "#e62429" }, // Red bullets
        code: { color: "#0b162c", backgroundColor: "#edf2f4" } // Inverted: Dark Text on White "Web" background
    },
    // 9. THE HULK (Gamma Radiation)
    {
        names: ['hulk', 'bruce_banner', 'smash', 'gamma'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#1a0f2e", // Ripped Purple Pants
            border: "3px solid #39ff14", // Radioactive Neon Green
            borderRadius: "8px", // Rougher edges
            boxShadow: "0 0 30px rgba(57, 255, 20, 0.4)", // Toxic Green Glow
            padding: "40px",
            fontFamily: "'Arial Black', 'Impact', sans-serif", // Thick and heavy
            color: "#e0e0e0",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#1a0f2e", fontFamily: "sans-serif", color: "#e0e0e0", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#39ff14", textTransform: 'uppercase', fontSize: '2.5rem' }, // SMASH size
        publlishedOn: { fontWeight: 'bold', color: '#9b59b6' }, // Light Purple
        hr: { color: '#39ff14' },
        heading1: { color: "#39ff14" },
        heading2: { color: '#ba68c8' }, // Purple
        text: { color: "#e0e0e0" },
        boldText: { color: "#39ff14", fontWeight: "900" },
        li: { fontWeight: "bold", color: "#39ff14" },
        code: { color: "#1a0f2e", backgroundColor: "#39ff14" } // Inverted: Purple text on Green block
    },

    // 10. BATMAN (Gotham Shadows)
    {
        names: ['batman', 'bruce_wayne', 'dark_knight', 'gotham'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#101010", // Matte Black
            border: "1px solid #333333", // Dark Grey Stealth Border
            borderRadius: "6px", // Sharp and tactical
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9)", // Deep heavy shadow
            padding: "40px",
            fontFamily: "'Oswald', 'Roboto Condensed', sans-serif", // Tall and imposing
            color: "#aaaaaa", // Gotham Grey
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#101010", fontFamily: "sans-serif", color: "#aaaaaa", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#ffffff", letterSpacing: '2px' },
        publlishedOn: { fontWeight: '200', color: '#ffe919' }, // Utility Belt Yellow
        hr: { color: '#333333' },
        heading1: { color: "#ffe919" }, // Yellow accent
        heading2: { color: '#555555' }, // Dark Grey
        text: { color: "#aaaaaa" },
        boldText: { color: "#ffe919", fontWeight: "700" },
        li: { fontWeight: "bold", color: "#ffe919" },
        code: { color: "#ffe919", backgroundColor: "#1c1c1c" } // Yellow text on dark armor plate
    },

    // 11. IRON MAN (Stark Tech)
    {
        names: ['ironman', 'iron_man', 'tony_stark', 'jarvis'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#2d0a0a", // Hot Rod Red (Darkened)
            border: "2px solid #d4af37", // Gold Alloy
            borderRadius: "20px", // Smooth sleek curves
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)", // Arc Reactor Blue Glow
            padding: "40px",
            fontFamily: "'Rajdhani', 'Orbitron', sans-serif", // HUD / Sci-Fi font
            color: "#ffebd6",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#2d0a0a", fontFamily: "sans-serif", color: "#ffebd6", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'right', color: "#d4af37" }, // Gold
        publlishedOn: { fontWeight: '200', color: '#00ffff' }, // Cyan
        hr: { color: '#d4af37' },
        heading1: { color: "#00ffff" }, // Arc Reactor Blue
        heading2: { color: '#d4af37' }, // Gold
        text: { color: "#ffebd6" },
        boldText: { color: "#00ffff", fontWeight: "800" },
        li: { fontWeight: "bold", color: "#d4af37" },
        code: { color: "#00ffff", backgroundColor: "rgba(0, 255, 255, 0.1)" } // Holographic transparent blue
    },

    // 12. CAPTAIN AMERICA (Star Spangled)
    {
        names: ['captain_america', 'cap', 'steve_rogers', 'shield'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#002147", // Old Glory Blue
            border: "4px solid #ffffff", // Vibranium Shield Rim (White/Silver)
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 33, 71, 0.5)",
            padding: "40px",
            fontFamily: "'Montserrat', 'Verdana', sans-serif", // Strong and Classic
            color: "#ffffff",
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#002147", fontFamily: "sans-serif", color: "#ffffff", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#ffffff", textTransform: 'uppercase' },
        publlishedOn: { fontWeight: 'bold', color: '#bb133e' }, // Flag Red
        hr: { color: '#bb133e' },
        heading1: { color: "#ffffff" },
        heading2: { color: '#bb133e' }, // Red
        text: { color: "#f0f0f0" },
        boldText: { color: "#bb133e", fontWeight: "700" },
        li: { fontWeight: "bold", color: "#ffffff" }, // Stars (White)
        code: { color: "#002147", backgroundColor: "#ffffff" } // Blue text on White (Inverted)
    },

    // 13. THOR (Asgardian Thunder)
    {
        names: ['thor', 'odinson', 'asgard', 'thunder'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#22252b", // Gunmetal Armor
            border: "2px solid #ffd700", // Asgardian Gold
            borderRadius: "4px", // Regal, slightly squared
            boxShadow: "0 0 30px rgba(0, 229, 255, 0.4)", // Lightning Blue Glow
            padding: "40px",
            fontFamily: "'Cinzel', 'Trajan Pro', serif", // Mythological / Ancient
            color: "#e1e1e1",
            lineHeight: "1.7",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#22252b", fontFamily: "serif", color: "#e1e1e1", lineHeight: "1.7", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#ffd700", textTransform: 'uppercase' }, // Gold
        publlishedOn: { fontWeight: '200', color: '#00e5ff' }, // Lightning Blue
        hr: { color: '#ffd700' },
        heading1: { color: "#c62828" }, // Cape Red
        heading2: { color: '#ffd700' }, // Gold
        text: { color: "#e1e1e1" },
        boldText: { color: "#00e5ff", fontWeight: "800" }, // Lightning
        li: { fontWeight: "bold", color: "#ffd700" },
        code: { color: "#22252b", backgroundColor: "#00e5ff" } // Dark text on Lightning background
    },
    // 14. PAPER (Minimalist & Classic)
    {
        names: ['paper', 'minimal', 'classic', 'newspaper'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #000000", // Stark black border
            borderRadius: "0px", // No radius, like a sheet of paper
            boxShadow: "10px 10px 0px rgba(0, 0, 0, 0.1)", // Hard shadow
            padding: "40px",
            fontFamily: "'Georgia', 'Times New Roman', serif", // Classic serif
            color: "#333333",
            lineHeight: "1.8",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#ffffff", fontFamily: "serif", color: "#333333", lineHeight: "1.8", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#000000", fontWeight: '900' },
        publlishedOn: { fontWeight: 'italic', color: '#666666' },
        hr: { color: '#000000' },
        heading1: { color: "#000000" },
        heading2: { color: '#333333', textDecoration: 'underline' },
        text: { color: "#333333" },
        boldText: { color: "#000000", fontWeight: "bold" },
        li: { fontWeight: "bold", color: "#000000" },
        code: { color: "#000000", backgroundColor: "#f4f4f4" } // Grey bg
    },

    // 15. MATCHA (Nature & Green)
    {
        names: ['matcha', 'nature', 'green', 'forest_light'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #c8e6c9", // Pale Green
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(46, 125, 50, 0.1)", // Soft Green Shadow
            padding: "40px",
            fontFamily: "'Nunito', 'Segoe UI', sans-serif", // Round and friendly
            color: "#37474f", // Blue Grey
            lineHeight: "1.7",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#ffffff", fontFamily: "sans-serif", color: "#37474f", lineHeight: "1.7", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#2e7d32" }, // Forest Green
        publlishedOn: { fontWeight: '200', color: '#81c784' }, // Light Green
        hr: { color: '#a5d6a7' },
        heading1: { color: "#1b5e20" }, // Dark Green
        heading2: { color: '#4caf50' }, // Standard Green
        text: { color: "#37474f" },
        boldText: { color: "#2e7d32", fontWeight: "700" },
        li: { fontWeight: "bold", color: "#66bb6a" },
        code: { color: "#1b5e20", backgroundColor: "#f1f8e9" } // Very pale green bg
    },

    // 16. CORPORATE BLUE (Tech & Professional)
    {
        names: ['corporate', 'tech_light', 'blue_light', 'professional'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#f8f9fa", // Very light grey
            border: "1px solid #e9ecef",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            padding: "40px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
            color: "#495057", // Slate Grey
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#f8f9fa", fontFamily: "sans-serif", color: "#495057", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#0d6efd" }, // Bootstrap Blue
        publlishedOn: { fontWeight: '200', color: '#6c757d' }, // Muted Grey
        hr: { color: '#dee2e6' },
        heading1: { color: "#0d6efd" },
        heading2: { color: '#0a58ca' }, // Darker Blue
        text: { color: "#212529" },
        boldText: { color: "#0d6efd", fontWeight: "700" },
        li: { fontWeight: "bold", color: "#0d6efd" },
        code: { color: "#0d6efd", backgroundColor: "#e7f1ff" } // Light blue bg
    },

    // 17. CUPCAKE (Pastel & Soft)
    {
        names: ['cupcake', 'pastel', 'pink_light', 'soft'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#fffafa", // Snow
            border: "2px dashed #f8bbd0", // Pink Dashed Border
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(244, 143, 177, 0.2)",
            padding: "40px",
            fontFamily: "'Quicksand', 'Comic Sans MS', sans-serif", // Fun font
            color: "#5d4037", // Brown text (like chocolate)
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#fffafa", fontFamily: "sans-serif", color: "#5d4037", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#ec407a" }, // Dark Pink
        publlishedOn: { fontWeight: 'bold', color: '#ba68c8' }, // Lavender
        hr: { color: '#f8bbd0' },
        heading1: { color: "#ab47bc" }, // Purple
        heading2: { color: '#ec407a' }, // Pink
        text: { color: "#5d4037" },
        boldText: { color: "#ec407a", fontWeight: "700" },
        li: { fontWeight: "bold", color: "#26c6da" }, // Teal/Sprinkles
        code: { color: "#ec407a", backgroundColor: "#fce4ec" } // Pink mist bg
    },

    // 18. SEPIA (Retro & Reading)
    {
        names: ['sepia', 'retro', 'book', 'coffee'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#f4ecd8", // Aged Paper
            border: "1px solid #d7ccc8",
            borderRadius: "4px",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.05)", // Inner vignette
            padding: "40px",
            fontFamily: "'Courier Prime', 'Courier New', monospace", // Typewriter
            color: "#4e342e", // Coffee Brown
            lineHeight: "1.6",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#f4ecd8", fontFamily: "monospace", color: "#4e342e", lineHeight: "1.6", boxSizing: "border-box" },
        title: { textAlign: 'left', color: "#3e2723" }, // Dark Brown
        publlishedOn: { fontWeight: '200', color: '#8d6e63' },
        hr: { color: '#a1887f' },
        heading1: { color: "#5d4037" },
        heading2: { color: "#8d6e63" },
        text: { color: "#4e342e" },
        boldText: { color: "#3e2723", fontWeight: "900" },
        li: { fontWeight: "bold", color: "#bf360c" }, // Rust Orange
        code: { color: "#bf360c", backgroundColor: "#efebe9" }
    },

    // 19. LAVENDER (Elegant & Airy)
    {
        names: ['lavender', 'purple_light', 'elegant'],
        canvas: {
            width: "90%",
            maxWidth: "800px",
            height: "auto",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e1bee7", // Light Purple
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(123, 31, 162, 0.08)", // Purple Haze
            padding: "40px",
            fontFamily: "'Playfair Display', serif", // Elegant serif
            color: "#4a148c", // Deep Purple
            lineHeight: "1.8",
            boxSizing: "border-box"
        },
        article: { backgroundColor: "#ffffff", fontFamily: "serif", color: "#4a148c", lineHeight: "1.8", boxSizing: "border-box" },
        title: { textAlign: 'center', color: "#7b1fa2", fontStyle: "italic" },
        publlishedOn: { fontWeight: '200', color: '#ce93d8' },
        hr: { color: '#e1bee7' },
        heading1: { color: "#6a1b9a" },
        heading2: { color: "#8e24aa" },
        text: { color: "#4a148c" },
        boldText: { color: "#7b1fa2", fontWeight: "700" },
        li: { fontWeight: "bold", color: "#ba68c8" },
        code: { color: "#6a1b9a", backgroundColor: "#f3e5f5" } // Very light purple
    }
];