// Function to populate the dropdown menu with available models
function populateModelDropdown(models) {
    const modelDropdown = document.getElementById('modelDropdown');
    modelDropdown.innerHTML = ''; // Clear existing options

    models.forEach((model, index) => {
        let option = new Option(model.name, index);
        modelDropdown.add(option);
    });

    modelDropdown.addEventListener('change', (event) => {
        generateHTMLFromJSON(models[event.target.value]);
    });
}

function createCodeBlock(codeText) {
    const codeBlock = document.createElement("pre");
    codeBlock.className = "code-block";
    
    // This is where you would add spans with classes for syntax highlighting
    // For a real implementation, you'd want to parse the codeText and wrap syntax parts in spans
    // Here's a simplified static example
    const highlightedCode = codeText
        // .replace(/(def)/g, '<span class="string">$&</span>') // Strings
        // .replace(/(def|class)\b/g, '<span class="keyword">$&</span>') // Keywords
        .replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>') // Strings
        .replace(/#.*/g, '<span class="comment">$&</span>'); // Comments

    codeBlock.innerHTML = highlightedCode;

    return codeBlock;
}

function createBlock(content) {
    const block = document.createElement("pre");
    block.className = "block";
    block.innerHTML = content;
    return block;
}

function createImageTextLine(imagePath, textContent) {
    // Create container div
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    // Create the image element
    const image = new Image();
    image.src = imagePath; // Set the source of your image
    image.alt = 'Descriptive text'; // Set the alt text
    image.style.maxWidth = '50px'; // Or whatever size you prefer
    image.style.height = 'auto'; // Maintain aspect ratio
    image.style.marginRight = '10px'; // Optional space between the image and text
    image.style.marginLeft = '10px'; // Optional space between the image and text
    container.appendChild(image); // Append the image to the container

    // Create the text div
    const textDiv = document.createElement('div');
    const textNode = document.createTextNode(textContent); // Create text node
    textDiv.style.fontSize = '1.2em'; // Set the font size
    textDiv.style.fontFamily = 'Lato';
    textDiv.style.fontWeight = '800'; /* For a bold look in titles */
    textDiv.style.fontWeight = 'True'
    // textDiv.style.verticalAlign= 'top';
    textDiv.appendChild(textNode); // Append the text node to the text div
    container.appendChild(textDiv); // Append the text div to the container

    return container; // Return the complete container
}


function addExperimentDetails(experiment) {
    const element = document.createElement("pre");
    // element.className = "experiment-details";
    // const detailsDiv = document.getElementById("experimentDetails");
    experiment.forEach(item => {
        if (item.role === "assistant") {
            const imageTextLineElement = createImageTextLine('./maia_robot.png', 'MAIA');
            element.appendChild(imageTextLineElement);
            item.content.forEach(content => {
                if (content.type === "text") {
                    if (content.text.startsWith("[CODE]:")) {
                        const codeBlock = document.createElement("pre");
                        codeBlock.className = "code-block";
                        codeBlock.textContent = content.text
                        .replace(/\[CODE\]:/g, '')                 // Removes "[CODE]:"
                        .replace(/```python/g, '')                 // Removes "```python"
                        .replace(/def execute_command\(system, tools\):/g, '')  // Removes "def execute_command(system, tools):"
                        .replace(/```/g, '')                       // Removes "```"
                        .replace(/^\s*[\r\n]/gm, '');              // Removes empty lines
                        // content.text.remove("[CODE]: \n").remove("```python\n").remove("def execute_command(system, tools):\n").remove("```", "").remove('\n\n');
                            // codeBlock.textContent = content.text.replace("[CODE]: \n```python\ndef execute_command(system, tools):\n", "").replace("```", "");
                        // codeBlock.textContent = content.text;
                        const collapsibleCodeBlock = createCollapsibleCodeBlock(codeBlock.textContent);
                        element.appendChild(collapsibleCodeBlock);
                    } else {
                        const textDiv = document.createElement("div");
                        // textDiv.textContent = content.text.replace("[HYPOTHESIS LIST]:", "Hypothesis list:");
                        textDiv.className = "experiment-text";
                        // textDiv.innerHTML = content.text.replace(/\n/g, '<br>').replace("[HYPOTHESIS LIST]:", "<b>Hypothesis list:</b>").replace("[DESCRIPTION]:", "<b>Description:</b>").replace("[LABEL]:", "<b>Label:</b>").replace("image:", "");;
                        textDiv.innerHTML = content.text
                            .replace(/\n/g, '<br>')
                            .replace(/\[HYPOTHESIS LIST\]:/g, "<u>Hypothesis list</u>:")
                            .replace(/\[DESCRIPTION\]:/g, "<u>Description</u>:")
                            .replace(/\[LABEL\]:/g, "<u>Label</u>:")
                            .replace(/image:/g, "");
    
                        element.appendChild(textDiv);
                    }
                } else if (content.type === "image_url") {
                    const image = new Image();
                    image.src = content.image_url;
                    image.className = "experiment-image";
                    element.appendChild(image);
                }
            });
        }
        else if (item.role === "user"){
            const imageTextLineElement = createImageTextLine('./gears.png', 'Experiment Execution');
            element.appendChild(imageTextLineElement);
            // image.src = "https://cdn3.iconfinder.com/data/icons/automobile-icons/439/Gearwheel-512.png";
            
            const table = document.createElement('table');
            table.className = 'content-table'; // Assuming you have CSS for this class

            let row = document.createElement('tr'); // Initialize the first row
            let cellCount = 0; // To keep track of the number of cells in the current row

            for (let i = 0; i < item.content.length - 1; i++) {
                const content = item.content[i];
                const nextContent = item.content[i + 1];

                // Check if the current content is text and the next content is an image
                if (content.type === "text" && nextContent && nextContent.type === "image_url") {
                    const cell = document.createElement('td'); // Create a new cell for this text-image pair

                    // Create and append the text div
                    const textDiv = document.createElement("div");
                    textDiv.className = "exe-text";
                    textDiv.innerHTML = content.text
                        .split('\n')  // Split the text into an array of lines
                        .filter(line => !line.startsWith("Max activation is smaller than"))  // Filter out lines that start with the specific phrase
                        .join('<br>')  // Join the remaining lines back together, using <br> for line breaks in HTML                   
                        .replace(/\n/g, '<br>')
                        .replace(/activation:/g, '<br>activation:')
                        .replace(/\[HYPOTHESIS LIST\]:/g, "<u>Hypothesis list</u>:")
                        .replace(/\[DESCRIPTION\]:/g, "<u>Description</u>:")
                        .replace(/\[LABEL\]:/g, "<u>Label</u>:")
                        .replace(/image:/g, "");
                    cell.appendChild(textDiv);

                    // Create and append the image
                    const image = new Image();
                    image.src = nextContent.image_url;
                    image.className = "experiment-image";
                    cell.appendChild(image);

                    // Add the cell to the current row and increment the cell count
                    row.appendChild(cell);
                    cellCount++;

                    // Move to the next content after the image
                    i++;

                    // If the row has 5 cells or this is the last content pair, append the row to the table and start a new row
                    if (cellCount === 4 || i >= item.content.length - 2) {
                        table.appendChild(row);
                        row = document.createElement('tr'); // Start a new row
                        cellCount = 0; // Reset cell count for the new row
                    }
                } else{
                    table.appendChild(row);
                    const textDiv = document.createElement("div");
                    // textDiv.textContent = content.text.replace("[HYPOTHESIS LIST]:", "Hypothesis list:");
                    textDiv.className = "exe-text";
                    // textDiv.innerHTML = content.text.replace(/\n/g, '<br>').replace("[HYPOTHESIS LIST]:", "<b>Hypothesis list:</b>").replace("[DESCRIPTION]:", "<b>Description:</b>").replace("[LABEL]:", "<b>Label:</b>").replace("image:", "");;
                    textDiv.innerHTML =  content.text
                            .split('\n')  // Split the text into an array of lines
                            .filter(line => !line.startsWith("Max activation is smaller than"))  // Filter out lines that start with the specific phrase
                            .join('<br>')  // Join the remaining lines back together, using <br> for line breaks in HTML                   
                            .replace(/\n/g, '<br>')
                            .replace(/activation:/g, '<br>activation:')
                            .replace(/\[HYPOTHESIS LIST\]:/g, "<u>Hypothesis list</u>:")
                            .replace(/\[DESCRIPTION\]:/g, "<u>Description</u>:")
                            .replace(/\[LABEL\]:/g, "<u>Label</u>:")
                            .replace(/image:/g, "");
                    element.appendChild(textDiv);

                    const textDivNext = document.createElement("div");
                    // textDiv.textContent = content.text.replace("[HYPOTHESIS LIST]:", "Hypothesis list:");
                    textDivNext.className = "exe-text";
                    // textDiv.innerHTML = content.text.replace(/\n/g, '<br>').replace("[HYPOTHESIS LIST]:", "<b>Hypothesis list:</b>").replace("[DESCRIPTION]:", "<b>Description:</b>").replace("[LABEL]:", "<b>Label:</b>").replace("image:", "");;
                    textDiv.innerHTML =  nextContent.text
                            .split('\n')  // Split the text into an array of lines
                            .filter(line => !line.startsWith("Max activation is smaller than"))  // Filter out lines that start with the specific phrase
                            .join('<br>')  // Join the remaining lines back together, using <br> for line breaks in HTML                   
                            .replace(/\n/g, '<br>')
                            .replace(/activation:/g, '<br>activation:')
                            .replace(/\[HYPOTHESIS LIST\]:/g, "<u>Hypothesis list</u>:")
                            .replace(/\[DESCRIPTION\]:/g, "<u>Description</u>:")
                            .replace(/\[LABEL\]:/g, "<u>Label</u>:")
                            .replace(/image:/g, "");
                    element.appendChild(textDivNext);
                }
            }

            // Append the table to the element (make sure 'element' is defined and points to a valid container)
            element.appendChild(table);


            // item.content.forEach(content => {
            //     if (content.type === "text") {
            //         const textDiv = document.createElement("div");
            //         // textDiv.textContent = content.text.replace("[HYPOTHESIS LIST]:", "Hypothesis list:");
            //         textDiv.className = "exe-text";
            //         // textDiv.innerHTML = content.text.replace(/\n/g, '<br>').replace("[HYPOTHESIS LIST]:", "<b>Hypothesis list:</b>").replace("[DESCRIPTION]:", "<b>Description:</b>").replace("[LABEL]:", "<b>Label:</b>").replace("image:", "");;
            //         textDiv.innerHTML = content.text
            //             .replace(/\n/g, '<br>')
            //             .replace(/\[HYPOTHESIS LIST\]:/g, "<u>Hypothesis list</u>:")
            //             .replace(/\[DESCRIPTION\]:/g, "<u>Description</u>:")
            //             .replace(/\[LABEL\]:/g, "<u>Label</u>:")
            //             .replace(/image:/g, "");
            //         element.appendChild(textDiv);
            //     } else if (content.type === "image_url") {
            //         const image = new Image();
            //         image.src = content.image_url;
            //         image.className = "experiment-image";
            //         element.appendChild(image);
            //     }
            // });
        }
    });
    return element
}



function generateHTMLFromJSON(model) {
    const networkContainer = document.getElementById("networkContainer");
    networkContainer.innerHTML = ''; // Clear existing content

    model.layers.forEach((layer, layerIndex) => {
        const layerContainer = document.createElement("div");
        layerContainer.className = "layer-container";
        networkContainer.appendChild(layerContainer);

        const layerTitle = document.createElement("div");
        layerTitle.className = "layer-title";
        // layerTitle.textContent = `Layer ${layerIndex + 1}`;
        layerTitle.textContent = layer.id;
        layerContainer.appendChild(layerTitle);

        const layerDiv = document.createElement("div");
        layerDiv.className = "layer";
        layerContainer.appendChild(layerDiv);
        
        layer.units.forEach((unit, unitIndex) => {
            const unitDiv = document.createElement("div");
            unitDiv.className = "unit";
            unitDiv.setAttribute('data-label', unit.label);
            unitDiv.addEventListener('click', () => showExperimentDetails(unit.experiment, layer.id, unit.id, unit.label, unit.description, unit.intervention, unit.eval));
            // unitDiv.addEventListener('click', () => showExperimentDetails(unit.experiment, layerIndex, unitIndex, unit.label, unit.description, unit.intervention, unit.eval));
            layerDiv.appendChild(unitDiv);
        });

        if (layerIndex < model.layers.length - 1) {
            const arrowDiv = document.createElement("div");
            arrowDiv.className = "arrow";
            arrowDiv.innerHTML = "&#8595;"; // Downward arrow HTML entity
            networkContainer.appendChild(arrowDiv);
        }
    });

    const detailsDiv = document.createElement("div");
    detailsDiv.id = "experimentDetails";
    detailsDiv.className = "experiment-details hidden";
    networkContainer.appendChild(detailsDiv);

    modelDropdown.value = "0"; // Initialize the dropdown to the first model
}


function showExperimentDetails(experiment, layerIndex, unitIndex, label, description, intervention, eval) {
    const detailsDiv = document.getElementById("experimentDetails");
    detailsDiv.className = "experiment-details"
    // detailsDiv.innerHTML = ''; // Clear existing details
    detailsDiv.innerHTML = '<button class="close-button" onclick="closeExperimentDetails()">&times;</button>';


    // Add layer and unit index to the title
    const titleDiv = document.createElement("div");
    titleDiv.className = "experiment-title";
    titleDiv.innerHTML = `
    <img src="./maia_robot.png" alt="MAIA" style="vertical-align: middle;" width="50px">
    <span style="display: inline-block; vertical-align: bottom;"> ${layerIndex}, ${unitIndex}:
    <br>
    <span class="maia-font" style="vertical-align: bottom;">${label}</span>
    </span>
    <br>
`;
    // `Layer ${layerIndex + 1}, Unit ${unitIndex + 1}<br><br>Label: <span class="maia-font">${label}</span><br>`; // Note the use of <br> for the line break
    detailsDiv.appendChild(titleDiv);

    // Add close button functionality
    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "×";
    closeButton.onclick = () => {
        detailsDiv.classList.add("hidden");
    };
    detailsDiv.appendChild(closeButton);

    // Append details for each content item

    // const description = document.createElement("pre");
    // block.Content = "HelloWorld"

    const collapsibleDescriptionBlock = createCollapsibleBlock("MAIA Description", `${description}`, "block");
    detailsDiv.appendChild(collapsibleDescriptionBlock);

    // const collapsibleInterventionBlock = createCollapsibleBlock("Intervention Experiment", `${intervention}`, "block");
    // detailsDiv.appendChild(collapsibleInterventionBlock);

    // const collapsibleContrastiveBlock = createCollapsibleBlock("Contrastive Evaluation", `${eval}`, "none");
    // detailsDiv.appendChild(collapsibleContrastiveBlock);

    const collapsibleBlock = createCollapsibleExperimentBlock("Full Interpretation Experiment", experiment);
    detailsDiv.appendChild(collapsibleBlock);

    detailsDiv.classList.remove("hidden");
}


function closeExperimentDetails(event) {
    event.target.parentNode.classList.add("hidden");
}


function createCollapsibleCodeBlock(codeText) {
    // First, create the code block element with syntax highlighting
    const codeBlockElement = createCodeBlock(codeText);

    // Create the container for the collapsible code block with a title
    const containerDiv = document.createElement("div");
    containerDiv.className = "collapsible-container-code";

    // Create a header for the collapsible block, which includes the title and the toggle icon
    const headerDiv = document.createElement("div");
    // headerDiv.className = "collapsible-header";
    headerDiv.className = "code-header";
    // headerDiv.textContent = "Code"; // Set the title

    // Create the toggle icon, which is a triangle
    const toggleIcon = document.createElement("span");
    toggleIcon.innerHTML = "&#9654;"; // Unicode character for a right-pointing triangle
    toggleIcon.className = "collapsible-toggle";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = "def execute_command(system, tools):"; 
    // The text "Code" next to the toggle

    // Add an onclick event to the header for toggling the code block's visibility
    headerDiv.onclick = function() {
        const isCollapsed = codeBlockElement.style.display === "none";
        codeBlockElement.style.display = isCollapsed ? "block" : "none";
        toggleIcon.innerHTML = isCollapsed ? "&#9660;" : "&#9654;"; // Change the icon depending on the state
    };

    // Initially hide the code block
    codeBlockElement.style.display = "none";

    // Append the toggle icon to the header
    headerDiv.appendChild(toggleIcon);
    headerDiv.appendChild(titleSpan); // Append the "Code" title next to the toggle
    // Append the header and the code block to the container
    containerDiv.appendChild(headerDiv);
    containerDiv.appendChild(codeBlockElement);

    return containerDiv;
}

function createCollapsibleBlock(Title,content,blockInit) {
    // First, create the code block element with syntax highlighting
    const Element = createBlock(content)

    // Create the container for the collapsible code block with a title
    const containerDiv = document.createElement("div");
    containerDiv.className = "collapsible-container";

    // Create a header for the collapsible block, which includes the title and the toggle icon
    const headerDiv = document.createElement("div");
    headerDiv.className = "collapsible-header";
    // headerDiv.textContent = "Code"; // Set the title

    // Create the toggle icon, which is a triangle
    const toggleIcon = document.createElement("span");
    toggleIcon.innerHTML = "&#9654;"; // Unicode character for a right-pointing triangle
    toggleIcon.className = "collapsible-toggle";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = Title; // The text "Code" next to the toggle

    // Initially hide the code block

    const initState = blockInit === "block";
    Element.style.display = initState ? "block" : "none";
    toggleIcon.innerHTML = initState ? "&#9660;" : "&#9654;";

    // Add an onclick event to the header for toggling the code block's visibility
    headerDiv.onclick = function() {
        const isCollapsed = Element.style.display === "none";
        Element.style.display = isCollapsed ? "block" : "none";
        toggleIcon.innerHTML = isCollapsed ? "&#9660;" : "&#9654;"; // Change the icon depending on the state
    };

    // Append the toggle icon to the header
    headerDiv.appendChild(toggleIcon);
    headerDiv.appendChild(titleSpan); // Append the "Code" title next to the toggle
    // Append the header and the code block to the container
    containerDiv.appendChild(headerDiv);
    containerDiv.appendChild(Element);

    return containerDiv;
}

function createCollapsibleExperimentBlock(Title,experiment) {
    // First, create the code block element with syntax highlighting
    const blockElement = addExperimentDetails(experiment);

    // Create the container for the collapsible code block with a title
    const containerDiv = document.createElement("div");
    // containerDiv.className = "experiment-details"
    containerDiv.className = "collapsible-container";

    // Create a header for the collapsible block, which includes the title and the toggle icon
    const headerDiv = document.createElement("div");
    headerDiv.className = "collapsible-header";
    // headerDiv.textContent = "Code"; // Set the title

    // Create the toggle icon, which is a triangle
    const toggleIcon = document.createElement("span");
    toggleIcon.innerHTML = "&#9654;"; // Unicode character for a right-pointing triangle
    toggleIcon.className = "collapsible-toggle";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = Title; // The text "Code" next to the toggle

    // Add an onclick event to the header for toggling the code block's visibility
    headerDiv.onclick = function() {
        const isCollapsed = blockElement.style.display === "none";
        blockElement.style.display = isCollapsed ? "block" : "none";
        toggleIcon.innerHTML = isCollapsed ? "&#9660;" : "&#9654;"; // Change the icon depending on the state
    };

    // Initially hide the code block
    blockElement.style.display = "none";

    // Append the toggle icon to the header
    headerDiv.appendChild(toggleIcon);
    headerDiv.appendChild(titleSpan); // Append the "Code" title next to the toggle
    // Append the header and the code block to the container
    containerDiv.appendChild(headerDiv);
    containerDiv.appendChild(blockElement);

    return containerDiv;
}



document.addEventListener('DOMContentLoaded', () => {
    fetch('./data_all.json')
        .then(response => response.json())
        .then(jsonData => {
            populateModelDropdown(jsonData.models);
            generateHTMLFromJSON(jsonData.models[0]); // Default to the first model initially
        })
        .catch(error => console.error('Failed to load JSON data:', error));
});


const typewriterText = `Hi! I'm MAIA (a Multimodal Automated Interpretability Agent). I 
ran experiments on neurons inside a variety of vision models to 
describe their behavior. Hover over each unit to see the label 
I gave it, and click on the unit to see my full experiment.`;

const typewriterContainer = document.getElementById('typewriter');
const typingSpeed = 1; // Duration of the typing animation for each line in seconds

const lines = typewriterText.split('\n');
let cumulativeDelay = 0;

lines.forEach((line, index) => {
  const lineSpan = document.createElement('span');
  lineSpan.classList.add('typewriter-line');
  lineSpan.textContent = line;

  // Apply the typing animation with the calculated cumulative delay
  lineSpan.style.animation = `typing ${typingSpeed}s steps(${line.length}) ${cumulativeDelay}s forwards`;

  typewriterContainer.appendChild(lineSpan);

  // Insert a line break after each line except the last one
  if (index < lines.length - 1) {
    typewriterContainer.appendChild(document.createElement('br'));
  }

  cumulativeDelay += typingSpeed; // Increment the delay for the next line
});
