let num = 0;
let equations;
let joke;
let punchline;
let int = 0;

function start(){
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("solve").style.display = "block";

    fetch("/start")

    .then(response=>{
        if(!response.ok){
            console.log("response not ok");
        }else{
            console.log("topkasa check");
            return response.json();
        }
    })

    .then(data=>{
        if(data.message == "euge"){
            console.log("bottomrui check");
            equations = data.data;
            joke = equations[0];
            joke = joke[0];
            type();
        }else{
            console.log("eheu!!!");
        }
    })

    .catch(err=>{
        console.log("Error: ", err);
    })
}

function redirectSolve(){
    if(window.location.pathname.includes("/redo")){
        window.location.pathname = window.location.pathname.replace("/redo", "/solve");
    }else{
        window.location.pathname += "solve";
    }
}

function initialSetup(equationsReceived){
    equations = equationsReceived;
    joke = equations[0][0];
    type();
    punchline = equations[0][1];
    if(punchline.length%2!=0){
        punchline+="!";
    }
    equations.splice(0, 1);
    equationDisplay();

}

function type(){
    if(int < joke.length+1){
        document.getElementById("joke").innerText = joke.substring(0, int);
        int++;
        setTimeout(type, 25);
    }
}

let solution;

function equationDisplay(){
    document.getElementById("problemNo").innerText = `Problem ${num+1}`;
    document.getElementById("answer").value = "";
    document.getElementById("correctDisp").innerText = "";
    document.getElementById("nextbtn").style.display = "none";
    document.getElementById("infoDiv").style.display = "block";
    let equation = equations[num][0];

    let line1 = document.getElementById("line1");
    let line2 = document.getElementById("line2");
    let line3 = document.getElementById("line3");

    line1.innerText = "";
    line2.innerText = "";
    line3.innerText = "";
    //─
    equation = equation.split(" ");
    for(let i = 0; i < equation.length; i++){
        if(equation[i].includes("/")){
            let fraction = equation[i].split("/");
            let max = 0;
            if(fraction[1].length != 0){
                if(fraction[0].length > fraction[1].length){
                    max = fraction[0].length;
                    while(fraction[1].length <= fraction[0].length){
                        fraction[1] += " ";
                        fraction[1] = " " + fraction[1];
                    }
                    if(fraction[1].length > fraction[0].length){
                        fraction[0] += " ";
                    }
                }else{
                    max = fraction[1].length;
                    while(fraction[0].length <= fraction[1].length){
                        fraction[0] += " ";
                        fraction[0] = " " + fraction[0];
                    }
                    if(fraction[0].length > fraction[1].length){
                        fraction[1] += " ";
                    }
                }
                for(let j = 0; j < max; j++){
                    if(fraction[0][j] == " "){
                        line1.appendChild(document.createTextNode('\u00A0'));
                    }else{
                        line1.innerText += fraction[0][j];
                    }
                    line2.innerText += "-";   
                    if(fraction[1][j] == " "){
                        line3.appendChild(document.createTextNode('\u00A0'));
                    }else{
                        line3.innerText += fraction[1][j];
                    }
                }
            }else{
                for(let j = 0; j < equation[i].length-1; j++){
                    if(equation[i][j] == "+" || equation[i][j] == "*"){
                        line2.appendChild(document.createTextNode('\u00A0'));
                        line2.appendChild(document.createTextNode('\u00A0'));
                        line2.innerText += equation[i][j];
                        line2.appendChild(document.createTextNode('\u00A0'));
                        line2.appendChild(document.createTextNode('\u00A0'));
                        if(equation[i][j] == "*"){
                            for(let k = 0; k < 6; k++){
                                line1.appendChild(document.createTextNode('\u00A0'));
                            }
                            
                            for(let k = 0; k < 6; k++){
                                line3.appendChild(document.createTextNode('\u00A0'));
                            }
                        }else{
                            for(let k = 0; k < 4; k++){
                                line1.appendChild(document.createTextNode('\u00A0'));
                            }
                            
                            for(let k = 0; k < 4; k++){
                                line3.appendChild(document.createTextNode('\u00A0'));
                            }
                        }
                    }else{
                        line2.innerText += equation[i][j];
                        for(let k = 0; k < 3; k++){
                            line1.appendChild(document.createTextNode('\u00A0'));
                        }
                        
                        for(let k = 0; k < 3; k++){
                            line3.appendChild(document.createTextNode('\u00A0'));
                        }
                    }
                }
            }

        }else{
            for(let j = 0; j < equation[i].length; j++){
                if(equation[i][j] == "+" || equation[i][j] == "*"){
                    line2.appendChild(document.createTextNode('\u00A0'));
                    line2.appendChild(document.createTextNode('\u00A0'));
                    line2.innerText += equation[i][j];
                    line2.appendChild(document.createTextNode('\u00A0'));
                    line2.appendChild(document.createTextNode('\u00A0'));
                    if(equation[i][j] == "*"){
                        for(let k = 0; k < 6; k++){
                            line1.appendChild(document.createTextNode('\u00A0'));
                        }
                        
                        for(let k = 0; k < 6; k++){
                            line3.appendChild(document.createTextNode('\u00A0'));
                        }
                    }else{
                        for(let k = 0; k < 4; k++){
                            line1.appendChild(document.createTextNode('\u00A0'));
                        }
                        
                        for(let k = 0; k < 4; k++){
                            line3.appendChild(document.createTextNode('\u00A0'));
                        }
                    }
                }else{
                    line2.innerText += equation[i][j];
                    for(let k = 0; k < 3; k++){
                        line1.appendChild(document.createTextNode('\u00A0'));
                    }
                    
                    for(let k = 0; k < 3; k++){
                        line3.appendChild(document.createTextNode('\u00A0'));
                    }
                }
            }
        }
    }
    solution = equations[num][1];
    num+=1;
}

function insert(char){
    document.getElementById("answer").value += char;
}

function checkAnswer(){
    let userAnswer = document.getElementById("answer").value.replaceAll(" ", "");
    solution = solution.replaceAll(" ", "");
    if(userAnswer == solution){
        document.getElementById("correctDisp").innerText = "Correct!";
        document.getElementById("correctDisp").style.color = "#B4F1B7";
        document.getElementById("nextbtn").style.display = "block";
        document.getElementById("infoDiv").style.display = "none";
        if(num!=0){
            if(punchline[(num*2)-2] == " "){
                document.getElementById("punchline").appendChild(document.createTextNode('\u00A0'));
                punchline = punchline.slice(0, (num*2)-2) + punchline.slice((num*2)-1);
            }
            document.getElementById("punchline").innerText += punchline[(num*2)-2];

            if(punchline[(num*2)-1] == " "){
                document.getElementById("punchline").appendChild(document.createTextNode('\u00A0'));
                punchline = punchline.slice(0, (num*2)-1) + punchline.slice((num*2));
            }
            document.getElementById("punchline").innerText += punchline[(num*2)-1];
        }

        if(num == equations.length){
            document.getElementById("congrats").innerText = "You finished! Yippee!";
            document.getElementById("regen").style.display = "block";
        }else{
            document.getElementById("nextbtn").style.display = "block";
        }
    }else{
        document.getElementById("correctDisp").style.color = "#f57a7a";
        document.getElementById("correctDisp").innerText = "Incorrect :( Try again!";
    }
}

function reGen(){
    window.location.pathname = window.location.pathname.replace("/solve", "/redo");
}