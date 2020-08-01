// Performs A-star search algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.


export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = manhanttanDistance(startNode, startNode, finishNode);
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    let node = visitedNodesInOrder[visitedNodesInOrder.length-1];
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, startNode, finishNode);
  }
}



function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid, startNode, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    let getDistance = manhanttanDistance(startNode ,neighbor, finishNode);  
    
    if(neighbor.distance > getDistance)
    {
    neighbor.distance = getDistance;  
    neighbor.previousNode = node;
    }
    
  }
}



function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}


function manhanttanDistance(startNode, souceNode, targetNode)
{
    let x1 = startNode.row;
    let y1 = startNode.col;
    let x2 = souceNode.row;
    let y2 = souceNode.col;
    let x3 = targetNode.row;
    let y3 = targetNode.col;

    let firstPart = (Math.abs(x1-x2)+Math.abs(y1-y2));
    let secondPart = (Math.abs(x2-x3)+Math.abs(y2-y3));

    return (firstPart + secondPart);
}


function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}



// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the astar method above.
export function getNodesInShortestPathOrderAstar(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
