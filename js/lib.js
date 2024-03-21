import { FitText } from "./DOMUtil.js";
import { getCalledSetsFactory } from "./api/getCalledSets.js";

const getCalledSets = await getCalledSetsFactory();

export function initLayout(columns){
    $("#content").empty();
    let html = ""
    for (let i = 0; i < (columns || 2) ; i++){
        html += `<div class = "column col${i}"></div>`
    }
    $(".content").html(html);
}


function resetContent(){
    $(".column").empty();
}

const state_names = {
    2: "started",
    6: "called"
}
function getStateName(state){
    return state_names[state];
}

function setInfoBoxHTML(state){
    let state_name = getStateName(state)
    return state_name ? `
        <div class = "set-infobox set-infobox-${getStateName(state)}">test:t</div>
    ` : ""
}

function makeSetHTML(set, index){
    return `
        <div class = "set s${index} ${set.state == 6 ? "called" : "started"}">
            <div class = "players-container">
                <div class = "player p1">
                    <div class = "playerName">
                        <div class = "text">
                            ${set.slots[0].entrant.name}
                        </div>
                    </div>
                </div>
                <div class = "player p2">
                    <div class = "playerName">
                        <div class = "text">
                            ${set.slots[1].entrant.name}
                        </div>
                    </div>
                </div>
            </div>
            ${setInfoBoxHTML(set.state)}
        </div>

    `
}

function addSet(set, index, config){
    let html = makeSetHTML(set, index);
    $(".column.col" + index % config.columns).append(html);
}

function fitTexts(totalSets){
    for (let i = 0; i < totalSets; i++){
        FitText($(`.s${i} .p1 .playerName`));
        FitText($(`.s${i} .p2 .playerName`));
    }
}

export async function loadSets(client, slug, config){
    let event = await getCalledSets(slug, client);

    console.log(event);

    resetContent();

    let i = 0;
    for (let set of event.sets.nodes){
        console.log(set.state == 2 ? "Started" : "Called", set.slots[0].entrant.name, set.slots[1].entrant.name)
        addSet(set, i, config);
        i++;
    }
    fitTexts(i);

}
