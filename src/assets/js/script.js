
// login-toggle
// login-toggle

let signuptogglebtn = document.getElementsByClassName('login-toggle');
for(x of signuptogglebtn){
    x.addEventListener('click', () => {
        document.getElementById("login")?.classList.toggle("login-translate-0");
    })
}



// sign-up toggle
// sign-up toggle

let signuptoggle = document.getElementsByClassName('sign-up-toggle');
for(x of signuptoggle){
    x.addEventListener('click', () => {
        document.getElementById("sign-up")?.classList.toggle("sign-up-translate-0");
    })
}





// contact us toggle
// contact us toggle
// contact us toggle


// let contacttogglebtn = document.getElementsByClassName('contact-toggle');
// for(x of contacttogglebtn){
//     x.addEventListener('click', () => {
//         var element = document.getElementById("contact-us");
//         element.classList.toggle("contact-us-translate-0");
//     })
// }



// forgot password toggle
// forgot password toggle
// forgot password toggle



let forgotpasswordbtn = document.getElementsByClassName('forgot-password-toggle');
for(x of forgotpasswordbtn){
    x.addEventListener('click', () => {
        var element = document.getElementById("forgot-password");
        element.classList.toggle("forgot-password-translate-0");
    })
}


document.getElementById('reset-linkk-toggle')?.addEventListener('click', () => {
    var element = document.getElementById("reset-linkk");
    element.classList.toggle("reset-linkk-translate-0");
})



let toggleremovebuttons = document.getElementsByClassName('page-remover');
for(btn of toggleremovebuttons){
    btn.addEventListener('click', () => {
        var loginpage = document.getElementById("login");
        loginpage.classList.remove("login-translate-0");

        document.getElementById("sign-up")?.classList.remove("sign-up-translate-0");

        document.getElementById("forgot-password")?.classList.remove("forgot-password-translate-0");

        document.getElementById("contact-us")?.classList.remove("contact-us-translate-0");

        document.getElementById("reset-linkk")?.classList.remove("reset-linkk-translate-0");
    })
}




    // toggle btn js
    // toggle btn js

    // function dotActive(){
    //     document.getElementById("dot").classList.toggle('active-on-off-btn');
    //     document.getElementById("toggle-btnn").classList.toggle('toggle-btnn-active');
    // }

    let dott = document.getElementsByClassName('dot');
    for(x of dott){
        x.addEventListener('click', () => {
            x.classList.toggle('active-on-off-btn');
            var innerdott = document.getElementsByClassName('toggle-btnn');
            for(y of innerdott){
                y.classList.toggle('toggle-btnn-active');
            }
        })
    }


    // navbar javascript Starts
    // navbar javascript Starts
    // navbar javascript Starts

    function dropdown(){

        document.getElementById("drop-down").classList.toggle('active-drop-down');
    }

    const img =document.getElementById("menu");
    let toggle=true;
    if(img != null){
    img.addEventListener('click', function(){
        toggle=!toggle;
        if (toggle){
            img.src='assets/images/burger-menu.png'
        }
        else{
            img.src='assets/images/cross.png'
        }

    });
  }

    // navbar javascript Ends
    // navbar javascript Ends
    // navbar javascript Ends
