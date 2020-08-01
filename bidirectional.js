// Performs bidirectional algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

let intersect = 0;
let firsthalf = [];
let secondhalf = [];


export function bidirectional(grid , startNode, finishNode)
{
    const visitedNodesInOrder = [];
    const starting = [startNode];
    const ending = [finishNode];
    startNode.distance = 0;
    finishNode.distance = 0;
    startNode.isVisited = true;
    finishNode.isVisited = true;


    while(starting.length && ending.length)
    {
        
        const closestNodeStart = starting.shift();
        const closestNodeEnd  = ending.shift();
         
        

        if(closestNodeStart.distance === Infinity) return visitedNodesInOrder;
        if(closestNodeEnd.distance === Infinity) return visitedNodesInOrder;
        
        
        if(closestNodeStart.isWall === false)
        {
            closestNodeStart.isVisited = true;
            visitedNodesInOrder.push(closestNodeStart); 
            
            const currentNeighbors = getUnvisitedNeighbors(closestNodeStart,grid);
  
            currentNeighbors.forEach(neighbor => {
            neighbor.isVisited = true;
            neighbor.distance = closestNodeStart.distance + 1;
            neighbor.previousNode = closestNodeStart;
            starting.push(neighbor);
            
            
        });
        }


        if(closestNodeEnd.isWall === false)
        {
            closestNodeEnd.isVisited = true;
            visitedNodesInOrder.push(closestNodeEnd); 
            
            const currentNeighbors = getUnvisitedNeighbors(closestNodeEnd,grid);
  
            currentNeighbors.forEach(neighbor => {
            neighbor.isVisited = true;
            neighbor.distance = closestNodeEnd.distance + 1;
            neighbor.previousNode = closestNodeEnd;
            ending.push(neighbor);

        
        });
        }


        

        
        for(let i=0;i<starting.length;i++) {
            for(let j=0;j<ending.length;j++) {
                  const s=starting[i];
                  const e=ending[j];

                  if(s.row === e.row)
                  {
                      if(s.col === e.col+1){
                          
                        if(starting[i].isWall === false && ending[j].isWall === false)
                        {
                          intersect = 1;
                          visitedNodesInOrder.push(starting[i]);firsthalf = starting[i];
                          visitedNodesInOrder.push(ending[j]);secondhalf = ending[j];
                        } 
                        }
                      if(s.col === e.col-1){
                          
                        if(starting[i].isWall === false && ending[j].isWall === false)
                        {
                          intersect = 1;
                          visitedNodesInOrder.push(starting[i]);firsthalf = starting[i];
                          visitedNodesInOrder.push(ending[j]);secondhalf = ending[j];
                        }
                        }
                  }
                  if(s.col === e.col)
                  {
                    if(s.row === e.row+1){
                        if(starting[i].isWall === false && ending[j].isWall === false)
                        {
                        intersect = 1;
                        visitedNodesInOrder.push(starting[i]);firsthalf = starting[i];
                        visitedNodesInOrder.push(ending[j]);secondhalf = ending[j];
                        }
                    }
                    if(s.row === e.row-1){
                        
                        if(starting[i].isWall === false && ending[j].isWall === false)
                        {
                        intersect = 1;
                        visitedNodesInOrder.push(starting[i]);firsthalf = starting[i];
                        visitedNodesInOrder.push(ending[j]);secondhalf = ending[j];
                        }
                    }
                  }
            }
        }
       
        if(intersect === 1) return visitedNodesInOrder;

    }
   return visitedNodesInOrder;
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


export function getNodesInShortestPathOrderBidirectional(finishNode)
{   

    const nodesInShortestPathOrder = [];

    if(intersect === 1)
    {
        let currentNode = firsthalf;
        while(currentNode !== null)
        {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }   

        currentNode = secondhalf;
        while (currentNode !== null) {
          nodesInShortestPathOrder.push(currentNode);
          currentNode = currentNode.previousNode;
        }
        
    }
    return nodesInShortestPathOrder;
}  