//This file contains methods needed on the truss evolution page

function GetInput() { //Gets truss from local storage
    var str = localStorage.getItem('str'); //Gets bitstring
    var nMask = JSON.parse(localStorage.getItem('nMask')); //Gets and parses masks
    var eForces = JSON.parse(localStorage.getItem('eForces')); //Gets and parses external forces
    var mParent = JSON.parse(localStorage.getItem('mParent')); //Gets and parses member parents
    var span = localStorage.getItem('span'); //Gets span
    var material = localStorage.getItem('material'); //Gets material id

    var weights = []; //Creates empty weights array

    weights[0] = parseFloat(localStorage.getItem('dWeight')); //Gets weights from memory
    weights[1] = parseFloat(localStorage.getItem('wWeight')); //Gets weights from memory
    weights[2] = parseFloat(localStorage.getItem('cWeight')); //Gets weights from memory
    weights[3] = parseFloat(localStorage.getItem('hWeight')); //Gets weights from memory


    nMask.splice(0,2); //Removes first two elements from array
    eForces.splice(0,2); //Removes first two elements from array

    Trusses.length = 0; //Clears trusses array
    Trusses[0] = Decode(str,nMask,eForces,mParent,span,weights,material); //Adds inputted truss to array
    Trusses[0].Draw(true,true); //Draws the inputted truss
}

function SaveGraph(property){ //Passes necessary details to create graph function
    var axis = { //Defines an axis object
        x:"Iterations",
        y:"Fitness",
        title:"Progress Over Time"
    }

    switch(property) { //Replaces axis labels depending on user's selection
        case "deformation":
            axis.y = "Deformation (m)";
            CreateGraph(DefData,axis);
            break;
        case "weight":
            axis.y = "Weight (kg)";
            CreateGraph(WeiData,axis);
            break;
        case "cost":
            axis.y = "Cost (£)";
            CreateGraph(CostData,axis);
            break;
        case "height":
            axis.y = "Height (m)";
            CreateGraph(HeightData,axis);
            break;
        default:
            axis.y = "Fitness";
            CreateGraph(FitnessData,axis);
    }
}

function UpdateReportLabels(){ //Updates the HTML report labels controls
    var vals = []; //Gets key values, converts to % change and rounds to nearest %

    if (Trusses[0].bitstring == Trusses[1].bitstring) { //They are the same, 0% change
        vals = new Array(5).fill(0); //Creates a zero array
        vals[4] = Trusses[1].material.name; //Sets correct material name
    }else { //Gets values from top truss
        vals[0] = floor(100*(Trusses[1].totalDef-Trusses[0].totalDef)/Trusses[0].totalDef);
        vals[1] = floor(100*Trusses[1].weight);
        vals[2] = floor(100*Trusses[1].cost);
        vals[3] = floor(100*Trusses[1].deltaH);
        vals[4] = Trusses[1].material.name;
    }
    var controls = document.getElementsByTagName("h11"); //Gets all h11 tags

    for (var i = 0; i < controls.length - 1; i++) { //For each property (not inc material)
        if (vals[i] < 0) { //If decreased, green colour
            controls[i].style.color = "#3D5229";
            controls[i].innerHTML = "";
        }else if (vals[i] == 0) { //If no change, normal colour
            controls[i].style.color = "black";
            controls[i].innerHTML = "";
        }else{ //If increaded, red colour and positive symbol
            controls[i].style.color = "#FE5F55";
            controls[i].innerHTML = "+";
        }
        controls[i].innerHTML += vals[i] + "%"; //Displays value and % symbol
    }
    document.getElementById("Mat_Label").innerHTML = vals[4]; //Displays current material name
}
