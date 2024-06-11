import "./styles/style.css";
import Project from "./classes/Project.js";
import DomController from "./classes/DomController.js";
import { format } from 'date-fns';


init();

const formattedDate = format(new Date(), 'yyyy-MMM-dd');
console.log('Formatted Date:', formattedDate);



function init(){
    const domController = new DomController();

    const Project = addNewProject("Test");
    Project.addNewTask('a','b',2);
    domController.createProjectContainer(Project);

    

    
}



function addNewProject(name){
    return new Project(name);
}
