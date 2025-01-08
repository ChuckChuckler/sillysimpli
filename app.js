import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

let apikey = "put-your-api-key-here";

const genai = new GoogleGenerativeAI(apikey);
const model = genai.getGenerativeModel( {model: "gemini-1.5-flash" });

let data;

app.get("/start", async (req, res) => {
    data = await main();
    res.json({message: "euge", data: data});
    console.log("yEEEOOOWWCCHHH");
});

app.get("/solve", (req, res) => {
    res.render("main", { dataPassed: data });
})

app.get('/', (req, res) => {
    res.render("joke");
});

app.get('/redo', (req, res) => {
    res.render("joke");
})

function randint(max){
    return Math.floor(Math.random()*max);
}


let usedJokes = [];


async function main(){
    let equations = [];

    let joke = await gen(usedJokes);
    usedJokes.push(joke);

    console.log("skibidi my rizz: ", usedJokes);

    let startindex = 0;
    let endindex = 0;
    let setup = joke.split("!SPLIT!")[0];
    let punchline = joke.split("!SPLIT!")[1];
    equations.push([setup, punchline]);

    let punchlineHolder = punchline.toLowerCase().replaceAll(" ", "");
    punchlineHolder = punchlineHolder.replaceAll("!", "");
    punchlineHolder = punchlineHolder.replaceAll(".", "");
    punchlineHolder = punchlineHolder.replaceAll("\n", "");

    
    while(punchlineHolder.length != 0){
        if(punchlineHolder.length >= 2){
            endindex = startindex + 1;
            let chosenVars = punchlineHolder.substring(startindex, endindex+1);
            let problem = await formSolution([chosenVars[0], chosenVars[1]]);
            equations.push(problem);
            punchlineHolder = punchlineHolder.substring(endindex+1);
        }else{
            let coeff1 = randint(5)+2;
            let exponents = ["", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"];
            let expo1 = randint(11);
            let expo1Display = "";
            if(expo1 > 1){
                expo1Display = exponents[expo1-1];
            }else{
                expo1 = 1;
                expo1Display = "";
            }

            let solution = `${coeff1}${punchlineHolder}${expo1Display}`;

            let problem = singleRadical(coeff1, punchlineHolder, "q", expo1, true); 

            equations.push([problem, solution]);

            punchlineHolder = "";
        }
    }

    console.log(equations);
    
    return equations;
}

async function gen(usedJokes){
    console.log("MEOW MEOW WOF: ", usedJokes);


    const prompt = `Generate a dad joke where the punchline is AT LEAST FIVE WORDS LONG and AT MOST SEVEN WORDS LONG. Put the string "!SPLIT!" between the setup and the punchline, like so: "What kind of key doesn't open doors?!SPLIT!A monkey". Essentially, the format is "setup!SPLIT!punchline" with no spaces between the setup and !SPLIT! or between !SPLIT! and the punchline.\
    Do not regenerate the following jokes:\
    ${usedJokes}`;
    
    let response = await model.generateContent(prompt);

    return response.response.text();
}

async function formSolution(letterPair){
    let problems = [];
    let solution;

    let var1 = letterPair[0];
    let var2 = letterPair[1];
    let finalProblem = "";
    let finalProblemA = "";
    let finalProblemB = "";
    let coeff1Display = "";
    let coeff2Display = "";
    //a + b
    let coeff1 = randint(5)+2;

    //determine coefficients
    if(coeff1 > 1){
        coeff1Display = `${coeff1}`;
    }else if(coeff1 <= 1){
        coeff1Display = "";
        coeff1 = 1;
    }
    finalProblemA = `${coeff1Display}${var1}`;

    let coeff2 = randint(coeff1-1)+1;
    if(coeff2 > 1){
        coeff2Display = `${coeff2}`;
    }else if(coeff2 <= 1){
        coeff2Display = "";
        coeff2 = 1;
    }

    finalProblemB = `${coeff2Display}${var2}`;

    //determine exponents
    let exponents = ["²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"];
    let expo1 = randint(11);
    let expo1Display = "";
    if(expo1 > 1){
        expo1Display = exponents[expo1-2];
    }else{
        expo1 = 1;
    }

    finalProblemA = `${coeff1Display}${var1}${expo1Display}`;

    let expo2 = randint(11);
    let expo2Display = "";
    if(expo2 > 1){
        expo2Display = exponents[expo2-2];
    }else{
        expo2 = 1;
    }

    finalProblemB = `${coeff2Display}${var2}${expo2Display}`;

    solution = `${finalProblemA} + ${finalProblemB}`;

    let decision = randint(3);

    if(decision == 0){
        finalProblemA = singleRadical(coeff1, var1, var2, expo1, true);
        finalProblem = `${finalProblemA} + ${finalProblemB}`;
    }else if(decision == 1){
        finalProblemB = singleRadical(coeff2, var2, var1, expo2, true);
        finalProblem = `${finalProblemA} + ${finalProblemB}`;
    }else if(decision == 2){
        finalProblem = doubleRadical(coeff1, coeff2, var1, var2, expo1, expo2);
    }

    return [finalProblem, solution];
}

function singleRadical(coeffNum, var1, var2, expoNum, isSingleVar){
    let part;
    let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let exponents = ["", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰", "¹¹", "¹²", "¹³", "¹⁴", "¹⁵", "¹⁶", "¹⁷", "¹⁸", "¹⁹", "²⁰"];
    alphabet.splice(alphabet.indexOf(var1), 1);

    if(isSingleVar == false){
        alphabet.splice(alphabet.indexOf(var2), 1);
    }

    let coeff3 = randint(7)+2;
    let var3 = alphabet[randint(alphabet.length)];
    let expo3 = randint(10)+1;
    let expo3No2 = expo3*2;
    let expo3Display1 = "";
    let expo3Display2 = "";
    expo3Display2 = exponents[expo3-1];

    part = `√${(coeffNum*coeffNum)*(coeff3*coeff3)}${var1}${exponents[expoNum*2-1]}${var3}${expo3Display1}/${coeff3}${var3}${expo3Display2}`

    expo3Display1 = exponents[expo3No2-1];
    let factors = findFactors((coeff3*coeff3)*(coeffNum*coeffNum), false);
    factors = factors[randint(factors.length-1)];
    let factor1 = factors[0];
    let factor2 = factors[1];
    let var1Expo1 = randint((expoNum*2)-1)+1;
    let var1Expo2 = (expoNum*2)-var1Expo1;
    let var3Expo1 = randint((expo3*2)-1)+1;
    let var3Expo2 = (expo3*2)-var3Expo1;
    let var1Expo1Display = `${exponents[var1Expo1-1]}`;
    let var1Expo2Display = `${exponents[var1Expo2-1]}`;
    let var3Expo1Display = `${exponents[var3Expo1-1]}`;
    let var3Expo2Display = `${exponents[var3Expo2-1]}`;

    let factorDenom1;
    let factorDenom2;

    factors = findFactors(coeff3, false);
    if(factors.length > 0){
        factors = factors[randint(factors.length-1)];
        factorDenom1 = factors[0];
        factorDenom2 = factors[1];
    }else{
        factorDenom1 = coeff3;
        factorDenom2 = "";
    }

    let expoDenom1 = randint(expo3)+1;
    let expoDenom2;
    let expoDenom1Display;
    let expoDenom2Display;
    let varInDenom = true;
    
    if(expoDenom1 == expo3){
        varInDenom = false;
    }else{
        expoDenom2 = expo3-expoDenom1;
        expoDenom2Display = exponents[expoDenom2-1];
    }

    expoDenom1Display = exponents[expoDenom1-1];

    let part1 = "";
    let part2 = "";

    let denom1Or2 = randint(1);

    if(!Number.isInteger(Math.sqrt(factorDenom1)) && factor1%factorDenom1 == 0){
        if(varInDenom == true){
            part1 = `√${factor1/factorDenom1}${var1}${var1Expo1Display}${var3}${var3Expo1Display}/${var3}${expoDenom1Display}√${factorDenom1}`;
        }else{
            if(denom1Or2 == 0){
                part1 = `√${factor1/factorDenom1}${var1}${var1Expo1Display}${var3}${var3Expo1Display}/${var3}${expoDenom1Display}√${factorDenom1}`;
            }else{
                part1 = `√${factor1/factorDenom1}${var1}${var1Expo1Display}${var3}${var3Expo1Display}/√${factorDenom1}`;
            }
        }
    }else{
        if(varInDenom == true){
            part1 = `√${factor1}${var1}${var1Expo1Display}${var3}${var3Expo1Display}/${factorDenom1}${var3}${expoDenom1Display}`;
        }else{
            if(denom1Or2 == 0){
                part1 = `√${factor1}${var1}${var1Expo1Display}${var3}${var3Expo1Display}/${factorDenom1}${var3}${expoDenom1Display}`;
            }else{
                part1 = `√${factor1}${var1}${var1Expo1Display}${var3}${var3Expo1Display}/${expoDenom1Display}`;
            }
        }
    }
    
    if(!Number.isInteger(Math.sqrt(factorDenom2)) && factor2%factorDenom2 == 0){
        if(varInDenom == true){
            part2 = `√${factor2/factorDenom2}${var1}${var1Expo2Display}${var3}${var3Expo2Display}/${var3}${expoDenom2Display}√${factorDenom2}`;
        }else{
            if(denom1Or2 == 1){
                part2 = `√${factor2/factorDenom2}${var1}${var1Expo2Display}${var3}${var3Expo2Display}/${var3}${expoDenom1Display}√${factorDenom2}`;
            }else{
                part2 = `√${factor2/factorDenom2}${var1}${var1Expo2Display}${var3}${var3Expo2Display}/√${factorDenom2}`;
            }
        }
    }else{
        if(varInDenom == true){
            part2 = `√${factor2}${var1}${var1Expo2Display}${var3}${var3Expo2Display}/${factorDenom2}${var3}${expoDenom2Display}`;
        }else{
            if(denom1Or2 == 1){
                part2 = `√${factor2}${var1}${var1Expo2Display}${var3}${var3Expo2Display}/${factorDenom2}${var3}${expoDenom1Display}`;
            }else{
                part2 = `√${factor2}${var1}${var1Expo2Display}${var3}${var3Expo2Display}/${factorDenom2}`;
            }
        }
    }
    
    part = `${part1} * ${part2}`;

    return part;
}

function doubleRadical(coeff1, coeff2, var1, var2, expo1, expo2){
    let final;
    let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let exponents = ["", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰", "¹¹", "¹²", "¹³", "¹⁴", "¹⁵", "¹⁶", "¹⁷", "¹⁸", "¹⁹", "²⁰"];
    alphabet.splice(alphabet.indexOf(var1), 1);
    alphabet.splice(alphabet.indexOf(var2), 1);
    let var3 = alphabet[randint(alphabet.length-1)];
    alphabet.splice(alphabet.indexOf(var3), 1);
    let var4 = alphabet[randint(alphabet.length-1)];
    let coeff3 = randint(7)+2;
    let coeff4 = randint(7)+2;
    let expo3 = randint(10)+1;
    let expo4 = randint(10)+1;
    //final = `√${(coeff1*coeff1)*(coeff3*coeff3)}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3*2)-1]}/${coeff3}${var3}${exponents[expo3-1]} + √${(coeff2*coeff2)*(coeff4*coeff4)}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4*2)-1]}/${coeff4}${var4}${exponents[expo4-1]}`;
    let part1A;
    let part2A;
    let part1B;
    let part2B;
    let radicalized1;
    let radicalized2;
    let innerRadical1Coeff = (coeff1*coeff1)*(coeff3*coeff3);
    let innerRadical2Coeff = (coeff2*coeff2)*(coeff4*coeff4);

    if(innerRadical1Coeff%coeff3 == 0 && !Number.isInteger(Math.sqrt(coeff3))){
        let inOrOut = randint(2);
        if(inOrOut == 0){
            radicalized1 = "1";
            innerRadical1Coeff = innerRadical1Coeff/coeff3;
            part1A = `√${innerRadical1Coeff}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3)-1]}`; 
            part2A = `√${coeff3}${var3}${exponents[expo3-1]}`;
        }else{
            radicalized1 = "2";
            innerRadical1Coeff = innerRadical1Coeff/coeff3;
            part1A = `√${innerRadical1Coeff}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3*2)-1]}`;
            part2A = `${var3}${exponents[expo3-1]}√${coeff3}`;
        }
    }else{
        radicalized1 = "3";
        part1A = `√${innerRadical1Coeff}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3*2)-1]}`;
        part2A = `${coeff3}${var3}${exponents[expo3-1]}`;
    }

    if(innerRadical2Coeff%coeff4 == 0 && !Number.isInteger(Math.sqrt(coeff4))){
        let inOrOut = randint(2);
        if(inOrOut == 0){
            radicalized2 = "1";
            innerRadical2Coeff/=coeff4;
            part1B = `√${innerRadical2Coeff}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4)-1]}`;
            part2B = `√${coeff4}${var4}${exponents[expo4-1]}`;
        }else{
            radicalized2 = "2";
            innerRadical2Coeff/=coeff4;
            part1B = `√${innerRadical2Coeff}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4*2)-1]}`;
            part2B = `${var4}${exponents[expo4-1]}√${coeff4}`;
        }
    }else{
        radicalized2 = "3";
        part1B = `√${innerRadical2Coeff}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4*2)-1]}`;
        part2B = `${coeff4}${var4}${exponents[expo4-1]}`;
    }

    let part1C = "";
    let part2C = "";

    let factorsInRadical = [];
    
    if(innerRadical1Coeff > innerRadical2Coeff){
        if(innerRadical1Coeff%innerRadical2Coeff == 0){
            factorsInRadical = findFactors(innerRadical2Coeff, false);
        }
    }else{
        if(innerRadical2Coeff%innerRadical1Coeff == 0){
            factorsInRadical = findFactors(innerRadical1Coeff, false);
        }
    }

    if(factorsInRadical.length > 0){
        let chosenFactor = factorsInRadical[randint(factorsInRadical.length-1)][0];
        if(radicalized1 == "1"){
            part1A = `√${innerRadical1Coeff/chosenFactor}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3)-1]}`; 
        }else if(radicalized1 == "2"){
            part1A = `√${innerRadical1Coeff/chosenFactor}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3*2)-1]}`;
        }else{
            part1A = `√${innerRadical1Coeff/chosenFactor}${var1}${exponents[(expo1*2)-1]}${var3}${exponents[(expo3*2)-1]}`;
        }
    
        if(radicalized2 == "1"){
            part1B = `√${innerRadical2Coeff/chosenFactor}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4)-1]}`;
        }else if(radicalized2 == "2"){
            part1B = `√${innerRadical2Coeff/chosenFactor}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4*2)-1]}`;
        }else{
            part1B = `√${innerRadical2Coeff/chosenFactor}${var2}${exponents[(expo2*2)-1]}${var4}${exponents[(expo4*2)-1]}`;
        }
    
        part1C = `√${chosenFactor}`;
    }

    final = `${part1C} ( ${part1A}/${part2A} + ${part1B}/${part2B} )`;

    return final;
}

function findFactors(num, coolBool){
    let numMax = 2;
    let factors = [];

    if(coolBool == true){
        while(numMax < num+1){
            if(num%numMax == 0){
                factors.push([numMax, num/numMax]);
            }
            numMax+=1;
        }
    }else{
        while(numMax < num){
            if(num%numMax == 0){
                factors.push([numMax, num/numMax]);
            }
            numMax+=1;
        }
    }

    return factors;
}

app.listen(port, () => {
    console.log('Server listening on port 3000');
  });