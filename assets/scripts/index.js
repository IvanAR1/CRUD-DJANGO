import {Sign} from "./auth/Sign"
import { Tasks } from "./tasks/Tasks"
import Alpine from "alpinejs"
import "bootstrap"

window.Alpine = Alpine
Alpine.start()

window.Sign = Sign
window.Tasks = Tasks

$(()=>{
    $(".clickable-row").on("click", function() {
        window.location = $(this).data("href");
    });
})