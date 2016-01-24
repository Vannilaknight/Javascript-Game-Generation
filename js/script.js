var ctx;
var size;
var grid;
var width;
var height;
var nodeWidth;
var nodeHeight;
var blocksLeftCount;
var blocksUsed = [];
var pathCount = 0;
var numOfRooms = 0;
var totalBlocks = 0;

function Node(x, y) {
    this.x = x;
    this.y = y;
    this.used = false;
    this.numberColor = '#f00';
    this.number = '0';
    this.neighbors = [];
    this.sides = [];
    this.color = randomColor();
}

function gridSet() {
    for (var x = 0; x < nodeWidth; x++) {
        grid[x] = [];
        blocksUsed[x] = [];
        for (var y = 0; y < nodeHeight; y++) {
            grid[x][y] = new Node(x, y);
            blocksUsed[x][y] = null;
            totalBlocks++;
        }
    }

    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            var currentNode = grid[x][y];
            currentNode.neighbors = getNeighbors(grid, currentNode);
        }
    }
    blocksLeftCount = 0;
    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            blocksLeftCount++;
        }
    }
}

function getNeighbors(grid, node) {
    var ret = [];
    var x = node.x;
    var y = node.y;

    if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
    }
    if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
    }
    if (grid[x][y - 1] && grid[x][y - 1]) {
        ret.push(grid[x][y - 1]);
    }
    if (grid[x][y + 1] && grid[x][y + 1]) {
        ret.push(grid[x][y + 1]);
    }
    return ret;
}

function init() {
    var canvas = document.getElementById('map');

    ctx = canvas.getContext('2d');

    width = canvas.width;
    height = canvas.height;

    console.log(width)

    size = 10;
    numOfRooms = 4;

    grid = [];

    nodeWidth = width / size;
    nodeHeight = height / size;

    console.log(nodeWidth);

    gridSet();
    console.log(grid);
    window.requestAnimationFrame(draw);
    startTree();
}

function draw() {

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, width, height); // clear canvas

    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();

    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            var currentNode = grid[x][y];
            ctx.fillStyle = currentNode.color;
            ctx.fillRect(currentNode.x * size, currentNode.y * size, size, size);
            //ctx.strokeStyle = 'rgb(0,0,0)';
            //ctx.strokeRect(currentNode.x * size, currentNode.y * size, size, size);
            //ctx.fillStyle = currentNode.numberColor;
            //ctx.font = "20pt";
            //ctx.fillText(currentNode.number, currentNode.x * size, (currentNode.y * size) + size);
        }
    }

    ctx.restore();

    window.requestAnimationFrame(draw);
}


function sign(n) {
    if (n < 0) {
        return -1;
    } else if (n > 0) {
        return 1;
    } else {
        return 0;
    }
}

function randomColor() {
    var r = Math.floor((Math.random() * 255) + 1),
        g = Math.floor((Math.random() * 255) + 1),
        b = Math.floor((Math.random() * 255) + 1);

    return 'rgba(' + r + ',' + g + ',' + b + ', .4)'
}

function getGrass(){
    var grass = ['#005C09','#00680A','#007B0C','#018E0E','#01A611'];
    return grass[Math.floor(Math.random()*grass.length)];
}

function getWater(){
    var water = ['#68B3AF','#87BDB1','#AACCB1','#C3DBB4','#D3E2B6'];
    return water[Math.floor(Math.random()*water.length)];
}

function getDirt(){
    var dirt = ['#CFAC61','#E2C68B','#C09D77','#D4C2AE','#8A847E'];
    return dirt[Math.floor(Math.random()*dirt.length)];
}

function getForest(){
    var forest = ['#808F12','#2A5C0B','#042608'];
    return forest[Math.floor(Math.random()*forest.length)];
}

function getZone(){
    var zones = [getDirt(), getForest(), getGrass(), getWater()];
    return zones[Math.floor(Math.random()*zones.length)]
}

function createZones() {
    var difference = totalBlocks / numOfRooms;
    var zones = [];
    for(var q = 0; q < numOfRooms; q++){
        zones.push(getZone());
    }
    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            var currentNode = grid[x][y];
            currentNode.color = zones[Math.floor(currentNode.number/difference)];
        }
    }

}

function checkBlocks(node) {
    var ret = false;
    if (!grid[node.x][node.y].used) {
        ret = true;
    }
    return ret;
}

function getOptions(node) {
    var options = [];
    node.neighbors.forEach(function (neighbor, index, arr) {
        if (checkBlocks(neighbor)) {
            options.push(neighbor);
        }
    });
    return options;
}

function startTree() {
    var startX = Math.floor((Math.random() * width / size));
    var startY = Math.floor((Math.random() * height / size));
    var startingNode = grid[startX][startY];
    iterateTree(startingNode, null);
}

function iterateTree(node) {

    node.used = true;
    blocksUsed.push(node);
    node.numberColor = '#00F';
    node.number = ++pathCount;
    blocksLeftCount--;
    var currentNode = node;
    var options = getOptions(currentNode);

    if (options.length == 0) {
        stepBack(blocksUsed, 1, currentNode);
    } else {
        var selection = Math.floor(Math.random() * options.length);
        var nextNode = options[selection];
        currentNode.sides.push(determineSide(currentNode, nextNode));
        nextNode.sides.push(determineSide(nextNode, currentNode));
        console.log(currentNode);
        iterateTree(nextNode)
    }
}

function stepBack(blocksUsed, amount) {
    var currentNode = blocksUsed[blocksUsed.length - amount];
    var options = getOptions(currentNode);
    if (options.length == 0) {
        stepBack(blocksUsed, amount + 1);
    } else {
        var selection = Math.floor(Math.random() * options.length);
        var nextNode = options[selection];
        currentNode.sides.push(determineSide(currentNode, nextNode));
        nextNode.sides.push(determineSide(nextNode, currentNode));
        iterateTree(nextNode)
    }
}

function determineSide(fromNode, toNode) {
    var ret;
    var x = sign(toNode.x - fromNode.x);
    var y = sign(toNode.y - fromNode.y);

    //left
    if (x == 0 && y == -1) {
        ret = 'left'
    }
    //right
    if (x == 0 && y == 1) {
        ret = 'right'
    }
    //top
    if (x == -1 && y == 0) {
        ret = 'top'
    }
    //bottom
    if (x == 1 && y == 0) {
        ret = 'bottom'
    }

    return ret;
}

init();
