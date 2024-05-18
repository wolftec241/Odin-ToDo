import "./styles/style.css";
import "./styles/modeSwitch.css"
import Project from "./classes/Project.js";
import DomController from "./classes/DomController.js";
import { format } from 'date-fns';


init();

const formattedDate = format(new Date(), 'yyyy-MM-dd');
console.log('Formatted Date:', formattedDate);



function init(){
    const Project = addNewProject("Test");
    const domController = new DomController();


    Project.addNewTask('a','b',2);

    domController.hideNavBar();

    domController.changeProject(Project);

    
}


function addNewProject(name){
    return new Project(name);
}
