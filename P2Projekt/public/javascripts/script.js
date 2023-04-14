function Helloworld(){
    alert("Helloworld");
}

function outputText() {
    const inputText = document.getElementById("input-text").value;
    document.getElementById("output-area").innerText = inputText + " but it has been translated";
}

function TextPromptToAI(prompt) {
    const AIprompt = prompt;
    const inputText = document.getElementById("input-text").value;
    const ToAIText = AIprompt + inputText;

    // add API stuff here    



    //prints the returned text from the API in a textbox on the website
    document.getElementById("output-area").innerText = "whatever the AI/API says/sends back";
}


