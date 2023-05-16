function Helloworld(){
    alert("Helloworld");
}

function inputTextNoCPR(){
    let inputText = document.getElementById("input-text").value;
    const CPRpattern = /\d{10}|\d{6}-\d{4}/;
    while (CPRpattern.test(inputText)){
        const outputTextNoCPR = inputText.replace(CPRpattern, "XXXXXX-XXXX");
        inputText = outputTextNoCPR;
    }
    return inputText;
}

// Kør localStorage.setItem("openAI", "YOUR_OPENAI_API_KEY"); i developer consolen for at sætte API-keyen
/*  const API_KEY = localStorage.getItem("openAI"); */


async function chatGPT_API_Completions() {
    //Cache DOM elements to avoid unnecessary DOM traversals
    let responseElem = document.getElementById("output-area")
    let inputText = inputTextNoCPR()
    responseElem.innerText = "Working..."

    try {
        const response = await fetch("/gpt3_5/completion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ record: inputText }),
        });
        const data = await response.json()
        if (response.status !== 200) {
            throw data.error || new Error(`Request failled with status ${response.status}`)
        }
        
        typeSentence(createResponse(data.result), responseElem, data, true);
    } catch (error) {
            console.error(error);
            alert(error.message);
    }          
}





function removePeriod(json) {
    json.forEach(function (element, index) {
        if (element === ".") {
            json.splice(index, 1);
        }
    });
    return json;
}

function createResponse(json) {
    let response = "";
    let choices = removePeriod(json.choices);
    if (choices.length > 0) {
        response = json.choices[0].message.content
    }

    return response;
}

async function typeSentence(sentence, elementReference, data, delay = 30) {
    elementReference.innerText = "";
    if (sentence === "HTTP ERROR: 401") {
        sentence += " — Please make sure that your Open AI API Key has been set properly.";
    }
    const letters = sentence.split("");
    let i = 0;
    while (i < letters.length) {
        await waitForMs(delay);
        elementReference.append(letters[i]);
        i++
    }
    return;
}

function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


