
let changeImg = document.querySelector(".About")
console.log(changeImg)
let imageArray =["01.jpg","02.jpg","03.webp"]

// setInterval(() => {
//     let rondomImg = Math.floor(Math.random() * imageArray.length);
//     changeImg.style.backgroundImage = 'url("images/'+ imageArray[rondomImg] +'")';
// }, 1000);

let menu = document.querySelector(".content")
let bars = document.querySelector(".burger")
let changeColor = document.querySelectorAll(".burger span")

// let closBtn = document.querySelector(".close")

burger.onclick =() => { 
    menu.classList.toggle("active")
}


let fillters = document.querySelectorAll(".fillter")
let project = document.querySelectorAll(".project")
fillters.forEach((element) => {
    element.onclick= () =>{
        fillters.forEach((filter) => {
            filter.classList.remove("act")
        })
        element.classList.add("act")        
        project.forEach((ele) =>{
            if(ele.dataset.project === element.dataset.filter) {
                ele.style.display="block";
            }else if(element.dataset.filter === "All" ){
                ele.style.display="block";
            }else{
                ele.style.display="none";
            }
        })
    }
});

// let search = document.querySelector('[type="search"]')
// let click = document.querySelector('form button')


// search.oninput = ()=> {
//     project.forEach((ele) =>{
//         if(ele.dataset.project.toLowerCase().includes(search.value.toLowerCase())) {
//             ele.style.display="block";
//         }else{
//             ele.style.display="none";
//     }
//     })
// }
// click.onclick=((e)=>{
//     e.preventDefault()
//     project.forEach((ele) =>{
//         if(search.value === ele.dataset.project){
//             ele.style.display="block";
//         }else{
//             ele.style.display="none";
//         }
//     })
// })
// fillters.forEach((filter) => {
//     filter.onclick = () => {
//         Array.from(project).forEach((project) => {
//             project.style.display = "none"
//         })
//         Array.from(project).filter((x) =>  x.dataset.project == filter.dataset.filter).forEach((project) => {
//             project.style.display = "block"
//         })
//     }
// })

