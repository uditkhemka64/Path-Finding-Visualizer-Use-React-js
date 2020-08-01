
export function getHeight()
{
var viewportwidth;
var viewportheight;
var array = [];  
  
if (typeof window.innerWidth != 'undefined')
{
      viewportwidth = window.innerWidth;
      viewportheight = window.innerHeight;
}
  
 
else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
{
      viewportwidth = document.documentElement.clientWidth;
      viewportheight = document.documentElement.clientHeight;
} 
else
{
      viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
      viewportheight = document.getElementsByTagName('body')[0].clientHeight;
}

array.push(viewportwidth);
array.push(viewportheight);

return array;
}