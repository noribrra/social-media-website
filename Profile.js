const url="https://tarmeezacademy.com/api/v1/"

const urlpram=new URLSearchParams(window.location.search)
const idpost =urlpram.get("id")
userid = 0
function loginbutton() {
    const username = document.getElementById("Usernameinput").value;
    const password = document.getElementById("passwordinput").value;
    

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
    })
    .catch(function (error) {
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
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

// GET USER and profil photo
function getcurentuser(){
    let user = "nor"
    let stotgeuser = localStorage.getItem("user")
    
    if(stotgeuser == null){

    }else{
        user = JSON.parse(stotgeuser)
        userid =user.id
        document.getElementById("username-profil").innerHTML=user.username
        document.getElementById("profilimage").src=user.profile_image

        // profile
        

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
    }else{
        
        login_div.classList.add("d-none")
        logout_btn.classList.remove("d-none")
        getcurentuser()   
    }
}

function showpost(id){
    
    window.location=`post.html?id=${id}`
}
setup_ui()


function get_user(){
    loader(true)
    axios.get(`${url}users/${idpost}`)
    .then((respones)=>{
        const user=respones.data.data
        loader(false)
        document.getElementById("email-profile").innerHTML=user.email
        document.getElementById("name-profile").innerHTML=user.name
        document.getElementById("username-profile").innerHTML=user.username
        document.getElementById("nameofcreatpost").innerHTML=`${user.username}'s posts`
        document.getElementById("post-profile").innerHTML=user.posts_count
        document.getElementById("comments-profile").innerHTML=user.comments_count
        document.getElementById("header_img").src=user.profile_image
    })
}
get_user()
getposts()
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

// get post
function getposts() { 
    const id =1
    loader(true)
    axios
    .get(url+`users/${idpost}/posts`)
    .then(function (response) {
        
        loader(false)
    for (let res of response.data.data) {
        let post_titl = res.title;
        if (post_titl == null) {
            post_titl = "";
        }
        
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
                        <div style="cursor: pointer;" class="card-header">
                            <img src="${res.author.profile_image}" alt="" style="width: 40px;height: 40px;" class="rounded-circle border border-2">
                            <b>${res.author.username} </b>
                            
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
            
    }
    })
    .catch(function (error) {
        
        let ms=error.message

        console.log(error)
        loader(false)
    });
}






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
        loader(false)
        refresh()
    })
    .catch(error => {
        console.error(error);
        loader(false)
    });
}







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
        
        let modal = document.getElementById("creatpost")
        bootstrap.Modal.getInstance(modal).hide()
        show_success_alert("create post seccess",'success')
        loader(false)
        refresh()
        
    })
    .catch(function (error) {
        let ms=error.response.data.message
        show_success_alert(ms,"danger")
        loader(false)
    });

    
}

function refresh(){

    setTimeout(function () { 
        location.reload();
        },1000);
}


function loader(lo=false){
    
    if(lo){
        document.getElementById("loader").style.visibility="visible"
    }else{
        document.getElementById("loader").style.visibility="hidden"

    }
}