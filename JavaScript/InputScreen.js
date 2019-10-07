//This file contains methods needed on the input screen page

function InputTruss() { //Performs an input function based on the current stage
    if (stage == "Nodes") { //If add nodes button is clicked
        if (snap_Cont.checked) { //If snap to grid is checked
            var coords = SnapToGrid(mouseX, mouseY); //Snaps mouse location to grid
            inputTruss.AddNode(coords.x, coords.y); //Adds node
        }else {
            inputTruss.AddNode(mouseX,mouseY);
        }
        DisplayGridLines(); //Draws grid lines/ draws truss
    }
    else if (stage == "Members") { //ids array defined globally in preload() - if add members button is clicked
        ids[ids.length] = FindNearestNode(mouseX,mouseY);
        if (ids.length == 1 || (ids[0] == ids[1])) { //If one node added
            ids.length = 1; //Removes any additional elements if length > 1
            push(); //Saves current drawing settings
            noFill();stroke(255, 0, 0);strokeWeight(3);
            var active = inputTruss.nodes[ids[0]].location;
            ellipse(active.x, active.y, 20, 20); //Circles selected node
            pop(); //restores current drawing settings
        }else if ((ids.length >= 2) && (ids[0] != ids[1])) { //If second node is selected
            inputTruss.AddMember(ids[0],ids[1]); //Adds a member between the two nodes
            ids = [] //Empties array
            DisplayGridLines(); //Draws grid lines/ draws truss
        }
    }
    else if (stage == "Forces") { //If add forces button is clicked
        removeElements(); //Clears any existing HTML controls
        selected = FindNearestNode(mouseX,mouseY);

        var tooltip = createP('Enter to Submit'); //Adds a label
        tooltip.parent('Canvas_Holder');
        tooltip.position(5, height - 18 - tooltip.height);
        tooltip.style('color','white');

        inpY = createInput('YForce'); //Adds txt box
        inpY.parent('Canvas_Holder');
        inpY.position(5,tooltip.y - 7);
        inpY.style('width','54px');
        inpY.elt.addEventListener("keyup", //Listens for the enter key
            function(event){if (event.key == "Enter") {AddForce();}})

        inpX = createInput('XForce'); //Adds txt box
        inpX.parent('Canvas_Holder');
        inpX.position(5,inpY.y - 5 - inpX.height);
        inpX.style('width','54px');
        inpX.elt.addEventListener("keyup", //Listens for the enter key
            function(event){if (event.key == "Enter") {AddForce();}})

        unit = createSelect();
        unit.parent('Canvas_Holder');
        unit.option("Unit");
        unit.option("N"); //Adds values to selection box
        unit.option("kN");
        unit.option("MN");
        unit.option("GN");
        unit.elt.options[0].hidden = true; //Hides the unit selection from view
        unit.position(4,inpX.y - 5 - unit.height);
        unit.style('width','60px');

        var tag = createP('Node: '+ selected) //Adds label
        tag.parent('Canvas_Holder');
        tag.position(8,unit.y - 16 - tag.height);
        tag.style('color','white');
    }
}

function Undo(){ //Undoes the previous action
    if ((stage == 'Nodes') && (inputTruss.nodes.length > 2)
                && (inputTruss.nodes[inputTruss.nodes.length - 1].members.length == 0)) { //Checks if we can add a member
        inputTruss.nodes.splice(inputTruss.nodes.length - 1,1); //Deletes node

    }else if ((stage == 'Members') && (inputTruss.members.length > 0)) {
        var member = inputTruss.members[inputTruss.members.length - 1]; //Gets last member added

        var index1 = member.parent1.members.indexOf(member.id); //Gets index of member in parents' array
        var index2 = member.parent2.members.indexOf(member.id); //Gets index of member in parents' array

        member.parent1.members.splice(index1,1); //Removes member from parent's array
        member.parent2.members.splice(index2,1); //Removes member from parent's array

        inputTruss.members.splice(inputTruss.members.length - 1, 1); //Deletes member

    }else if (stage == 'Forces') {
        inputTruss.nodes[lastForceAdded].externalForce = createVector(0,0); //Removes external force
    }
    DisplayGridLines(); //Redraws
}

function AddForce(){ //Adds an external force
    var multiplier = unit.value(); //Gets control value
    switch (multiplier) { //Converts control value to metric scale
        case "N":
            multiplier = 1;
            break;
        case "kN":
            multiplier = 1000;
            break;
        case "MN":
            multiplier = 1000000;
            break;
        case "GN":
            multiplier = 1000000000;
            break;
        default:
            multiplier = 1;
    }
    var fx = multiplier * inpX.value(); //Gets control value
    var fy = multiplier * inpY.value(); //Gets control value

    if ((parseFloat(fx) == fx) && (parseFloat(fy) == fy) && (selected > 1)) {
        inputTruss.nodes[selected].SetExternalForce(fx,-fy); //-fy to invert direction - sets force
        lastForceAdded = selected; //Updates undo flag
        inpX.value('Done'); //Outputs message
        inpY.value('Done'); //Outputs message
    }
    setTimeout('removeElements()',1000); //Removes HTML controls after 1 second
    DisplayGridLines(); //Redraws
}

function FindNearestNode(mx, my) { //Finds the nearest node to a given point
    var distArray = []; //Creates an empty array
    var pos = createVector(mx, my); //Creating vector so I can use built in dist function
    for (var n in inputTruss.nodes) { //Checks each node
        distArray[n] = p5.Vector.dist(pos, inputTruss.nodes[n].location); //Adds Euclidian distance between mouse and node to array
    }
    var i = distArray.indexOf(min(distArray)); //Finds the index of the smallest value in the array.
    return i; //Returns index of nearest node
}

function UpdateScale() { //Updates the Truss' scale if span changes
    var px = inputTruss.span / inputTruss.scale; //Gets pixel distance
    inputTruss.span = span_Cont.value; //Gets control value
    inputTruss.scale = inputTruss.span / px; //Defines new scale
}

function UpdateMaterial(){ //Updates the Truss's material
    var index = materials.findIndex(function(element){ //Finds the material with the same name as one selected
        return element.name == materials_Cont.value;
    });
    inputTruss.material = materials[index]; //Sets the material
}

function SliderValues(id, val) { //Updates the labels when a slider is moved
    id = id + "_T" //Changes ID to match that of the corresponding text box
    val = parseFloat(val).toFixed(1); //Always 1dp even if integer
    document.getElementById(id).innerHTML = val; //Changes the text value
}

function DisplayGridLines() { //Draws truss/grid lines
    clear(); //Clears the canvas
    inputTruss.Draw(true, true); //Draws truss
    if (lines_Cont.checked) { //If draw grid lines control is checked
        var spacing = parseFloat(spacing_Cont.value) / inputTruss.scale; //Gets grid spacing in px
        stroke(255, 255, 255, 25);
        for (var i = (inputTruss.padding % spacing) - spacing; i < width; i = i + spacing) { //Draws a line every multiple of spacing
            line(i, 0, i, height); //Vertical lines
        }
        for (var i = ((height - inputTruss.padding) % spacing) - spacing; i < height; i = i + spacing) { //Draws a line every multiple of spacing
            line(0, i, width, i); //Horizontal lines
        }
    }
}

function SnapToGrid(x, y) { //Snaps a vector to the grid
    var spacing = parseFloat(spacing_Cont.value) / inputTruss.scale; //Gets grid spacing in px

    var xOff = (inputTruss.padding % spacing) - spacing; //Define offsets to align to grid
    var yOff = ((height - inputTruss.padding) % spacing) - spacing;

    x-=xOff; //Maps to underlying grid
    y-=yOff;

    x = (Math.floor((x + spacing / 2) / spacing) * spacing); //Snaps to the grid
    y = (Math.floor((y + spacing / 2) / spacing) * spacing);

    x+=xOff; //Maps to overlying grid.
    y+=yOff;

    return createVector(x, y); //Returns a vector, as this is intended for node positions
}

function Import() { //Imports a truss from a txt file
    var reader = createFileInput(Callback); //Calls the call-back method when file is loaded
    reader.parent("file"); //Assigns to file h12 tag
    reader.style("display","none"); //Hides the file reader
    reader.elt.click(); //Simulates a click
}

function Callback(file){ //Callback method for use with file reader
    var contents = file.data.split("*"); //Splits data by the '*' char

    for (var i = 1; i < contents.length; i++) { //Misses out bitstring
        contents[i] = JSON.parse(contents[i]); //Parses data
    }
    contents[1].splice(0,2); //Removes null values from front of array
    contents[2].splice(0,2); //Removes null values from front of array

    inputTruss = Decode(contents[0],contents[1],contents[2],contents[3],contents[4],contents[5],contents[6]); //Decodes truss
    PassInput('inputTruss'); //Loads truss into memory
    location.replace("../Pages/Truss_Evolution.html"); //Changes web page
}

function PassInput(choice){ //Stores the truss in local storage to be retrieved on the next page
    var str = '' //Creates an empty string

    if (choice == "defaultTruss") { //If the user has selected a default truss
        var selection = parseInt(document.getElementById('Default_Truss').value);
        inputTruss = new DefaultTruss(selection); //Overrides input truss
    }

    inputTruss.UpdateBitstring(); //Calculates bitstring
    str = inputTruss.bitstring; //Stores bitstring
    nMask = JSON.stringify(inputTruss.nodesMask); //parsed to string
    eForces = JSON.stringify(inputTruss.externalForces); //parsed to a string
    mParent = JSON.stringify(inputTruss.membersParent); //parsed to a string
    span = inputTruss.span; //Stores span

    localStorage.setItem("str",str); //Stored in local storage
    localStorage.setItem("nMask",nMask); //Stored in local storage
    localStorage.setItem("eForces",eForces); //Stored in local storage
    localStorage.setItem("mParent",mParent); //Stored in local storage
    localStorage.setItem("span",span); //Stored in local storage
    localStorage.setItem("material",inputTruss.material.id); //Stored in local storage

    if (inputTruss.weights != null) {
        localStorage.setItem("dWeight",inputTruss.weights[0]); //Gets weight value
        localStorage.setItem("wWeight",inputTruss.weights[1]); //Gets weight value
        localStorage.setItem("cWeight",inputTruss.weights[2]); //Gets weight value
        localStorage.setItem("hWeight",inputTruss.weights[3]); //Gets weight value
    }else {
        localStorage.setItem("dWeight",document.getElementById('Slider_Def').value); //Gets Slider value
        localStorage.setItem("wWeight",document.getElementById('Slider_Wei').value); //Gets Slider value
        localStorage.setItem("cWeight",document.getElementById('Slider_Cos').value); //Gets Slider value
        localStorage.setItem("hWeight",document.getElementById('Slider_Hei').value); //Gets Slider value
    }
}
