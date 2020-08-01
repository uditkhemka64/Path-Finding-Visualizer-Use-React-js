// Performs bfs algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.


export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const structure = [startNode];
    startNode.distance = 0;
    while (!!structure.length) {
      
      const closestNode = structure.shift();
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
  
  
      const currentNeighbors = getUnvisitedNeighbors(closestNode,grid);
  
      currentNeighbors.forEach(neighbor => {
      neighbor.isVisited = true;
      neighbor.distance = closestNode.distance + 1;
      neighbor.previousNode = closestNode;
      structure.push(neighbor);
      });
  
    }
    return visitedNodesInOrder;
  }
  
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
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
  
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the bfs method above.
  export function getNodesInShortestPathOrderBfs(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  