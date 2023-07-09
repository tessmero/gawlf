
var levelList = [
    new Level1(),
    new Level2(),
    new Level3(),
]

var levelListIndex = -1

function getNextLevel(){
    levelListIndex = (levelListIndex+1)%levelList.length
    return levelList[levelListIndex]
}