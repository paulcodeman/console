function console(object)
{
  // default variable init
  var globalThis = this; // pointer on the object
  var arrayPosition = [];
  var backPosition = null;
  var currentPosition = 0;
  var blockConsole = false;

  var nullSymbol = document.createElement('DIV');
  nullSymbol.className = "symbol right";
  object.appendChild(nullSymbol);

  backPosition = nullSymbol;
  // ---

  // functions for addition symbols in console
  function insertAfter(elem, refElem) 
  {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
  }
  function sym(s)
  {
    if(s.length > 1) return false;
    if(s == ' ') return '&nbsp;';
    return s;
  }
  // ---

  // prototypes for constructor
  this.getText = function() // get full text console
  {
    return object.innerText;
  }
  this.input = null; // event input
  this.exit = function()
  {
    blockConsole = true;
  }
  this.clear = function()
  {
    object.innerHTML = '';
    arrayPosition = [];
    backPosition = null;
    currentPosition = 0;
    blockConsole = false;

    nullSymbol = document.createElement('DIV');
    nullSymbol.className = "symbol right";
    object.appendChild(nullSymbol);

    backPosition = nullSymbol;
  }
  this.print = function(text) // print text console
  {
    if(blockConsole) return false;
    for(var i = 0; i < text.length; i++)
    {

      var s = text.charAt(i);
      if(s == "\r") 
      {
        var o = document.createElement('BR');
        object.appendChild(o);
      }
      else 
      {
        var o = document.createElement('DIV');
        o.className = "symbol";
        o.innerHTML = sym(text.charAt(i));
        object.appendChild(o);
      }
    }
    nullSymbol.className = "symbol";
    nullSymbol = document.createElement('DIV');
    nullSymbol.className = "symbol right";
    object.appendChild(nullSymbol);
    backPosition.className = "symbol";
    backPosition = nullSymbol;
    arrayPosition = [];
    currentPosition = 0;
    return true;
  }
  // ---

  // handlers console
  window.addEventListener("keypress",function(event)
  {
    if(blockConsole) return false;
    var s = sym(event.key);
    if(!s) return;

    var o = document.createElement("DIV");
    o.className = "symbol right";
    o.innerHTML = s;

    if(backPosition != null) backPosition.className = "symbol";

    if(currentPosition) insertAfter(o, arrayPosition[currentPosition - 1]);
    else object.insertBefore(o, backPosition);

    backPosition = o;
    arrayPosition.splice(currentPosition++,0,o);
  });

  window.addEventListener("keydown",function(event)
  {
    //alert(event.keyCode);
    if(blockConsole) return false;
    switch(event.keyCode)
    {
      case 8: // delete
        if(currentPosition > 1)
        {
          object.removeChild(arrayPosition[--currentPosition]);
          backPosition = arrayPosition[currentPosition - 1];
          arrayPosition.splice(currentPosition, 1);
          arrayPosition[currentPosition-1].className = "symbol right";
        }
        else if(currentPosition == 1 && arrayPosition.length == 1)
        {
          object.removeChild(arrayPosition[0]);
          nullSymbol.className = "symbol right";
          arrayPosition = [];
          currentPosition = 0;
          backPosition = nullSymbol;
        }
        else if(currentPosition == 1)
        {
          object.removeChild(arrayPosition[0]);
          arrayPosition.splice(0,1);
          arrayPosition[0].className = "symbol left";
          currentPosition = 0;
          backPosition = arrayPosition[0];
        }
      break;
      case 13: // enter
        backPosition.className = "symbol";
        var o = document.createElement("BR");
        object.appendChild(o);
        object.removeChild(nullSymbol);
        nullSymbol = document.createElement('DIV');
        nullSymbol.className = "symbol right";
        object.appendChild(nullSymbol);

        if(globalThis.input != null)
        {
          var text = '';
          for(key in arrayPosition)
          {
            var symbolNode = arrayPosition[key];
            text += symbolNode.innerText;
          }
          globalThis.input(text);
        }

        arrayPosition = [];
        currentPosition = 0;
        backPosition = nullSymbol;
        object.scrollTop = 9999;
      break;
      case 37: // left
        if(currentPosition)
        {
          arrayPosition[--currentPosition].className = "symbol";
          if(!currentPosition) 
          {
            backPosition = arrayPosition[0];
            backPosition.className = "symbol left";
          }
          else
          {
            backPosition = arrayPosition[currentPosition - 1];
            backPosition.className = "symbol right";
          }
        }
      break;
      case 39: // right
        if(currentPosition < arrayPosition.length)
        {
          if(currentPosition) arrayPosition[currentPosition - 1].className = "symbol";
          backPosition = arrayPosition[currentPosition++];
          backPosition.className = "symbol right";
        }
      break;
    }
  });
}