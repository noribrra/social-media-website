const url="https://tarmeezacademy.com/api/v1/"

function loginbutton() {
    const username = document.getElementById("Usernameinput").value;
    const password = document.getElementById("passwordinput").value;
    
    loader(true)
    axios.post(url+'login', {
        "username" : username,
        "password" : password
    })
    .then(function (response) {
        
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user) )

        let modal = document.getElementById("loginmodal")
        bootstrap.Modal.getInstance(modal).hide()
        show_success_alert("login seccess",'success')
        setup_ui()
        loader(false)
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
    loader(true)
    axios.post(url+'register', formdata
        )
    .then(function (response) {
    
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user) )

        let modal = document.getElementById("registermodal")
        bootstrap.Modal.getInstance(modal).hide()
        show_success_alert("Register seccess",'success')
        setup_ui()
        loader(false)
    })
    .catch(function (error) {
        
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
        loader(false)
    });
}
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    show_success_alert("logaut don","danger")
    setup_ui()
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
function getcurentuser(){
    let user = "nor"
    let stotgeuser = localStorage.getItem("user")
    
    if(stotgeuser == null){

    }else{
        user = JSON.parse(stotgeuser)
        
        document.getElementById("username-profil").innerHTML=user.username
        document.getElementById("profilimage").src=user.profile_image
    }
}
// creat post
function createpostsclick(){
    const title = document.getElementById("title-input").value;
    const body = document.getElementById("body-input").value;
    const imag = document.getElementById("imag-input").files[0];


    let formdata = new FormData()
    formdata.append("title",title)
    formdata.append("body",body)
    formdata.append("image",imag)
    loader(true)
    axios.post(url+'posts', formdata,
        {
        headers:{
            "authorization":`Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(function (response) {
        
        let modal = document.getElementById("creatpost")
        bootstrap.Modal.getInstance(modal).hide()
        loader(false)
        show_success_alert("create post seccess",'success')

        refresh()
        
    })
    .catch(function (error) {
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
        loader(false)
    });
}
// GET USER and profil photo
function getcurentuser(){
    let user = "nor"
    let stotgeuser = localStorage.getItem("user")
    
    if(stotgeuser == null){

    }else{
        user = JSON.parse(stotgeuser)
        
        document.getElementById("username-profil").innerHTML=user.username
        document.getElementById("profilimage").src=user.profile_image
    }
}
function setup_ui(){

    const token = localStorage.getItem("token")
    const login_div=document.getElementById("login_div")
    const logout_btn=document.getElementById("logout_div")
    const creatbutton=document.getElementById("creat-post")
    const addcoment=document.getElementById("addcomment")

    if(token == null){

        login_div.classList.remove("d-none")
        logout_btn.classList.add("d-none")
        creatbutton.classList.add("d-none")
        if(addcoment != null){
            addcoment.classList.add("d-none")
        }
        
        

    }else{
        
        login_div.classList.add("d-none")
        logout_btn.classList.remove("d-none")
        creatbutton.classList.remove("d-none")
        if(addcoment != null){
            addcoment.classList.remove("d-none")
        }
        getcurentuser()   
    }
}
setup_ui()



const urlpram=new URLSearchParams(window.location.search)
const idpost =urlpram.get("id")

function showpost(id){

    loader(true)
    axios.get(`${url}posts/${id}`)
    .then(function (response) {

        loader(false)
        const post=response.data.data

        
        
        document.getElementById("namee").innerHTML=`
        ${post.author.username} post
        `
        document.getElementById("postone").innerHTML=`
        
        <div class=" card shadow my-4" >
                    <div class="card-header">
                        <img src="${post.author.profile_image}" alt="" style="width: 40px;height: 40px;" class="rounded-circle border border-2">
                        <b>${post.author.username} </b>
                    </div>
                    <div class="card-body">
                        <img  src="${post.image}" class="w-100 h" >
                        <h6 class="mt1" style="color: gray;">${post.created_at}</h6>
                        <h4>${post.title}</h4>
                        <p>
                            ${post.body}
                        </p>
                        <hr>
                        <div>
                            <i class="bi bi-pen"></i>
                            <span>
                                (${post.comments_count})comments
                            </span>
                            <span class="tag-${post.id}">
                            
                            </span>
                        </div>


                        <div id="comments">
                        
                        </div>


                    </div>
                    </div>
                </div>

        `
        
        for(com of post.comments ){
            document.getElementById("comments").innerHTML +=`
            
            <div  style="background-color: rgb(241, 240, 240);" class="p-3">
            <div>
                <img src="${com.author.profile_image}" class="rounded-circle " style="width: 40px; height: 40px;" >
                <b>${com.author.username}</b>
            </div>
            <div>
                ${com.body}
            </div>
            
        </div>
            
            `
        }
        document.getElementById("comments").innerHTML +=`
            <div class="input-group mb-3" id="addcomment">
                <input class="form-control" id="inputcomment" type="text" placeholder="add your comment" />
                <button class="btn btn-outline-primary" onclick="addcomment()" >send</button>
            </div>
        `
        
        
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    loader(false)
    })
}
showpost(idpost)
function addcomment(){


    const body = document.getElementById("inputcomment").value
    loader(true)
    axios.post(`${url}posts/${idpost}/comments`, {
        
        body: body,
        
    },
    
    {
        headers:{
            "authorization":`Bearer ${localStorage.getItem("token")}`
        }
    }
    )
    .then(function (response) {
        show_success_alert("add comment success","success")
        loader(false)
        setTimeout(function () { 
            location.reload();
            },1000);
    })
    .catch(function (error) {
        // console.log(error.response.data.message)
        ms=error.response.data.message
        show_success_alert(ms,"danger")
        loader(false)
    });
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
function profileclick(id){
    window.location=`profile.html?id=${id}`
}





function loader(lo=false){
    
    if(lo){
        document.getElementById("loader").style.visibility="visible"
    }else{
        document.getElementById("loader").style.visibility="hidden"

    }
}