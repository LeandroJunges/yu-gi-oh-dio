const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCard: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playersSide: {
        player1 : "player-cards",
        player1BOX:document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel")
    }
}

const pathImg = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImg}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImg}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImg}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide){
    const cardImg = document.createElement("img")
    cardImg.setAttribute("height", "100px")
    cardImg.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImg.setAttribute("data-id", IdCard)
    cardImg.classList.add("card")
    
    if(fieldSide === state.playersSide.player1){
        cardImg.addEventListener("mouseover", ()=>{
            drawSelecteCard(IdCard)
        })

        cardImg.addEventListener("click", ()=>{
            setCardsField(cardImg.getAttribute("data-id"))
        })
    }

    return cardImg
}
async function showHiddenCardFieldsImages(value){
    if(value){
        state.fieldCard.player.style.display = "block"
        state.fieldCard.computer.style.display = "block"

    }else{
        state.fieldCard.player.style.display = "none"
        state.fieldCard.computer.style.display = "none"
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = ""
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCard.player.src = cardData[cardId].img
    state.fieldCard.computer.src = cardData[computerCardId].img
}

async function setCardsField(cardId){
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    await hiddenCardDetails()
    await showHiddenCardFieldsImages(true)

   await drawCardsInField(cardId, computerCardId)

    let duelResults = await checkDuelResults (cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win"
        await playAudio(duelResults)
        state.score.playerScore++
    }
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose"
        await playAudio(duelResults)
        state.score.computerScore++
    }

    return duelResults
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = "block"

}

async function removeAllCardsImages(){
    let {computerBOX, player1BOX} = state.playersSide
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img)=>img.remove())

    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach((img)=>img.remove())
}

async function drawSelecteCard(id){
    state.cardSprites.avatar.src = cardData[id].img
    state.cardSprites.name.innerText = cardData[id].name
    state.cardSprites.type.innerText = "Atribute: " + cardData[id].type

}


async function drawCards (cardNumber, fieldSide){
    for (let i = 0; i < cardNumber; i++){
        const randomIdCard = await getRandomCardId()
        const cardImage =  await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display= "none"

    state.fieldCard.player.style.display="none"
    state.fieldCard.computer.style.display="none"

    init()
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    try {
        audio.play()
        
    } catch (error) {
        
    }
}

function init(){
    showHiddenCardFieldsImages(false)
    drawCards (5, state.playersSide.player1)
    drawCards (5, state.playersSide.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()