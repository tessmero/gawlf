
var levelList = [
    new Level1(),
    new Level1a(),
    new Level2(),
    new Level3(),
    new Level4(),
    new Level5(),
]

var levelListIndex = -1

function getNextLevel(){
    levelListIndex = (levelListIndex+1)%levelList.length
    return levelList[levelListIndex]
}