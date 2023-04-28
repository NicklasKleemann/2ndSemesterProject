function Helloworld() {
    alert("Helloworld");
}

function inputTextNoCPR() {
    let inputText = document.getElementById("input-text").value;
    const CPRpattern = /\d{10}|\d{6}-\d{4}/;
    while (CPRpattern.test(inputText)) {
        const outputTextNoCPR = inputText.replace(CPRpattern, "XXXXXX-XXXX");
        inputText = outputTextNoCPR;
    }
    return inputText;
    //document.getElementById("output-area").innerText = inputText;

}

function TextPromptToAI(prompt) {
    const AIprompt = prompt;
    const inputText = inputTextNoCPR();
    const ToAIText = AIprompt + inputText;

    // add API stuff here 

    //prints the returned text from the API in a textbox on the website
    document.getElementById("output-area").innerText = inputText; //change this accordingly.
}

document.getElementById("skov").addEventListener("submit", (e) => {
    e.preventDefault();
});


