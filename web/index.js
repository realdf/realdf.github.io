const fileSubmitBtn = document.querySelector("#csv-file-submit");
const csvFile = document.querySelector("#csv-file");
let rawAlliance = {rawAlliance: "empty"};
let alliance = {};
let memberList = [];
let rosterInfo;


window.onload = function() {
    if (localStorage.getItem(`rosterInfo`)) {
        rosterInfo = JSON.parse(localStorage.getItem(`rosterInfo`));
    }
};


const uploadconfirm = fileSubmitBtn.addEventListener('click', async () => {
    CSVtoRAWAlliance();
    console.log(rawAlliance);
    
});

// Takes in the 'alliance roster' csv and turns it into an object with an array containing each row.
// Stores it in 'rawAlliance'.
function CSVtoRAWAlliance() {
    Papa.parse(csvFile.files[0], {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log(results);
            rawAlliance = results;
            rawAllianceToOrganized();
        }
    });
    
};

// description
function rawAllianceToOrganized() {
    rosterLoop();
    console.log("Alliance done: ", alliance);
    for (let member of memberList) {
        raidTeamCreation(member);
    };
    console.log("Done!");
};

function rosterLoop() {
    for (let i = 0; i < rawAlliance.data.length; i++) {
        let member = rawAlliance.data[i].Name;
        let toonName = rawAlliance.data[i].CharacterId;
        let toonPower = rawAlliance.data[i].Power;
        rosterPropertyCreation(member);
        alliance[member].roster[toonName] = parseInt(toonPower);
        if (memberList.indexOf(member) == -1) {
            memberList.push(member);
        }
    };
}

function rosterPropertyCreation(member) {
    if (alliance[member] == undefined) {
        alliance[member] = {};
    }
    if (alliance[member].roster == undefined) {
        alliance[member].roster = {};
    }
};

function raidTeamCreation(member) {
    console.log("raidTeamCreation: ", member);
    alliance[member].raidTeams = {};
    for (let raid in raidTeams) {
        alliance[member].raidTeams[raid] = {};
        for (let nodeType in raidTeams[raid]) {
            alliance[member].raidTeams[raid][nodeType] = {};
            for (let team in raidTeams[raid][nodeType]) {
                alliance[member].raidTeams[raid][nodeType][team] = {};
                alliance[member].raidTeams[raid][nodeType][team].missing = [];
                let teamPower = 0;
                for (let toon of raidTeams[raid][nodeType][team]) {
                    // if (alliance[member].roster[toon] == undefined) {
                    //     continue;
                    // }
                    // teamPower += alliance[member].roster[toon];
                    if (isNaN(alliance[member].roster[toon])) {
                        alliance[member].raidTeams[raid][nodeType][team].missing.push(toon);
                    } else {
                        teamPower += alliance[member].roster[toon];
                    }

                    // teamPower += isNaN(alliance[member].roster[toon])? 0 : alliance[member].roster[toon];
                };
                alliance[member].raidTeams[raid][nodeType][team].power = teamPower;
            }
        }
    }
    // save the alliance object locally
    localStorage.setItem(`rosterInfo`, JSON.stringify(alliance));
};

function displayTeams(rosterInfo) {

}


function doomLaneAlgorithmTest(numberOfLanes, numberOfSections) {
    // gather total power levels from the meta teams I know
    let totalDoomPower = [];

    for (let member of memberList) {
        let power = gatherDoomTeamPower(member);
        totalDoomPower.push({member: member, doomPower: power});
    }
    totalDoomPower.sort(({doomPower: a}, {doomPower: b}) => b-a);
    // split up teams evenly
        // top 6 across all strike teams, in lanes 1 & 1+(number of lanes / numberOfSections) (4/2=2, then +1=3)
    //
}

function gatherDoomTeamPower(member) {
    let totalPower = 0;
    totalPower += isNaN(alliance[member].raidTeams.doom.bio.WebWarriors)? 0 : alliance[member].raidTeams.doom.bio.WebWarriors;
    totalPower += isNaN(alliance[member].raidTeams.doom.bio.Gamma)? 0 : alliance[member].raidTeams.doom.bio.Gamma;
    totalPower += isNaN(alliance[member].raidTeams.doom.mutant.DeathSeed)? 0 : alliance[member].raidTeams.doom.mutant.DeathSeed;
    totalPower += isNaN(alliance[member].raidTeams.doom.mystic.Eternals_NewWarriors)? 0 : alliance[member].raidTeams.doom.mystic.Eternals_NewWarriors;
    totalPower += isNaN(alliance[member].raidTeams.doom.skill.SA_Kestrel_ShangChi)? 0 : alliance[member].raidTeams.doom.skill.SA_Kestrel_ShangChi;
    totalPower += isNaN(alliance[member].raidTeams.doom.tech.BionicAvengers)? 0 : alliance[member].raidTeams.doom.tech.BionicAvengers;
    return totalPower;
}