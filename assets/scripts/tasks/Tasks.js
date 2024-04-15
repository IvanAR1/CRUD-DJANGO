import $ from 'jquery';

export class Tasks{
    static Create(){
        const data = this.GetData();
        const csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
        $.ajax({
            url:"/tasks/create/",
            type:"POST",
            data:data,
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

    static Update(id_task){
        const data = this.GetData();
        const csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
        $.ajax({
            url:`/tasks/${id_task}/`,
            type:"PUT",
            data:data,
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

    static GetData(){
        const title = $("#id_title").val();
        const description = $("#id_description").val();
        const importance = $("#id_important").is(":checked") ? "True" : "False";

        return {
            title:title,
            description:description,
            important:importance,
        }
    }

    static Completed(id_task){
        this.CompletedOrDelete(id_task, "completed")
    }

    static Delete(id_task){
        this.CompletedOrDelete(id_task, "delete")
    }

    static CompletedOrDelete(id_task, action){
        const csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
        $.ajax({
            url:`/tasks/${id_task}/${action}`,
            type:(action === "completed") ? "PUT" : "DELETE",
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
}