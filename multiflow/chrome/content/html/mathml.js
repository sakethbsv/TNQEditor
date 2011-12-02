/*
    This file is part of MuLTiFlow.

    MuLTiFlow is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MuLTiFlow is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MuLTiFlow.  If not, see <http://www.gnu.org/licenses/>.
*/

function mathconvert() {

  var mmlnode = document.getElementsByTagName("math");
  for (var i=0; i<mmlnode.length; i++) {
      mmlnode[i].parentNode.replaceChild(convertMath(mmlnode[i]),mmlnode[i]);
	}
}


function convertMath(node) {

  if (node.nodeType==1) {
    var newnode = 
      document.createElementNS("http://www.w3.org/1998/Math/MathML",
        node.nodeName.toLowerCase());
   for(var i=0; i < node.attributes.length; i++) {
       if((node.attributes[i].nodeName.toLowerCase() == "mathvariant") || (node.attributes[i].nodeName.toLowerCase() == "displaystyle")) { 
	   newnode.setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
       }
   }

    for (var i=0; i<node.childNodes.length; i++) {
      var st = node.childNodes[i].nodeValue;
      if (st==null || st.slice(0,1)!=" " && st.slice(0,1)!="\n") 
        newnode.appendChild(convertMath(node.childNodes[i]));
    }
    return newnode;
  }
  else return node;
}


function svgconvert() {

  var mmlnode = document.getElementsByTagName("svg");
  for (var i=0; i<mmlnode.length; i++) {
      mmlnode[i].parentNode.replaceChild(convertSVG(mmlnode[i]),mmlnode[i]);
	}
}


function convertSVG(node) {

  if (node.nodeType==1) {
    var newnode = 
      document.createElementNS("http://www.w3.org/2000/svg",
        node.nodeName.toLowerCase());
   for(var i=0; i < node.attributes.length; i++) {
       if((node.attributes[i].nodeName.toLowerCase() == "mathvariant") || (node.attributes[i].nodeName.toLowerCase() == "displaystyle")) { 
	   newnode.setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
       }
   }

    for (var i=0; i<node.childNodes.length; i++) {
      var st = node.childNodes[i].nodeValue;
      if (st==null || st.slice(0,1)!=" " && st.slice(0,1)!="\n") 
        newnode.appendChild(convertSVG(node.childNodes[i]));
    }
    return newnode;
  }
  else return node;
}


