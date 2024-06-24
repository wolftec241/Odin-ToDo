import "./styles/style.css";
import Project from "./classes/Project.js";
import DomController from "./classes/DomController.js";
import { format } from 'date-fns';


init();

const formattedDate = format(new Date(), 'yyyy-MMM-dd');
console.log('Formatted Date:', formattedDate);



function init(){
    const domController = new DomController();


    

    
}



function addNewProject(name){
    return new Project(name);
}
