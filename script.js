
// magyarázat:
// clientX : kurzorra szokás lekérni, a képernyőn lévő pozíció (tehát az oldal legörgetése nem hat rá)
// a pageX-re azonban hatással van a görgetés, az a lap tetejétől mér
// a screenX-re nincs hatással a görgetés, az a képernyő tetejétől mér
// példának nézd a konzolt

// getBoundingClientRect() : Return the size of an element and its position relative to the viewport

let screenLog = document.querySelector('#screen-log')
document.addEventListener('mousemove', logKey)

function logKey(e) {
  screenLog.innerText = `
    Screen X/Y: ${e.screenX}, ${e.screenY}
    Client X/Y: ${e.clientX}, ${e.clientY}
    Page X/Y: ${e.pageX}, ${e.pageY}`
}



document.onselectstart = (e) => {e.preventDefault()}



const items = document.querySelectorAll(".movable")
let isResizing = false;
let isExpanding = false;
let isCtrlDown = false;


for(let i of items){
    i.addEventListener('mousedown', generateNewItem)
    i.addEventListener('mousedown', move)
}


const item_top = items[0].getBoundingClientRect().top;
const item_left = items[0].getBoundingClientRect().left;


/* /// GENERATE /// */

function generateNewItem(e){

    let rect = e.target.getBoundingClientRect()

    if(rect.top == item_top && rect.left == item_left){

        let item = document.createElement("div")
        item.classList.add("item", "movable")
        let r = Math.floor(255 * Math.random())
        let g = Math.floor(255 * Math.random())
        let b = Math.floor(255 * Math.random())
        item.style.background = "rgb(" + r + "," + g + "," + b + ")"
        item.style.borderRadius = Math.floor(100 * Math.random()) + "px"

        let resizer1 = document.createElement("div")
        resizer1.classList.add("resizer", "nw")
        let resizer2 = document.createElement("div")
        resizer2.classList.add("resizer", "ne")
        let resizer3 = document.createElement("div")
        resizer3.classList.add("resizer", "sw")
        let resizer4 = document.createElement("div")
        resizer4.classList.add("resizer", "se")

        resizer1.addEventListener('mousedown', resize)
        resizer2.addEventListener('mousedown', resize)
        resizer3.addEventListener('mousedown', resize)
        resizer4.addEventListener('mousedown', resize)

        item.appendChild(resizer1)
        item.appendChild(resizer2)
        item.appendChild(resizer3)
        item.appendChild(resizer4)


        let expander1 = document.createElement("div")
        expander1.classList.add("expander", "vertical", "top")
        let expander2 = document.createElement("div")
        expander2.classList.add("expander", "vertical", "bottom")
        let expander3 = document.createElement("div")
        expander3.classList.add("expander", "horizontal", "right")
        let expander4 = document.createElement("div")
        expander4.classList.add("expander", "horizontal", "left")

        expander1.addEventListener('mousedown', expand)
        expander2.addEventListener('mousedown', expand)
        expander3.addEventListener('mousedown', expand)
        expander4.addEventListener('mousedown', expand)

        item.appendChild(expander1)
        item.appendChild(expander2)
        item.appendChild(expander3)
        item.appendChild(expander4)

        item.addEventListener('mousedown', generateNewItem)
        item.addEventListener('mousedown', move);
        document.querySelector(".items").appendChild(item)
    }
}



/* /// MOVE /// */

function move(e){
    if (!isResizing && !isExpanding && !isCtrlDown) window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', stopMove)

    let x = e.clientX
    let y = e.clientY

    let item = e.target


    function mouseMove(e){
        let distanceX = x - e.clientX
        let distanceY = y - e.clientY

        const rect = item.getBoundingClientRect();
        item.style.left = rect.left - distanceX + "px"
        item.style.top = rect.top - distanceY + "px"

        x = e.clientX
        y = e.clientY
    }

    function stopMove(){
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', stopMove)
    }
}


/* /// RESIZE /// */

const resizers = document.querySelectorAll(".resizer")
for(let resizer of resizers){
    resizer.addEventListener('mousedown', resize)
}

function resize(e){
    isResizing = true;
    window.addEventListener('mousemove', mouseResize)
    window.addEventListener('mouseup', stopResize)
    window.addEventListener('keydown', ctrlDown)
    window.addEventListener('keyup', ctrlUp)

    let currentResizer = e.target
    let item = currentResizer.parentElement

    let x = e.clientX
    let y = e.clientY
    
    function mouseResize(e){

        const rect = item.getBoundingClientRect();

        let distanceX = x - e.clientX
        let distanceY = y - e.clientY

        if(currentResizer.classList.contains('se')){
            expandSE()
            setSidesAndXY("vertical", item)
            setSidesAndXY("horizontal", item)
        }else if(currentResizer.classList.contains('sw')){
            expandSW()
            setSidesAndXY("vertical", item)
            setSidesAndXY("horizontal", item)
        }else if(currentResizer.classList.contains('ne')){
            expandNE()
            setSidesAndXY("vertical", item)
            setSidesAndXY("horizontal", item)
        }else if(currentResizer.classList.contains('nw')){
            expandNW()
            setSidesAndXY("vertical", item)
            setSidesAndXY("horizontal", item)
        }



        function expandSE(){
            if(!isCtrlDown){
                console.log("r");
                item.style.width = rect.width - distanceX + "px"
                item.style.height =  rect.height - distanceY + "px"
            } else {
                let proportion = rect.height / rect.width
                item.style.width = rect.width - distanceX + "px"
                item.style.height =  proportion * (rect.width - distanceX) + "px"
            }
            
        }
        function expandSW(){
            if(!isCtrlDown){
                console.log("r");
                item.style.left = rect.left - distanceX + "px"
                item.style.width = rect.width + distanceX + "px"
                item.style.height =  rect.height - distanceY + "px"
            } else {
                let proportion = rect.height / rect.width
                item.style.width = rect.width + distanceX + "px"
                item.style.height =  proportion * (rect.width + distanceX) + "px"
                item.style.left = rect.left - (distanceX) + "px" //minusz uj w - w
            }
        }
        function expandNE(){
            if(!isCtrlDown){
                console.log("r");
                item.style.top = rect.top - distanceY + "px"
                item.style.width = rect.width - distanceX + "px"
                item.style.height =  rect.height + distanceY + "px"
            } else {
                let proportion = rect.height / rect.width
                item.style.width = rect.width - distanceX + "px"
                item.style.height =  proportion * (rect.width - distanceX) + "px"
                item.style.top = rect.top - ((proportion * (rect.width - distanceX)) - rect.height) + "px"
            }

        }
        function expandNW(){
            if(!isCtrlDown){
                console.log("r");
                item.style.top = rect.top - distanceY + "px"
                item.style.left = rect.left - distanceX + "px"
                item.style.width = rect.width + distanceX + "px"
                item.style.height =  rect.height + distanceY + "px"
            } else {
                let proportion = rect.height / rect.width
                item.style.width = rect.width + distanceX + "px"
                item.style.height =  proportion * (rect.width + distanceX) + "px"
                item.style.top = rect.top + ((proportion * (rect.width - distanceX)) - rect.height) + "px"
                item.style.left = rect.left - (distanceX) + "px"
            }

        }

        x = e.clientX
        y = e.clientY
        
    }

    function ctrlDown(e){
        if(e.code === "ControlLeft" || e.code === "ControlRight"){
            isCtrlDown = true
        }
    }

    function ctrlUp(e){
        if(e.code === "ControlLeft" || e.code === "ControlRight"){
            isCtrlDown = false
        }
    }


    function stopResize(){
        isResizing = false;
        isCtrlDown = false;
        window.removeEventListener('mousemove', mouseResize)
        window.removeEventListener('mouseup', stopResize)
        window.removeEventListener('keydown', ctrlDown)
        window.removeEventListener('keyup', ctrlUp)
    }
}



/* /// SIDE - EXPAND /// */

const expanders = document.querySelectorAll(".expander")
for(let expander of expanders){
    expander.addEventListener('mousedown', expand)
}

function expand(e){
    isExpanding = true;
    window.addEventListener('mousemove', mouseExpand)
    window.addEventListener('mouseup', stopExpand)

    let currentExpander = e.target
    let parent = currentExpander.parentElement
    let limit = 25

    let x = e.clientX
    let y = e.clientY

    function mouseExpand(e){
        const rect = parent.getBoundingClientRect();

        let distanceX = x - e.clientX
        let distanceY = y - e.clientY

        if(currentExpander.classList.contains('left')){
            expandLeft()
        }else if(currentExpander.classList.contains('right')){
            expandRight()
        }else if(currentExpander.classList.contains('top')){
            expandTop()
        }else if(currentExpander.classList.contains('bottom')){
            expandBottom()
        }

        function expandLeft(){
            if (distanceX < limit*-1){
                parent.style.left = rect.left + limit + "px"
                parent.style.width = rect.width - limit + "px"
            }else if(distanceX > limit){
                parent.style.left = rect.left - limit + "px"
                parent.style.width = rect.width + limit + "px"
            }
            if(distanceX < limit*-1 || distanceX > limit){
                setSidesAndXY("horizontal", parent)
                x = e.clientX
                y = e.clientY
            }
        }
        function expandRight(){
            if (distanceX < limit*-1){
                parent.style.width = rect.width + limit + "px"
            }else if(distanceX > limit){
                parent.style.width = rect.width - limit + "px"
            }
            if(distanceX < limit*-1 || distanceX > limit){
                setSidesAndXY("horizontal", parent)
                x = e.clientX
                y = e.clientY
            }
        }
        function expandTop(){
            if (distanceY < limit*-1){
                parent.style.top = rect.top + limit + "px"
                parent.style.height = rect.height - limit + "px"
            }else if(distanceY > limit){
                parent.style.top = rect.top - limit + "px"
                parent.style.height = rect.height + limit + "px"
            }
            if(distanceY < limit*-1 || distanceY > limit){
                setSidesAndXY("vertical", parent)
                x = e.clientX
                y = e.clientY
            }
        }
        function expandBottom(){
            if (distanceY < limit*-1){
                parent.style.height = rect.height + limit + "px"
            }else if(distanceY > limit){
                parent.style.height = rect.height - limit + "px"
            }
            if(distanceY < limit*-1 || distanceY > limit){
                setSidesAndXY("vertical", parent)
                x = e.clientX
                y = e.clientY
            }
        }

    }

    function stopExpand(){
        isExpanding = false;
        window.removeEventListener('mousemove', mouseExpand)
        window.removeEventListener('mouseup', stopExpand)
    }
}


function setSidesAndXY(s, parent, x, y){
    let top = parent.querySelector(".expander.top")
    let bottom = parent.querySelector(".expander.bottom")
    let left = parent.querySelector(".expander.left")
    let right = parent.querySelector(".expander.right")

    if(s == "vertical"){
        left.style.height = parent.style.height
        right.style.height = parent.style.height
    }else if(s == "horizontal"){
        top.style.width = parent.style.width
        bottom.style.width = parent.style.width
    }
} 

/*
        function expandTop(){
            parent.style.top = rect.top - distanceY + "px"
            parent.style.height = rect.height + distanceY + "px"
            for(let s of siblings){
                if(s.classList.contains('left') || s.classList.contains("right")) s.style.height = parent.style.height + "px"
            }
            x = e.clientX
            y = e.clientY
        }
        function expandBottom(){
            parent.style.height = rect.height - distanceY + "px"
            for(let s of siblings){
                if(s.classList.contains('left') || s.classList.contains("right")) s.style.height = parent.style.height + "px"
            }
            x = e.clientX
            y = e.clientY
        }
*/