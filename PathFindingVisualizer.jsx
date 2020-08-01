import React, { Component } from 'react';
import {useState, useEffect } from 'react';
import Node from './Node';
import './PathFindingVisualizer.css';
import {djisktra, getNodesInShortestPathOrder} from './djisktra.js';
import {dfs, getNodesInShortestPathOrderDfs} from './dfs.js';
import {bfs, getNodesInShortestPathOrderBfs} from './bfs.js';
import {bdfs, getNodesInShortestPathOrderBdfs} from './bdfs.js';
import {astar, getNodesInShortestPathOrderAstar} from './aStar.js';
import {bidirectional, getNodesInShortestPathOrderBidirectional} from './bidirectional.js';
import {getHeight} from './getHeight.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootStrap from "react-bootstrap";
import {recursiveDivisionMaze1} from './recursiveDivisionMaze.js';

//import './recursiveDivisionMaze.jsx';
//let no_of_rows = Math.floor((height / 90));
//let no_of_columns = Math.floor(width / 90);

var width = window.screen.width;

var height = window.screen.height;

const array = getHeight();



export let no_of_rows=24;
export let no_of_columns=61;
export var currentStatus=new Array(no_of_rows);

let startNodeRow=0;
let startNodeCol=0;
let finishNodeRow=no_of_rows-1;
let finishNodeCol=no_of_columns-1;
let makeWall = 0;
let speed = 10;
let play=0;
let currentAlgo = -1;
let currentRunningAlgorithm = -1;


for(let row=0;row<no_of_rows;row++)
{
     currentStatus[row]=new Array(no_of_columns);
}



export default class PathFindingVisualizer extends Component {

    constructor() {
        super();
        this.state = {
          grid: [],
          mouseIsPressed: false,
        };
      }


      

componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
}



clearAllWall=()=>{
  
  const {grid} = this.state;
  if(currentRunningAlgorithm === 1){return;}

  for(let row=0;row<no_of_rows;row++)
  {
   for(let col=0;col<no_of_columns;col++)
   {
    let currentHTMLNode = document.getElementById(`node-${row}-${col}`);
    
    if(currentHTMLNode.className === "node node-wall" || currentStatus[row][col] === "wall")
    {
      let node = grid[row][col];
      node.isWall = true;
      currentStatus[row][col] = "normal";
      currentHTMLNode.className = 'node';
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
   
   }
  }
   
  //const newGrid1=getInitialGrid();
  //this.setState({grid: newGrid1, mouseIsPressed: false});
};



onlyWalls()
{
  const {grid} = this.state;
  
}


showOnlyShortestPath=()=>{
    
  
  const {grid} = this.state;
  if(currentRunningAlgorithm === 1){return;}

  for(let row=0;row<no_of_rows;row++)
  {
   for(let col=0;col<no_of_columns;col++)
   {
    let currentHTMLNode = document.getElementById(`node-${row}-${col}`);
    
    if(currentHTMLNode.className === "node node-wall" || currentHTMLNode.className === "node node-visited")
    {
      let node = grid[row][col];
      node.isWall = true;
      currentStatus[row][col] = "normal";
      currentHTMLNode.className = 'node';
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
   
   }
  }

};




handleMouseDown(row, col) {
    
    //if(currentRunningAlgorithm === 1){return;}
    if(makeWall === 0)
    {  
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
    }
}

handleMouseEnter(row, col) {
    
  //if(currentRunningAlgorithm === 1){return;}
    if(makeWall === 0)
    {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
    }
}


handleMouseUp() {

  //if(currentRunningAlgorithm === 1){return;}
  if(makeWall === 0)
  {
  this.setState({mouseIsPressed: false});
  }
}


clearAllBoard=() => {
  
  const newGrid=this.state.grid;
  if(currentRunningAlgorithm === 1){return;}
  this.adjustNormal();

  for(let row=0;row<no_of_rows;row++)
  {
   for(let col=0;col<no_of_columns;col++)
   {
    let currentHTMLNode = document.getElementById(`node-${row}-${col}`);
    let current = currentStatus[row][col];
    
    if(current === "animated" || current === "animated-shortest-path" || current === "wall")
    {
      currentStatus[row][col]="normal";
      currentHTMLNode.className='node';
    }
  }
}


  currentAlgo = -1;
  play=0;
  makeWall = 0;
  speed = 10;
  let grid = getInitialGrid();
  this.setState({grid});

};


showMessage(){
  alert("CANNOT FIND THE PATH");
}



adjustFast=() =>{
     speed=5;
};
adjustNormal=() =>{
  speed=10;
};
adjustSlow=() =>{
  speed=15;
};

Resume=() =>{
  play=0;
};
Pause=() =>{
  play=1;
}






animateDjisktra(visitedNodesInOrder, nodesInShortestPathOrder, check) {
    for(let i = 0; i <= visitedNodesInOrder.length; i++) {
      
      if(i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPathDijsktra(nodesInShortestPathOrder, check);
        }, speed*i);
        return;
      } 
      let node1=visitedNodesInOrder[i];
      var track=0;
      if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
      if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
      
      if(track === 0){
      setTimeout(() => {
      let node = visitedNodesInOrder[i];  
      currentStatus[node.row][node.col]="animated";  
      document.getElementById(`node-${node.row}-${node.col}`).className =
      'node node-visited';
      }, speed*i);
    }
  }
  
}



animateShortestPathDijsktra(nodesInShortestPathOrder, check) {
  
  let node11=nodesInShortestPathOrder[0];
  let previousDirectionRow=node11.row;
  let previousDirectionCol=node11.col;
  let currentDirectionRow=node11.row;
  let currentDirectionCol=node11.col;
  

  for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      
      let node1=nodesInShortestPathOrder[i];
      let track=0;
      if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
      if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
      let direction = -1;
      if(track === 0)
      {

      previousDirectionRow=nodesInShortestPathOrder[i-1].row;
      previousDirectionCol=nodesInShortestPathOrder[i-1].col;
      currentDirectionRow=nodesInShortestPathOrder[i].row;
      currentDirectionCol=nodesInShortestPathOrder[i].col;


      if(previousDirectionCol === currentDirectionCol){
        if(currentDirectionRow >= previousDirectionRow)
        {
          direction=3;
        }
        if(currentDirectionRow < previousDirectionRow)
        {
          direction=1;     
        }
      }
      
      if(previousDirectionRow === currentDirectionRow){
        if(currentDirectionCol >= previousDirectionCol)
        {
          direction=2;
        }
        if(currentDirectionCol < previousDirectionCol)
        {
          direction=4;     
        }
      }
      
      

      if(direction === 1)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-up';
        }, 50*i);

        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-up';
        }, 57*i);
      }

      if(direction === 2)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-right';
        }, 50*i);

        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-right';
        }, 57*i);
      }

      if(direction === 3)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-down';
        }, 50*i);

        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-down';
        }, 57*i);
      }

      if(direction === 4)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-left';
        }, 50*i);

        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-left';
        }, 57*i);
      }
      
      }
  }

  currentRunningAlgorithm = -1;

}



visualizeDjisktra()
{
  
  makeWall=1;
  
  if(currentRunningAlgorithm === 1){return;}
  if(currentAlgo !== -1){this.clearAllBoard();}
  currentRunningAlgorithm = 1;

  for(let row=0;row<no_of_rows;row++)
  {
    for(let col=0;col<no_of_columns;col++)
    {
      let currentHTMLNode=document.getElementById(`node-${row}-${col}`);
      if(currentStatus[row][col] === "animated"  || currentStatus[row][col] === "animated-shortest-path")
      {
      currentHTMLNode.className='node';
      currentStatus[row][col]="normal";
      }  
    }
  }
 
  
  let check = 0;
  const {grid}=this.state;
  const startNode=grid[startNodeRow][startNodeCol];
  const finishNode=grid[finishNodeRow][finishNodeCol];
  const visitedNodesInOrder = djisktra(grid, startNode, finishNode, check);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  this.animateDjisktra(visitedNodesInOrder,nodesInShortestPathOrder,check);
  
  
  
  document.getElementById(`node-${startNodeRow}-${startNodeCol}`).className="node node-start";
  document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`).className="node node-finish";
  

  currentAlgo = 1;
}






animateDfs(visitedNodesInOrder, nodesInShortestPathOrder) {
  for(let i = 0; i <= visitedNodesInOrder.length; i++) {
    
    if(i === visitedNodesInOrder.length) {
      setTimeout(() => {
        this.animateShortestPathDfs(nodesInShortestPathOrder);
      }, speed*i);
      return;
    }
    let node1=visitedNodesInOrder[i]; 
    var track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    
    if(track === 0){
    setTimeout(() => {
    let node = visitedNodesInOrder[i];  
    currentStatus[node.row][node.col]="animated";  
    document.getElementById(`node-${node.row}-${node.col}`).className =
    'node node-visited';
    }, speed*i);
  }
}

}



animateShortestPathDfs(nodesInShortestPathOrder) {

let node11=nodesInShortestPathOrder[0];
let previousDirectionRow=node11.row;
let previousDirectionCol=node11.col;
let currentDirectionRow=node11.row;
let currentDirectionCol=node11.col;

for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
    
    let node1=nodesInShortestPathOrder[i];
    let track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    let direction = -1;
    if(track === 0)
    {

    previousDirectionRow=nodesInShortestPathOrder[i-1].row;
    previousDirectionCol=nodesInShortestPathOrder[i-1].col;
    currentDirectionRow=nodesInShortestPathOrder[i].row;
    currentDirectionCol=nodesInShortestPathOrder[i].col;


    if(previousDirectionCol === currentDirectionCol){
      if(currentDirectionRow >= previousDirectionRow)
      {
        direction=3;
      }
      if(currentDirectionRow < previousDirectionRow)
      {
        direction=1;     
      }
    }
    
    if(previousDirectionRow === currentDirectionRow){
      if(currentDirectionCol >= previousDirectionCol)
      {
        direction=2;
      }
      if(currentDirectionCol < previousDirectionCol)
      {
        direction=4;     
      }
    }
    
    

    if(direction === 1)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-up';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-up';
      }, 57*i);
    }

    if(direction === 2)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-right';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-right';
      }, 57*i);
    }

    if(direction === 3)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-down';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-down';
      }, 57*i);
    }

    if(direction === 4)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-left';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-left';
      }, 57*i);
    }
    
    }
}

currentRunningAlgorithm = -1;
}


visualizeDfs()
{
  makeWall=1;
  
  if(currentRunningAlgorithm === 1){return;}
  if(currentAlgo !== -1){this.clearAllBoard();}
  currentRunningAlgorithm = 1;

  for(let row=0;row<no_of_rows;row++)
  {
    for(let col=0;col<no_of_columns;col++)
    {
      let currentHTMLNode=document.getElementById(`node-${row}-${col}`);
      if(currentStatus[row][col] === "animated"  || currentStatus[row][col] === "animated-shortest-path")
      {
      currentHTMLNode.className='node';
      currentStatus[row][col]="normal";
      }  
    }
  }
 


  const {grid}=this.state;
  const startNode=grid[startNodeRow][startNodeCol];
  const finishNode=grid[finishNodeRow][finishNodeCol];
  const visitedNodesInOrder = dfs(grid, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrderDfs(finishNode);
  this.animateDfs(visitedNodesInOrder,nodesInShortestPathOrder);
  
  
  
  document.getElementById(`node-${startNodeRow}-${startNodeCol}`).className="node node-start";
  document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`).className="node node-finish";


  currentAlgo = 2;
} 







animateBfs(visitedNodesInOrder, nodesInShortestPathOrder) {
  for(let i = 0; i <= visitedNodesInOrder.length; i++) {
    
    if(i === visitedNodesInOrder.length) {
      setTimeout(() => {
        this.animateShortestPathBfs(nodesInShortestPathOrder);
      }, speed*i);
      return;
    } 
    let node1=visitedNodesInOrder[i];
    var track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    
    if(track === 0){
    setTimeout(() => {
    let node = visitedNodesInOrder[i];  
    currentStatus[node.row][node.col]="animated";  
    document.getElementById(`node-${node.row}-${node.col}`).className =
    'node node-visited';
    }, speed*i);
  }
}

}



animateShortestPathBfs(nodesInShortestPathOrder) {

let node11=nodesInShortestPathOrder[0];
let previousDirectionRow=node11.row;
let previousDirectionCol=node11.col;
let currentDirectionRow=node11.row;
let currentDirectionCol=node11.col;

for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
    
    let node1=nodesInShortestPathOrder[i];
    let track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    let direction = -1;
    if(track === 0)
    {

    previousDirectionRow=nodesInShortestPathOrder[i-1].row;
    previousDirectionCol=nodesInShortestPathOrder[i-1].col;
    currentDirectionRow=nodesInShortestPathOrder[i].row;
    currentDirectionCol=nodesInShortestPathOrder[i].col;


    if(previousDirectionCol === currentDirectionCol){
      if(currentDirectionRow >= previousDirectionRow)
      {
        direction=3;
      }
      if(currentDirectionRow < previousDirectionRow)
      {
        direction=1;     
      }
    }
    
    if(previousDirectionRow === currentDirectionRow){
      if(currentDirectionCol >= previousDirectionCol)
      {
        direction=2;
      }
      if(currentDirectionCol < previousDirectionCol)
      {
        direction=4;     
      }
    }
    
    

    if(direction === 1)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-up';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-up';
      }, 57*i);
    }

    if(direction === 2)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-right';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-right';
      }, 57*i);
    }

    if(direction === 3)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-down';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-down';
      }, 57*i);
    }

    if(direction === 4)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-left';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-left';
      }, 57*i);
    }
    
    }
}
currentRunningAlgorithm = -1;
}


visualizeBfs()
{
  makeWall=1;
  
  if(currentRunningAlgorithm === 1){return;}
  if(currentAlgo !== -1){this.clearAllBoard();}
  currentRunningAlgorithm = 1;
   
  
  for(let row=0;row<no_of_rows;row++)
  {
    for(let col=0;col<no_of_columns;col++)
    {
      let currentHTMLNode=document.getElementById(`node-${row}-${col}`);
      if(currentStatus[row][col] === "animated"  || currentStatus[row][col] === "animated-shortest-path")
      {
      currentHTMLNode.className='node';
      currentStatus[row][col]="normal";
      }  
    }
  }
 


  const {grid}=this.state;
  const startNode=grid[startNodeRow][startNodeCol];
  const finishNode=grid[finishNodeRow][finishNodeCol];
  const visitedNodesInOrder = bfs(grid, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrderBfs(finishNode);
  this.animateBfs(visitedNodesInOrder,nodesInShortestPathOrder);
  
  
  
  document.getElementById(`node-${startNodeRow}-${startNodeCol}`).className="node node-start";
  document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`).className="node node-finish";


  currentAlgo = 3;
} 







animateBdfs(visitedNodesInOrder, nodesInShortestPathOrder) {
  for(let i = 0; i <= visitedNodesInOrder.length; i++) {
    
    

    if(i === visitedNodesInOrder.length) {
      setTimeout(() => {
        this.animateShortestPathBdfs(nodesInShortestPathOrder);
      }, speed*i);
      return;
    }
    let node1=visitedNodesInOrder[i]; 
    var track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    
    if(track === 0){
    setTimeout(() => {
    let node = visitedNodesInOrder[i];  
    currentStatus[node.row][node.col]="animated";  
    document.getElementById(`node-${node.row}-${node.col}`).className =
    'node node-visited';
    }, speed*i);
  }
}

}



animateShortestPathBdfs(nodesInShortestPathOrder) {

let node11=nodesInShortestPathOrder[0];
let previousDirectionRow=node11.row;
let previousDirectionCol=node11.col;
let currentDirectionRow=node11.row;
let currentDirectionCol=node11.col;

for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
    
    let node1=nodesInShortestPathOrder[i];
    let track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    let direction = -1;
    if(track === 0)
    {

    previousDirectionRow=nodesInShortestPathOrder[i-1].row;
    previousDirectionCol=nodesInShortestPathOrder[i-1].col;
    currentDirectionRow=nodesInShortestPathOrder[i].row;
    currentDirectionCol=nodesInShortestPathOrder[i].col;


    if(previousDirectionCol === currentDirectionCol){
      if(currentDirectionRow >= previousDirectionRow)
      {
        direction=3;
      }
      if(currentDirectionRow < previousDirectionRow)
      {
        direction=1;     
      }
    }
    
    if(previousDirectionRow === currentDirectionRow){
      if(currentDirectionCol >= previousDirectionCol)
      {
        direction=2;
      }
      if(currentDirectionCol < previousDirectionCol)
      {
        direction=4;     
      }
    }
    
    

    if(direction === 1)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-up';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-up';
      }, 57*i);
    }

    if(direction === 2)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-right';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-right';
      }, 57*i);
    }

    if(direction === 3)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-down';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-down';
      }, 57*i);
    }

    if(direction === 4)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-left';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-left';
      }, 57*i);
    }
    
    }
}
currentRunningAlgorithm = -1;
}



visualizeBdfs()
{

makeWall=1;
if(currentRunningAlgorithm === 1){return;}
if(currentAlgo !== -1){this.clearAllBoard();}
currentRunningAlgorithm = 1;

for(let row=0;row<no_of_rows;row++)
{
  for(let col=0;col<no_of_columns;col++)
  {
    let currentHTMLNode=document.getElementById(`node-${row}-${col}`);
    if(currentStatus[row][col] === "animated"  || currentStatus[row][col] === "animated-shortest-path")
    {
    currentHTMLNode.className='node';
    currentStatus[row][col]="normal";
    }  
  }
}


const {grid}=this.state;
const startNode=grid[startNodeRow][startNodeCol];
const finishNode=grid[finishNodeRow][finishNodeCol];
const visitedNodesInOrder = bdfs(grid, startNode, finishNode);
const nodesInShortestPathOrder = getNodesInShortestPathOrderBdfs(finishNode);
this.animateBdfs(visitedNodesInOrder,nodesInShortestPathOrder);



document.getElementById(`node-${startNodeRow}-${startNodeCol}`).className="node node-start";
document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`).className="node node-finish";


currentAlgo = 4;
}







animateAstar(visitedNodesInOrder, nodesInShortestPathOrder) {
  for(let i = 0; i <= visitedNodesInOrder.length; i++) {
    
    if(i === visitedNodesInOrder.length) {
      setTimeout(() => {
        this.animateShortestPathAstar(nodesInShortestPathOrder);
      }, speed*i);
      return;
    }
    let node1=visitedNodesInOrder[i]; 
    var track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    
    if(track === 0){
    setTimeout(() => {
    let node = visitedNodesInOrder[i];  
    currentStatus[node.row][node.col]="animated";  
    document.getElementById(`node-${node.row}-${node.col}`).className =
    'node node-visited';
    }, speed*i);
  }
}

}



animateShortestPathAstar(nodesInShortestPathOrder) {

let node11=nodesInShortestPathOrder[0];
let previousDirectionRow=node11.row;
let previousDirectionCol=node11.col;
let currentDirectionRow=node11.row;
let currentDirectionCol=node11.col;

for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
    
    let node1=nodesInShortestPathOrder[i];
    let track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    let direction = -1;
    if(track === 0)
    {

    previousDirectionRow=nodesInShortestPathOrder[i-1].row;
    previousDirectionCol=nodesInShortestPathOrder[i-1].col;
    currentDirectionRow=nodesInShortestPathOrder[i].row;
    currentDirectionCol=nodesInShortestPathOrder[i].col;


    if(previousDirectionCol === currentDirectionCol){
      if(currentDirectionRow >= previousDirectionRow)
      {
        direction=3;
      }
      if(currentDirectionRow < previousDirectionRow)
      {
        direction=1;     
      }
    }
    
    if(previousDirectionRow === currentDirectionRow){
      if(currentDirectionCol >= previousDirectionCol)
      {
        direction=2;
      }
      if(currentDirectionCol < previousDirectionCol)
      {
        direction=4;     
      }
    }
    
    

    if(direction === 1)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-up';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-up';
      }, 57*i);
    }

    if(direction === 2)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-right';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-right';
      }, 57*i);
    }

    if(direction === 3)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-down';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-down';
      }, 57*i);
    }

    if(direction === 4)
    {
      setTimeout(() => {
        currentStatus[node1.row][node1.col]="animated-shortest-path";
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node shortest-path-left';
      }, 50*i);

      setTimeout(() => {
        document.getElementById(`node-${node1.row}-${node1.col}`).className =
          'node instantshortest-path-left';
      }, 57*i);
    }
    
    }
}
currentRunningAlgorithm = -1;
}



visualizeAstar()
{

makeWall=1;
if(currentRunningAlgorithm === 1){return;} 
if(currentAlgo !== -1){this.clearAllBoard();}
currentRunningAlgorithm = 1;

for(let row=0;row<no_of_rows;row++)
{
  for(let col=0;col<no_of_columns;col++)
  {
    let currentHTMLNode=document.getElementById(`node-${row}-${col}`);
    if(currentStatus[row][col] === "animated"  || currentStatus[row][col] === "animated-shortest-path")
    {
    currentHTMLNode.className='node';
    currentStatus[row][col]="normal";
    }  
  }
}


const {grid}=this.state;
const startNode=grid[startNodeRow][startNodeCol];
const finishNode=grid[finishNodeRow][finishNodeCol];
const visitedNodesInOrder = astar(grid, startNode, finishNode);
const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
this.animateAstar(visitedNodesInOrder,nodesInShortestPathOrder);



document.getElementById(`node-${startNodeRow}-${startNodeCol}`).className="node node-start";
document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`).className="node node-finish";


currentAlgo = 5;
}



animateBidirectional(visitedNodesInOrder, nodesInShortestPathOrder) {

  
  for(let i = 0; i <= visitedNodesInOrder.length; i++) {

    if(i === visitedNodesInOrder.length) {
      setTimeout(() => {
        this.animateShortestPathBidirectional(nodesInShortestPathOrder);
      }, speed*i);
      return;
    } 


    let node1=visitedNodesInOrder[i];
    var track=0;
    if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
    if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
    
    if(track === 0){
    setTimeout(() => {
    let node = visitedNodesInOrder[i];  
    currentStatus[node.row][node.col]="animated";  
    document.getElementById(`node-${node.row}-${node.col}`).className =
    'node node-visited';
    }, speed*i);
  }
}

}


animateShortestPathBidirectional(nodesInShortestPathOrder) {

  
  let previousDirectionRow;
  let previousDirectionCol;
  let currentDirectionRow;
  let currentDirectionCol;
  
 

  

  for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      
      let node1=nodesInShortestPathOrder[i];
      let track=0;
      if(node1.row === startNodeRow && node1.col === startNodeCol){track=1;}
      if(node1.row === finishNodeRow && node1.col === finishNodeCol){track=1;}
      let direction = -1;
      if(track === 0)
      {
  
      previousDirectionRow=nodesInShortestPathOrder[i-1].row;
      previousDirectionCol=nodesInShortestPathOrder[i-1].col;
      currentDirectionRow=nodesInShortestPathOrder[i].row;
      currentDirectionCol=nodesInShortestPathOrder[i].col;
  
  
      if(previousDirectionCol === currentDirectionCol){
        if(currentDirectionRow >= previousDirectionRow)
        {
          direction=3;
        }
        if(currentDirectionRow < previousDirectionRow)
        {
          direction=1;     
        }
      }
      
      if(previousDirectionRow === currentDirectionRow){
        if(currentDirectionCol >= previousDirectionCol)
        {
          direction=2;
        }
        if(currentDirectionCol < previousDirectionCol)
        {
          direction=4;     
        }
      }
      
      
  
      if(direction === 1)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-up';
        }, 50*i);
  
        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-up';
        }, 57*i);
      }
  
      if(direction === 2)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-right';
        }, 50*i);
  
        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-right';
        }, 57*i);
      }
  
      if(direction === 3)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-down';
        }, 50*i);
  
        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-down';
        }, 57*i);
      }
  
      if(direction === 4)
      {
        setTimeout(() => {
          currentStatus[node1.row][node1.col]="animated-shortest-path";
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node shortest-path-left';
        }, 50*i);
  
        setTimeout(() => {
          document.getElementById(`node-${node1.row}-${node1.col}`).className =
            'node instantshortest-path-left';
        }, 57*i);
      }
      
      }
  }
  currentRunningAlgorithm = -1;
}




visualizeBidirectional()
{
  makeWall=1;
  
  if(currentRunningAlgorithm === 1){return;}
  if(currentAlgo !== -1){this.clearAllBoard();}
  currentRunningAlgorithm = 1;

  for(let row=0;row<no_of_rows;row++)
  {
    for(let col=0;col<no_of_columns;col++)
    {
      let currentHTMLNode=document.getElementById(`node-${row}-${col}`);
      if(currentStatus[row][col] === "animated"  || currentStatus[row][col] === "animated-shortest-path")
      {
      currentHTMLNode.className='node';
      currentStatus[row][col]="normal";
      }  
    }
  }
 


  const {grid}=this.state;
  const startNode=grid[startNodeRow][startNodeCol];
  const finishNode=grid[finishNodeRow][finishNodeCol];
  const visitedNodesInOrder = bidirectional(grid, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrderBidirectional(finishNode);
  this.animateBidirectional(visitedNodesInOrder,nodesInShortestPathOrder);
  
  
  
  document.getElementById(`node-${startNodeRow}-${startNodeCol}`).className="node node-start";
  document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`).className="node node-finish";


  currentAlgo = 6;
} 




StairCaseRepresentation()
{

  if(currentRunningAlgorithm === 1){return;}
  this.clearAllBoard();
  this.clearAllWall();
  const {grid} = this.state;
  let nodeToAnimate = [];
  let currentIdX = no_of_rows - 1;
  let currentIdY = 0;
  var node = grid[currentIdX][currentIdY];

  while (currentIdX > 0 && currentIdY < no_of_columns) {
    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";
    
    node = grid[currentIdX][currentIdY];
    nodeToAnimate.push(node);

    currentIdX--;
    currentIdY++;
  }
   
  while (currentIdX < no_of_rows - 2 && currentIdY < no_of_columns){
    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";
    
    node = grid[currentIdX][currentIdY];
    nodeToAnimate.push(node);

    currentIdX++;
    currentIdY++;
  }

  while (currentIdX > 0 && currentIdY < no_of_columns - 1){
    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";
   
    node = grid[currentIdX][currentIdY];
    nodeToAnimate.push(node);

    currentIdX--;
    currentIdY++;
  }

  this.printWalls(nodeToAnimate);

};




printWalls(visitedNodesInOrder) {

  const {grid} = this.state;
  let node;
  for(let i = 0; i < visitedNodesInOrder.length; i++) {
    
    
    node = visitedNodesInOrder[i];
    const newGrid = getNewGridWithWallToggled(this.state.grid, node.row, node.col);
    this.setState({grid: newGrid});

    setTimeout(() => {
    let node = visitedNodesInOrder[i];  
    currentStatus[node.row][node.col]="wall";  
    document.getElementById(`node-${node.row}-${node.col}`).className =
    'node node-wall';
    }, 10*i);
}
};







HorizontalMaze()
{
  
  if(currentRunningAlgorithm === 1){return;}
  this.clearAllBoard();
  this.clearAllWall();

  let currentIdX,currentIdY,dec;

  for(let i=0;i<6;i++)
  {
   if(i==0){currentIdX=2;currentIdY=2;dec=0;}
   if(i==1){currentIdX=6;currentIdY=6;dec=2;}
   if(i==2){currentIdX=10;currentIdY=6;dec=7;}
   if(i==3){currentIdX=15;currentIdY=10;dec=7;}
   if(i==4){currentIdX=19;currentIdY=10;dec=3;}
   if(i==5){currentIdX=no_of_rows-1;currentIdY=6;dec=2;}

   while(currentIdY<no_of_columns-dec)
   {
    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";
    
    const newGrid = getNewGridWithWallToggled(this.state.grid, currentIdX, currentIdY);
    this.setState({grid: newGrid});

    currentIdY++;
   }
  }




let currentIdX1,currentIdY1,uptoi,uptoj;

for(let k=0;k<5;k++)
{
  if(k==0){currentIdX1=3;currentIdY1=6;uptoi=14;uptoj=2;}
  if(k==1){currentIdX1=7;currentIdY1=6;uptoi=14;uptoj=2;}
  if(k==2){currentIdX1=11;currentIdY1=10;uptoi=12;uptoj=3;}
  if(k==3){currentIdX1=16;currentIdY1=10;uptoi=12;uptoj=2;}
  if(k==4){currentIdX1=20;currentIdY1=10;uptoi=13;uptoj=2;}


  for(let i=0;i<uptoi;i++)
  {
    currentIdY=currentIdY1+4*i;
    for(let j=0;j<uptoj;j++)
    {
    currentIdX=currentIdX1+j;

    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";
    
    
    const newGrid = getNewGridWithWallToggled(this.state.grid, currentIdX, currentIdY);
    this.setState({grid: newGrid});
    }
   }
  }
   
 

for(let k=0;k<5;k++)
{
  
  if(k==0){currentIdX1=4;currentIdY1=8;uptoi=13;uptoj=2;}
  if(k==1){currentIdX1=8;currentIdY1=8;uptoi=12;uptoj=2;}
  if(k==2){currentIdX1=12;currentIdY1=12;uptoi=11;uptoj=3;}
  if(k==3){currentIdX1=17;currentIdY1=12;uptoi=11;uptoj=2;}
  if(k==4){currentIdX1=21;currentIdY1=12;uptoi=12;uptoj=2;}

  for(let i=0;i<uptoi;i++)
  {
    currentIdY=currentIdY1+4*i;

    for(let j=0;j<uptoj;j++)
    {
    currentIdX=currentIdX1+j;

    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";

    const newGrid = getNewGridWithWallToggled(this.state.grid, currentIdX, currentIdY);
    this.setState({grid: newGrid});
    }
   }
}
   
  currentIdX=3;currentIdY=2;
  for(let k=0;k<5;k++)
  {
    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";

    const newGrid = getNewGridWithWallToggled(this.state.grid, currentIdX, currentIdY);
    this.setState({grid: newGrid});
    currentIdX++;
  }


   currentIdX=13;currentIdY=55;
   for(let k=0;k<6;k++)
   {
    let currentId = `node-${currentIdX}-${currentIdY}`;
    let currentHTMLNode = document.getElementById(currentId);
    currentStatus[currentIdX][currentIdY] = "wall";

    const newGrid = getNewGridWithWallToggled(this.state.grid, currentIdX, currentIdY);
    this.setState({grid: newGrid});
    currentIdY++;

   }
  };


  refresh(){
    window.location.reload(false);
  }


  recursive(){
    
    let nodeToAnimate = [];
    recursiveDivisionMaze1(2, no_of_rows - 3, 2, no_of_columns - 3, "horizontal", false, "wall", nodeToAnimate);
    this.printWalls(nodeToAnimate);
  }


  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
<body>


<ReactBootStrap.Navbar collapseOnSelect expand="lg" variant="dark" id="navbar">
  <ReactBootStrap.Navbar.Brand href="pathFinder" id="header" onClick={() => this.refresh()}>PATHFINDING VISUALIZER</ReactBootStrap.Navbar.Brand>
  <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
    <ReactBootStrap.Nav className="mr-auto">
      <ReactBootStrap.Nav.Link href="#clearBoard" id="content" onClick={() => this.clearAllBoard()}>CLEAR BOARD</ReactBootStrap.Nav.Link>
      <ReactBootStrap.Nav.Link href="#clearWalls" id="content" onClick={() => this.clearAllWall()}>CLEAR WALLS</ReactBootStrap.Nav.Link>

      <ReactBootStrap.NavDropdown title="ALGORITHMS" id="collasible-nav-dropdown">
        <ReactBootStrap.NavDropdown.Item href="#action/3.1" id="dropdown-content" onClick={() => this.visualizeDjisktra()}>DIJSKTRA</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/3.2" id="dropdown-content" onClick={() => this.visualizeAstar()}>A-STAR SEARCH</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/3.3" id="dropdown-content" onClick={() => this.visualizeBidirectional()}>BIDIRECTIONAL</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/3.4" id="dropdown-content" onClick={() => this.visualizeBfs()}>BFS</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/3.5" id="dropdown-content" onClick={() => this.visualizeDfs()}>DFS</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/3.6" id="dropdown-content" onClick={() => this.visualizeBdfs()}>BEST-FIRST</ReactBootStrap.NavDropdown.Item>
      </ReactBootStrap.NavDropdown>
      
      <ReactBootStrap.NavDropdown title="MAZE  &  PATTERNS" id="collasible-nav-dropdown">
        <ReactBootStrap.NavDropdown.Item href="#action/4.1" id="dropdown-content" onClick={() => this.StairCaseRepresentation()}>STAIR CASE</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/4.2" id="dropdown-content" onClick={() => this.HorizontalMaze()}>HORIZONTAL-VERTICAL</ReactBootStrap.NavDropdown.Item>
      </ReactBootStrap.NavDropdown>


      <ReactBootStrap.NavDropdown title="SPEED" id="collasible-nav-dropdown">
        <ReactBootStrap.NavDropdown.Item href="#action/5.1" id="dropdown-content" onClick={() => this.adjustNormal()}>NORMAL</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/5.2" id="dropdown-content" onClick={() => this.adjustSlow()}>SLOW</ReactBootStrap.NavDropdown.Item>
        <ReactBootStrap.NavDropdown.Item href="#action/5.2" id="dropdown-content" onClick={() => this.adjustFast()}>FAST</ReactBootStrap.NavDropdown.Item>
      </ReactBootStrap.NavDropdown>

      <ReactBootStrap.Nav.Link href="#shortestPath" id="content" onClick={() => this.showOnlyShortestPath()}>ONLY SHORTEST PATH</ReactBootStrap.Nav.Link>
    
    </ReactBootStrap.Nav>
    <ReactBootStrap.Nav>
    </ReactBootStrap.Nav>
  </ReactBootStrap.Navbar.Collapse>
</ReactBootStrap.Navbar>

<div class="container-fluid">
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>

        </body>  
      </>
    );
  }
}



const getInitialGrid=()=>{
    const grid=[];
    for(let row=0;row<no_of_rows;row++)
    {
        const currentRow=[];
        for(let col=0;col<no_of_columns;col++)
        {
            let track=0;
            currentRow.push(createNode(col,row));
            if(row === startNodeRow && col === startNodeCol)
            {
              currentStatus[row][col]="start";
              track++;
            }
            if(row === finishNodeRow && col === finishNodeCol && track !== 1)
            {
              currentStatus[row][col]="target";
              track++;
            }
            if(track !== 1)
            {
            currentStatus[row][col]="normal";
            }
        }
        grid.push(currentRow);
    }
    return grid;
};


const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      totalDistance : Infinity,
      heuristicDistance : null,
      direction : null,
      storedDirection  : null,
      weight : 0,
      path : null,
    };
  };


  const getNewGridWithoutWallToggled = (grid, row, col)=>{
    
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }


  const clearTheWall = (grid,row,col) => {
    
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isVisited: node.isVisited,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  export const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    
    
    newGrid[row][col] = newNode;
    return newGrid;
  };


  