# Silly Simplification
A project designed to make practicing simplifying expressions with radicals somewhat bearable by adding a fun part-- with every right answer, you get to reveal more of a super fun cheesy dad joke!
(i am practically failing algebra II)

Honestly this project was a LOT more ambitious than I thought it would be. Lesson learned-- GeminiApi sucks at generating solvable simplification problems. I ended up having to develop an algorithm to form simplify-able expressions by "reverse-solving" them-- coming up with the solution first, then performing operations to generate a matching expression. This algorithm was so painstakingly terrible to make that this project ended up taking me ~16 hours in total, half of which was JUST the algorithm.

Additionally, this was my first time, as a diehard Flask user, using Node.js and Express.

## How to use it

Pretty simple, relatively self-explanatory. Click the big yellow buttons on the screen to navigate to the "solving" page. Solve the equation given on screen and type in the answer in the "Your Answer" box, making sure that you're using the ten boxes underneath for exponents (the way I have the code set up, it will not work if you use the caret symbol.) Once you're confident, click the "Check" button. If incorrect, you'll get a little message and infinite chances to try again. If correct, two more letters will be added to the "punchline" of the joke, slowly revealing more of it as you solve more problems. Once the problem has been completed and the "punchline" revealed, you can click the button to repeat the process with a different joke.

## Running

If you're planning to run this on your own device, download all the files. Make sure you have node.js and npm installed. Run the following commands:
```
npm install express
npm install @google/generative-ai
```
to download the necessary packages.

Then open a terminal and run 
```
node app.js
```
and navigate to localhost:3000. 

Fair warning: the css may not be entirely responsive.
