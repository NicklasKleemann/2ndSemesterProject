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
const API_KEY = localStorage.getItem("openAI");


async function chatGPT_API_Completions() {
    //Cache DOM elements to avoid unnecessary DOM traversals
    let responseElem = document.getElementById("output-area")
    let inputText = inputTextNoCPR()
    responseElem.innerText = "Working..."
    let systemText = `You're a GPT-based bot designed to enhance the readability and comprehensibility of medical records. The bot takes unstructured medical records as input and produces a refined version that is easier to read and understand. The bot's primary goal is to make medical records more accessible and user-friendly, improving patient outcomes and facilitating communication between healthcare providers.`
    let promt = `Write a detailed explanation of the following medical record for uneducated people. This description must also explain medical methods, techniques, operations, or other treatment options and treatment  courses mentioned in the record. Medical Record: "${inputText}". I want the response to be in the same language as the medical record.`

    if (inputText) {
        try {

            const messages = [];

            // add the system message
            const systemMessage = {
            role: "system",
            content: systemText
            };
            if (systemText.length > 0) {
                messages.push(systemMessage);
            }

            // add the user message
            const inputMessage = {
            role: "user",
            content: promt
            };
            if (inputText.length > 0) {
                messages.push(inputMessage);
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + API_KEY,
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    "temperature": 0
                })
            });

            if (!response.ok) {
                console.error("HTTP ERROR: " + response.status + "\n" + response.statusText);
                typeSentence("HTTP ERROR: " + response.status, responseElem);
            } else {
                const data = await response.json();
                typeSentence(createResponse(data), responseElem, data, true);
            }
        } catch (error) {
            console.error("ERROR: " + error);
        }
    }}

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


