
document.querySelector(".container").addEventListener('drop', drop)
document.querySelector(".container").addEventListener('dragover', allowDrop)

let draggables = document.querySelectorAll(".draggable")

for(let d of draggables){
    d.addEventListener('dragstart', drag)
}


function drag(e){
    console.log("smthing")
    e.dataTransfer.setData("text/plain", e.target.id);
    e.currentTarget.style.backgroundColor = 'yellow';
}

function allowDrop(e){
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    e.target.appendChild(document.getElementById(id));
    e.dataTransfer.clearData();
  }