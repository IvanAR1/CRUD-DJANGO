import $ from "jquery";
import Swal from "sweetalert2/dist/sweetalert2"

export class Sign{
    static Up(){
        const username = $("#username").val();
        const password = $("#password").val();
        const confirm_password = $("#password_confirm").val();
        const csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
        $.ajax({
            url:"/signup/",
            type:"POST",
            data:{
                username:username,
                password:password,
                confirm_password:confirm_password
            },
            headers:{
                "X-CSRFToken":csrfmiddlewaretoken
            }
        }).then((response)=>{
            try{
                Swal.fire({
                    icon:"success",
                    title:response.message,
                    confirmButtonText: 'Ir a tareas'
                }).then(()=>{
                    window.location.href = "/tasks"
                })
            }
            catch{
                return alert("Error ocurred while parsing response")
            }
        }).fail((error, textStatus, errorThrown)=>{
            console.error(error, textStatus, errorThrown)
            try{
                Swal.fire({
                    icon:"error",
                    text:error.responseJSON.message
                }).then(()=>{
                    if(error.status === 401){
                        window.location.href = "/tasks"
                    }
                })
            }catch{
                return alert("Error ocurred while parsing response")
            }
        })
    }

    static In(){
        let user = $("#username").val();
        let pass = $("#password").val();
        let csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
        $.ajax({
            url:"/login/",
            type:"POST",
            data:{
                username:user,
                password:pass
            },
            headers:{
                "X-CSRFToken":csrfmiddlewaretoken
            }
        }).then((response)=>{
            try{
                Swal.fire({
                    icon:"success",
                    title:response.message,
                    confirmButtonText: 'Ir a tareas'
                }).then(()=>{
                    window.location.href = "/tasks"
                })
            }
            catch{
                return alert(response)
            }
        }).fail((error, textStatus, errorThrown)=>{
            try{
                Swal.fire({
                    icon:"error",
                    title:error.responseJSON.message
                }).then(()=>{
                    if(error.status === 401){
                        window.location.href = "/tasks"
                    }
                })
            }catch{
                return alert("Error ocurred while parsing response")
            }
        }) 
    }

    static Out(){
        let csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
        $.ajax({
            url:"/logout/",
            headers:{
                "X-CSRFToken":csrfmiddlewaretoken
            },
            type:"GET"
        }).then((response)=>{
            try{
                Swal.fire({
                    icon:"success",
                    title:response.message,
                    confirmButtonText: 'Ir a login'
                }).then(()=>{
                    window.location.href = "/login"
                })
            }
            catch{
                return alert(response)
            }
        }).fail((error, textStatus, errorThrown)=>{
            try{
                Swal.fire({
                    icon:"error",
                    title:error.responseJSON.message
                }).then(()=>{
                    if(error.status === 401){
                        window.location.href = "/login"
                    }
                })
            }catch{
                return alert("Error ocurred while parsing response")
            }
        })
    }
}