const url="https://tarmeezacademy.com/api/v1/"
let cruntpage =1
let lastpage =1
let numofposts=false
userid=null
setup_ui()
function getposts(page=1) { 
    loader(true)
    axios
    .get(url+`posts?limit=6&page=${page}`)
    .then(function (response) {
        loader(false)
        lastpage = response.data.meta.last_page
    for (let res of response.data.data) {
        let post_titl = res.title;
        if (post_titl == null) {
            post_titl = "";
        }
        getcurentuser()
        let ismypost= userid != null && res.author.id == userid
        let buttonedit=``
        let delitbutton=``
        if(ismypost){
            buttonedit=`<button class="btn btn-secondary " style="float: right" onclick="editpost('${encodeURIComponent(JSON.stringify(res))}')" >edit</button>`
            delitbutton=`<button class="btn btn-danger mx-3 " style="float: right" onclick="delitpost('${encodeURIComponent(JSON.stringify(res))}')" >delit</button>`
        }
        // console.log(string)
        document.getElementById("posts").innerHTML += `
            <div class="card shadow my-4" >
                        <div  class="card-header" >
                        <span style="cursor:pointer;" onclick="profileclick(${res.author.id})">
                            <img  src="${res.author.profile_image}" alt="" style="width: 40px;height: 40px;" class="rounded-circle border border-2">
                            <b>${res.author.username}  </b>
                        </span>
                            
                            
                            ${buttonedit}
                            ${delitbutton}
                        </div>
                        <div class="card-body" style="cursor:pointer;" onclick="showpost(${res.id})" >
                            <img  src="${res.image}" class="w-100 h" >
                            <h6 class="mt1" style="color: gray;">${res.created_at}</h6>
                            <h4>${post_titl}</h4>
                            <p>
                                ${res.body}
                            </p>
                            <hr>
                            <div>
                                <i class="bi bi-pen"></i>
                                <span>
                                    (${res.comments_count})comments
                                </span>
                                <span class="tag-${res.id}">
                                
                                </span>
                            </div>
                            
                        </div>
                    </div>
            `;
            setTimeout(() => {
                numofposts=true
            }, "2000");
                
            let tagsdiv=document.getElementsByClassName(`tag-${res.id}`).innerHTML=""
            for(tag of res.tags){
                let content=` <button class=" btn btn-sm rounded-5" style="background-color:gray;
                color:#fff;" >${tag.name}</button>`

                tagsdiv.innerHTML+=content
            }

    }
    })
    .catch(function (error) {
        
        let ms=error.message

        console.log(ms)
        loader(false)
    });
}
getposts()
function loginbutton() {
    const username = document.getElementById("Usernameinput").value;
    const password = document.getElementById("passwordinput").value;
    
    loader(true)
    axios.post(url+'login', {
        "username" : username,
        "password" : password
    })
    .then(function (response) {
        loader(false)
        
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user) )

        let modal = document.getElementById("loginmodal")
        bootstrap.Modal.getInstance(modal).hide()
        show_success_alert("login seccess",'success')
        setup_ui()
        refresh()
    })
    .catch(function (error) {
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
        loader(false)
    });
    
}
function registerbutton(){
    const username = document.getElementById("register-username-input").value;
    const password = document.getElementById("register-password-input").value;
    const name = document.getElementById("register-name-input").value;
    const profil = document.getElementById("profil-input").files[0];
    

    let formdata = new FormData()
    formdata.append("username",username)
    formdata.append("password",password)
    formdata.append("name",name)
    formdata.append("image",profil)

    axios.post(url+'register', formdata
        )
    .then(function (response) {
    
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user) )

        let modal = document.getElementById("registermodal")
        bootstrap.Modal.getInstance(modal).hide()
        show_success_alert("Register seccess",'success')
        setup_ui()
        refresh()
    })
    .catch(function (error) {
        
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
    });
}
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    show_success_alert("logaut don","danger")
    setup_ui()
    refresh()
}
function show_success_alert(msg,whatfor){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const alerth = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div id="ale" class="  alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

    alerth (msg, whatfor)
    
    
}
function setup_ui(){

    const token = localStorage.getItem("token")
    const login_div=document.getElementById("login_div")
    const logout_btn=document.getElementById("logout_div")
    const creatbutton=document.getElementById("creat-post")

    if(token == null){

        login_div.classList.remove("d-none")
        logout_btn.classList.add("d-none")
        creatbutton.classList.add("d-none")

    }else{
        
        login_div.classList.add("d-none")
        logout_btn.classList.remove("d-none")
        creatbutton.classList.remove("d-none")
        getcurentuser()   
    }
}
// GET USER and profil photo
function getcurentuser(){
    
    let stotgeuser = localStorage.getItem("user")
    
    if(stotgeuser == null){

    }else{
        user = JSON.parse(stotgeuser)
        
        document.getElementById("username-profil").innerHTML=user.username
        document.getElementById("profilimage").src=user.profile_image
        userid=user.id
        
    }
}
// creat post
function createpostsclick(){
    const title = document.getElementById("title-input").value;
    const body = document.getElementById("body-input").value;
    const imag = document.getElementById("imag-input").files[0];
    let postid=document.getElementById("post-id").value;
    
    let iscreate = postid==null || postid==""
    
    

    let formdata = new FormData()
    formdata.append("title",title)
    formdata.append("body",body)
    formdata.append("image",imag)
    let urll=""
    let method=""
    if(iscreate){
        urll=url+'posts'
        
    }else{
        urll=url+"posts/"+postid
        formdata.append("_method","put")
    }
    loader(true)
    axios.post(urll, formdata,
        {
        headers:{
            "authorization":`Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(function (response) {
    loader(false)
        
        let modal = document.getElementById("creatpost")
        bootstrap.Modal.getInstance(modal).hide()
        show_success_alert("create post seccess",'success')
        refresh()
        
    })
    .catch(function (error) {
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
        loader(false)

    });

    
}
// refrish 
function refresh(){

    setTimeout(function () { 
        location.reload();
        },1000);
}
// infint scroll

window.addEventListener("scroll",()=>{
    let endofpage = window.scrollY + window.innerHeight +1 >= ((document.documentElement.scrollHeight)-500)
    
    if(endofpage && cruntpage <= lastpage && numofposts ){
        cruntpage = cruntpage+1
        getposts(cruntpage)
        numofposts=false
    }
    
})


// show post

function showpost(id){
    
    window.location=`post.html?id=${id}`
}


// edit post
function editpost(postobj){
    const post =JSON.parse(decodeURIComponent(postobj))
    
    document.getElementById("body-input").value=post.body
    document.getElementById("title-input").value=post.title
    document.getElementById("post-id").value = post.id
    document.getElementById("title-model").innerHTML="Edit post"
    document.getElementById("model-button").innerHTML="Edit"
    let postmodal=new bootstrap.Modal(document.getElementById("creatpost"),{})
    postmodal.toggle()
}
function creatpostbutton(){
    
    
    document.getElementById("body-input").value=""
    document.getElementById("title-input").value=""
    document.getElementById("post-id").value = ""
    document.getElementById("title-model").innerHTML="Creat A new  post"
    document.getElementById("model-button").innerHTML="Creat"
    let postmodal=new bootstrap.Modal(document.getElementById("creatpost"),{})
    postmodal.toggle()
}

// delit post
function delitpost(postobj){
    const post =JSON.parse(decodeURIComponent(postobj))
    document.getElementById("delet-post-id").value=post.id
    let postmodal=new bootstrap.Modal(document.getElementById("delit-modal"),{})
    postmodal.toggle()
    
    
    
}

function deletepost(){

    const postid =document.getElementById("delet-post-id").value
    loader(true)
    
    axios.delete(`${url}posts/${postid}`,
    
    {
        headers:{
            "authorization":`Bearer ${localStorage.getItem("token")}`
        }
    }
    
    )
    
    
    .then(response => {
        show_success_alert("Delet success","danger")
        refresh()
        loader(false)

    })
    .catch(error => {
        console.error(error);
        loader(false)
    });
}

function profileclick(id){
    window.location=`profile.html?id=${id}`
}

document.getElementById("profilpage").addEventListener("click",()=>{
    let stotgeuser = localStorage.getItem("user")
    let id = null
    if(stotgeuser == null){

    }else{
        user = JSON.parse(stotgeuser)
        id=user.id
    }
    profileclick(id)
})



function loader(lo=false){
    
    if(lo){
        document.getElementById("loader").style.visibility="visible"
    }else{
        document.getElementById("loader").style.visibility="hidden"

    }
}