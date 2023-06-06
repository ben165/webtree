class Node {
	constructor(value) {
		this.value = value;
		this.l = null;
		this.r = null;
	}
	x = -1;
	y = -1;
	width = -1;
}

class Stepper {
	constructor(root) {
		this.node = root;
		this.list1 = [];
	}
}


// Display functions for the HTML site
function plotTree() {
	amount = Number(document.getElementById("amountInts").value);

	root = TreeFunctions.createTree(amount);
	list1 = []
	TreeFunctions.cleanup(root);

	TreeFunctions.posSet2(root, 700, 0, 700);

	// waagrechter Plot
	list1 = [];
	TreeFunctions.plot2(root, list1)
	document.getElementById("plot2").innerHTML = list1.join("");

	stepper = new Stepper(root);

	// alter Plot
	//TreeFunctions.plot(root, 0, list1)
	//console.log( list1.join("") )
	//document.getElementById("plot").innerHTML = list1.join("");

	//console.log("Amount Nodes:\n")
	//console.log( TreeFunctions.amount(root) )
	document.getElementById("amount").innerHTML = TreeFunctions.amount(root);
	
	//console.log("Max Depth:\n")
	//console.log( TreeFunctions.depth(root) )
	document.getElementById("tiefe").innerHTML = TreeFunctions.depth(root);
	
	//console.log("IN-ORDER:\n")
	list1 = []
	TreeFunctions.inorder(root, list1)
	//console.log( list1 )
	document.getElementById("infix").innerHTML = list1.join(", ");
	
	//console.log("\nPRE-ORDER:\n")
	list1 = []
	TreeFunctions.preorder(root, list1)
	//console.log( list1 )
	document.getElementById("prefix").innerHTML = list1.join(", ");
	
	//console.log("\nPOST-ORDER:\n")
	list1 = []
	TreeFunctions.postorder(root, list1)
	//console.log( list1 )
	document.getElementById("postfix").innerHTML = list1.join(", ");
	
	//console.log("\nBreitensuche:\n")
	list1 = []
	TreeFunctions.breitensuche(root, list1)
	//console.log( list1 )
	document.getElementById("breit").innerHTML = list1.join(", ");
	
	//console.log("\nTiefensuche:\n")
	list1 = []
	TreeFunctions.tiefensuche(root, list1)
	//console.log( list1 )
	document.getElementById("tief").innerHTML = list1.join(", ");
}


// Static tree functions
const TreeFunctions = {

	// How many nodes?
	amount(node) {
		if ( node == null || node.value == null) { 
			return 0; }
		else { 
			return 1 + this.amount(node.l) + this.amount(node.r); }
	},

	// Tiefensuche
	depth(node) {
		if (node == null) {
			return 0;
		} else {
				
			left = this.depth(node.l);
			right = this.depth(node.r);

			if ( left >= right ) {
				return 1+left; } 
			else {
				return 1+right; }
		}
	},

	// cleanup after iterativ creation of tree
	// removes nodes with null values
	cleanup(node) {
		if (node != null) {
			if (node.l != null && node.l.value == null) {
				node.l = null; }
			this.cleanup(node.l, list1);

			if (node.r != null && node.r.value == null) {
				node.r = null; }
			this.cleanup(node.r, list1);
		}
	},

	// Traversierung: Wanderung durch Baum verschiedene Verfahren

	// LVR Inorder
	inorder(node, list1) {
		if (node != null) { // && node.value != null
			this.inorder(node.l, list1);
			//console.log(node.value);
			list1.push(node.value);
			this.inorder(node.r, list1);
		}
	},
	
	// VLR Proorder
	preorder(node, list1) {
		if (node != null) {
			//console.log(node.value);
			list1.push(node.value);
			this.preorder(node.l, list1);
			this.preorder(node.r, list1);
		}
	},
	
	// LRV Postorder
	postorder(node, list1) {
		if (node != null) {
			this.postorder(node.l, list1);
			this.postorder(node.r, list1);
			//console.log(node.value);
			list1.push(node.value);
		}
	},

	// Breitensuche: Wanderung von links nach rechts
	breitensuche(node, list1) {
		//var temp;
		queue = [];
				
		if (node != null) { 
			queue.push( node ); }
			
		while ( queue.length != 0 ) {
			temp = queue.splice(0,1)[0];
			list1.push( temp.value );
		
			if (temp.l != null) {
				queue.push(temp.l); }
			if (temp.r != null) {
				queue.push(temp.r); }
		}
	},


	// Tiefensuche (Wanderung von oben nach unten)
	tiefensuche(node, list1) {
		stack = [];
		
		if ( node != null) {
			stack.push(node); }
		
		while ( stack.length != 0 ) {
			temp = stack.pop();
			
			list1.push( temp.value );

			if (temp.r != null) {
				stack.push(temp.r); }
			if (temp.l != null) {
				stack.push(temp.l);	}
		}
	},

	// Create a tree out of a number
	createTree(amount) {
		queue = [];
		var node = new Node(0);
		
		queue.push(node);
		
		for (i=0; i<=amount; i++) {
			// get the oldest element
			temp = queue.splice(0, 1)[0];
			temp.value = i;

			temp.l = new Node(0);
			temp.l.value = null;

			temp.r = new Node(0);
			temp.r.value = null;

			queue.push(temp.l);
			queue.push(temp.r);

		}

		return node;

	},


	// Plotten des Baumes von links nach rechts
	plot(node, tiefe, list1) {
		if (node != null) {
			++tiefe;
			this.plot(node.l, tiefe, list1);
			for (i=1; i<tiefe; i++) {
				list1.push("    "); }
			list1.push("<span class=\"treecolumn\" id=\"n" + String(node.value) + "\">" + String(node.value) + " x:" + String(node.x) + " y:" + String(node.y) + "</span>\n");
			this.plot(node.r, tiefe, list1);
		}
	},

	// Reset Stepper
	stepReset(stepper, root) {
		infixStepper.node = root;
		infixStepper.list1 = [];
	},

	// Infix Stepper
	stepInfix(infixStepper) {
		while ( infixStepper.list1.length != 0 || infixStepper.node != null ) {
			if ( infixStepper.node != null ) {
				infixStepper.list1.push( infixStepper.node )
				infixStepper.node = infixStepper.node.l;
			} 
			else {
				infixStepper.node = infixStepper.list1.pop();
				temp = infixStepper.node;
				//element = document.querySelector("n" + String(temp.value));
				document.getElementById("n" + String(temp.value) ).style.color = "red";
				infixStepper.node = infixStepper.node.r;
				return;
			}
		}
	},


	// position calculation (x,y) with depth search (not working yet!)
	posSet(node) {
		stack = [];
		
		if ( node != null) {
			stack.push(node); }
		
		while ( stack.length != 0 ) {
			temp = stack.pop();
			
			list1.push( temp.value );

			if (temp.r != null) {
				stack.push(temp.r); }
			if (temp.l != null) {
				stack.push(temp.l);	}
		}
	},


	posSet2(node, posx, posy, width) {
		if (node != null) {
			node.x = posx;
			node.y = posy;
			node.width = width;
			this.posSet2(node.l, posx - width/2, posy+20, width/2);
			this.posSet2(node.r, posx + width/2, posy+20, width/2);
		}
	},


	// Plotten des Baumes waagrecht
	plot2(node, list1) {
		if (node != null) {
			list1.push("<span class=\"tree2\" style=\"top: "+ String(node.y) +";left: "+ String(node.x) +";\" id=\"n" + String(node.value) + "\">" + String(node.value) + "</span>\n");
			this.plot2(node.l, list1);
			this.plot2(node.r, list1);
		}
	}


//	plot2(node) {
//		if (node != null) {
//			++tiefe;
//			this.plot(node.l, tiefe, list1);
//			for (i=1; i<tiefe; i++) {
//				list1.push("    "); }
//			list1.push("<span class=\"treecolumn\" id=\"n" + String(node.value) + "\">" + String(node.value) + " x:" + String(node.x) + " y:" + String(node.y) + "</span>\n");
//			this.plot(node.r, tiefe, list1);
//		}
//	},

}


/* Manually creation
var root = new Node(0);
root.l = new Node(1);
root.r = new Node(2);

root.l.l = new Node(3);
root.l.r = new Node(4);
root.r.l = new Node(5);
root.r.r = new Node(6);

root.l.l.l = new Node(7);
root.l.l.r = new Node(8);
root.l.r.l = new Node(9);
root.l.r.r = new Node(10);
root.r.l.l = new Node(11);
root.r.l.r = new Node(12);
root.r.r.l = new Node(13);
root.r.r.r = new Node(14);
*/

//TreeFunctions.ploot(root);


/*
stack = [];
stack.push(0);
stack.push(1);
stack.push(2);
stack.push(3);

stack // [0,1,2,3]
stack[2] //2

console.log( stack ) //[0,1,2,3]

stack.splice(0, 2); //return 2

stack.splice(0, 1); //entfernt Element, was als erstes eingefuegt wurde

console.log( stack ) //[2,3]
*/

//var root = TreeFunctions.createTree(10);

// no tree in the beginning.
//var root = null;



//console.log("\nPlot:\n")
//list1 = []
//TreeFunctions.plot(root, 0, list1)
//console.log( list1.join("") )
//document.getElementById("plot").innerHTML = list1.join("");
