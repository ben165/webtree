const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;


// update canvas size when window size changes
function updateCanvasDim() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	skipAnimation();
}

window.addEventListener("resize", updateCanvasDim);

// radius of the drawn nodes in pixels
const size = 20;

// speed controls of the animation
const cPercent = 0.6;
const cSpeed = 0.04;

// update Height property of a single node
function updateHeight(x) {
	x.height = 1 + Math.max(x.l.height, x.r.height);
}

// returns the next child on the longesth path to a leaf
function longestChild(x) {
	if (x.r.height > x.l.height) {
		return x.r;
	}
	else {
		return x.l;
	}
}

// getting a random integer betwenn to numbers
function randInt(min, max) {
	return min + Math.floor((max - min + 1) * Math.random());
}

// the magic of the avl tree
// to understand the code one needs to know the avl tree algorithm
function nodeRotate(x) {
	// x, y, z are the nodes to rotate
	let y = longestChild(x);
	let z = longestChild(y);
	// posX, posY, posZ are the current positions of x, y, z in the tree
	let posX = getPos(x);
	let posY = getPos(y);
	let posZ = getPos(z);
	let newNode = new Node(x.value);
	let top = [];
	// Create frames for tree above x
	if (x.p !== null) {
		if (x.p.l === x) {
			x.p.l = new Node(null);
			top.push(new NodeFrame(root, [0, 0]));
			x.p.l = x;
		}
		else {
			x.p.r = new Node(null);
			top.push(new NodeFrame(root, [0, 0]));
			x.p.r = x;
		}
	}
	// LL rotation
	if (x.value > y.value && y.value > z.value) {
		// untangle subtrees
		x.l = new Node(null);
		yR = y.r;
		y.r = new Node(null);

		// create NodeFrames for untangled subtrees
		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameYR = new NodeFrame(yR, posRight(posY), "#FCDB23");

		// Change the NodeFrames according the neccessary animation and store them for playback
		frameX = frameX.setDest(posRight(posX));
		frameY = frameY.copy();
		frameYR = frameYR.copy();
		let all = top.concat([frameX, frameY, frameYR])
		frames.add(all);

		// Change the NodeFrames according the neccessary animation and store them for playback
		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameYR = frameYR.setDest(posLeft(posRight(posX)));
		all = top.concat([frameX, frameY, frameYR])
		frames.add(all);

		// Change the NodeFrames according the neccessary animation and store them for playback
		frameX = frameX.copy();
		frameY = frameY.setDest(posX);
		frameYR = frameYR.getEndFrame();
		all = top.concat([frameX, frameY, frameYR])
		frames.add(all);

		// reattach the subtees to the new position
		newNode.l = yR;
		newNode.l.p = newNode;

		newNode.r = x.r;
		newNode.r.p = newNode;

		x.value = y.value;
		x.l = z;
		x.l.p = x;

		x.r = newNode;
		x.r.p = x;

		// add NodeFrame of new tree
		frames.add([new NodeFrame(root, [0, 0])]);
	}
	// LR rotation
	else if (x.value > y.value && y.value < z.value) {
		// untangle subtrees
		let posZL = getPos(z.l);
		let posZR = getPos(z.r);
		x.l = new Node(null);
		y.r = new Node(null);
		zL = z.l;
		z.l = new Node(null);
		zR = z.r;
		z.r = new Node(null);

		// create NodeFrames for untangled subtrees
		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameZ = new NodeFrame(z, posZ, "#FCDB23");
		let frameZL = new NodeFrame(zL, posZL, "#FC23B5");
		let frameZR = new NodeFrame(zR, posZR, "#3622F2");

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.setDest(posRight(posX));
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		let all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameZ = frameZ.setDest(posX);
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.getEndFrame();
		frameZL = frameZL.copy();
		frameZR = frameZR.setDest(posLeft(posRight(posX)));
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.setDest(posZ);
		frameZR = frameZR.getEndFrame();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// reattach the subtees to the new position
		newNode.l = zR;
		newNode.l.p = newNode;
		newNode.r = x.r;
		newNode.r.p = newNode;
		newNode.p = x;

		x.value = z.value;
		x.r = newNode;
		x.l = y;

		y.r = zL;
		y.r.p = y;

		// add NodeFrame of new tree
		frames.add([new NodeFrame(root, [0, 0])]);
	}
	// RR rotation
	else if (x.value < y.value && y.value < z.value) {
		// untangle subtrees
		x.r = new Node(null);
		yL = y.l;
		y.l = new Node(null);

		// create NodeFrames for untangled subtrees
		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameYL = new NodeFrame(yL, posLeft(posY), "#FCDB23");

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.setDest(posLeft(posX));
		frameY = frameY.copy();
		frameYL = frameYL.copy();
		let all = top.concat([frameX, frameY, frameYL])
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameYL = frameYL.setDest(posRight(posLeft(posX)));
		all = top.concat([frameX, frameY, frameYL])
		frames.add(all);


		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.copy();
		frameY = frameY.setDest(posX);
		frameYL = frameYL.getEndFrame();
		all = top.concat([frameX, frameY, frameYL])
		frames.add(all);


		// reattach the subtees to the new position
		newNode.l = x.l;
		newNode.r = yL;

		x.value = y.value;
		x.l = newNode;
		x.r = y.r;

		newNode.p = x;
		newNode.l.p = newNode;
		newNode.r.p = newNode;
		z.p = x;

		// add NodeFrame of new tree
		frames.add([new NodeFrame(root, [0, 0])]);
	}
	// RL roatation
	else if (x.value < y.value && y.value > z.value) {
		// untangle subtrees
		let posZL = getPos(z.l);
		let posZR = getPos(z.r);
		x.r = new Node(null);
		y.l = new Node(null);
		zL = z.l;
		z.l = new Node(null);
		zR = z.r;
		z.r = new Node(null);

		// create NodeFrames for untangled subtrees
		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameZ = new NodeFrame(z, posZ, "#FCDB23");
		let frameZL = new NodeFrame(zL, posZL, "#FC23B5");
		let frameZR = new NodeFrame(zR, posZR, "#3622F2");

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.setDest(posLeft(posX));
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		let all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameZ = frameZ.setDest(posX);
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.getEndFrame();
		frameZL = frameZL.setDest(posRight(posLeft(posX)));
		frameZR = frameZR.copy();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// Change the NodeFrames according the necessary animation and store them for playback
		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.getEndFrame();
		frameZR = frameZR.setDest(posZ);
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		// reattach the subtees to the new position
		newNode.r = zL;
		newNode.r.p = newNode;
		newNode.l = x.l;
		newNode.l.p = newNode;
		newNode.p = x;

		x.value = z.value;
		x.l = newNode;
		x.r = y;

		y.l = zR;
		y.l.p = y;

		// add NodeFrame of new tree
		frames.add([new NodeFrame(root, [0, 0])]);
	}
	// update heights after rotation
	updateHeight(newNode);
	updateHeight(y);
	updateHeight(z);
	updateHeight(x);
}

// calculate pixel coordinates from a position
function cordinates(pos) {
	let x = width * (pos[1] + 0.5) / Math.pow(2, pos[0]);
	let y = 40 + 60 * pos[0];
	return [x, y];
}

// draw node to the canvas
function drawPartNode(node, part, oldPos, newPos) {
	let c0 = cordinates(oldPos);
	let c1 = cordinates(newPos);

	let x = c0[0] + part * (c1[0] - c0[0]);
	let y = c0[1] + part * (c1[1] - c0[1]);

	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.strokeStyle = node.color;
	ctx.arc(x, y, size, 0, 2 * Math.PI);

	ctx.stroke();
	ctx.strokeStyle = "black";

	ctx.font = "16px serif";
	let s = (node.value).toString();
	let len = ctx.measureText(s);
	ctx.fillText(s, x - Math.floor(len.width / 2), y + 4);

	return [x, y];
}

// draw line between nodes to the canvas
function drawLine(c1, c2) {
	let x1 = c1[0];
	let x2 = c2[0];
	let y1 = c1[1];
	let y2 = c2[1];

	let l = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	let c = size / l;

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x1 + c * (x2 - x1), y1 + c * (y2 - y1));
	c = (l - size) / l;
	ctx.lineTo(x1 + c * (x2 - x1), y1 + c * (y2 - y1));
	ctx.stroke();
}


// get position of left node from position of current node
function posLeft(pos) {
	return [pos[0] + 1, 2 * pos[1]];
}

// get position of right node from position of current node
function posRight(pos) {
	return [pos[0] + 1, 2 * pos[1] + 1];
}

// get position of parent node from position of current node
function posUp(pos) {
	if (pos[0] === 0) {
		return null;
	}
	else {
		return [pos[0] - 1, Math.floor(0.5 * pos[1])]
	}
}

// get position from node object relative to root node
function getPos(node) {
	let k = 0;
	let l = 0;
	let pp = 1;
	let v = node;
	while (v.p !== null) {
		k += 1;
		if (v.p.r === v) {
			l += pp;
		}
		pp *= 2;
		v = v.p;
	}
	return [k, l];
}

// the class for storing the binary tree
class Node {
	// properties:
	// this.l: left Node
	// this.r: right Node
	// this.height: height of subtree starting form node this
	// this.p: parent Node
	// this.color: the color for canvas drawing

	// we assume that we only create nodes from number values
	constructor(value) {
		this.value = value;
		if (this.value !== null) {
			this.height = 1;
			// create dummy Nodes
			this.l = new Node(null);
			this.r = new Node(null);
			this.l.height = 0;
			this.r.height = 0;
			this.l.p = this;
			this.r.p = this;
			this.color = "black";
		}
		else {
			this.height = 0;
		}
		this.p = null;
	}

	// a complete, indepenent copy of the subtree starting from this
	copy() {
		let cpy = new Node(this.value);
		cpy.height = this.height;
		if (this.value !== null) {
			cpy.color = this.color;
			cpy.l = this.l.copy();
			cpy.l.p = cpy;
			cpy.r = this.r.copy();
			cpy.r.p = cpy;
		}
		return cpy;
	}

	// returns next node on the path to the value 
	next(value) {
		if (value < this.value) {
			return this.l;
		}
		else {
			return this.r;
		}
	}

	// inserting new value, and therefor new node into the tree
	insert(newValue) {
		// recursive insertion
		if (this.value === null) {
			this.value = newValue;
			this.height = 1;
			// create dummy Nodes
			this.l = new Node(null);
			this.r = new Node(null);
			this.l.height = 0;
			this.r.height = 0;
			this.l.p = this;
			this.r.p = this;
			// highlight insertion
			frames.add([newHighlightFrame(root, [0, 0], "red", this)]);

		}
		else if (this.value !== newValue) {
			// highlight node on path to insertion
			frames.add([newHighlightFrame(root, [0, 0], "red", this)]);
			// insert into subtree recursively
			this.next(newValue).insert(newValue);
			updateHeight(this);
			frames.add([new NodeFrame(root, [0, 0])]);
			// we check whether tree is unbalanced after insertion
			if (1 < Math.abs(this.r.height - this.l.height)) {
				// correct balance
				nodeRotate(this);
			}
		}
		else if (this.value === newValue) {
			frames.add([newHighlightFrame(root, [0, 0], "red", this)]);
		}
	}

	// returns node with corresponding value if it exists
	find(value) {
		if (this.value === null) {
			return null;
		}
		else if (this.value === value) {
			return this;
		}
		else {
			let x = this.next(value);
			return x.find(value);
		}
	}

	// draws the animation of the subtree of this onto the canvas by specifying the positions
	drawPart(part, oldPos, newPos) {
		let cParent = null;
		if (this.value !== null) {
			cParent = drawPartNode(this, part, oldPos, newPos);
			let cChild = null;
			if (this.l.value !== null) {
				cChild = this.l.drawPart(part, posLeft(oldPos), posLeft(newPos));
				drawLine(cParent, cChild);
			}
			if (this.r.value !== null) {
				cChild = this.r.drawPart(part, posRight(oldPos), posRight(newPos));
				drawLine(cParent, cChild);
			}
		}
		return cParent;
	}

	//testing node and below for correctness
	correct() {
		if (this.value === null) {
			return true;
		}
		else {
			if (this.l.p !== this) { console.log(1, this); return false; }
			if (this.r.p !== this) { console.log(2, this); return false; }
			if (this.l.value !== null && this.l.value >= this.value) { console.log(3, this); return false; }
			if (this.r.value !== null && this.r.value <= this.value) { console.log(4, this); return false; }
			return this.l.correct() && this.r.correct();
		}
	}

	// specifying color for node and possibly subnodes depending on bool "all"
	setColor(color, all) {
		if (this.value !== null) {
			this.color = color;
			if (all) {
				this.l.setColor(color, all);
				this.r.setColor(color, all);
			}
		}
	}
}

//for testing purposes that the binary tree is correct
let testStore = [];
function testCorrect(place, node) {
	let sample = node.copy();
	testStore.push(sample);
	if (!node.correct()) {
		console.log(place, testStore.length - 1, sample);
		return false;
	}
	return true;
}

// the class for storing single animations and drawings onto the canvas
class NodeFrame {
	// properties:
	// this.node: the subtree to draw
	// this.oldPos: at the start the subtreee should be drawn here
	// this.endPos: at the end the subtreee should be drawn here
	// this.x: percentage number at which the animation is currently,
	//		   if this.x === 1 is true the animation is complete
	// this.start: percentage number at which the animation starts


	constructor(node, oldPos, color) {
		this.node = node.copy();
		this.start = 1;
		this.oldPos = [oldPos[0], oldPos[1]];
		this.newPos = [oldPos[0], oldPos[1]];
		this.x = 1;
		if (color !== undefined) this.node.setColor(color, true);
	}

	// depending on the progress of this.x a different picture is drawn onto the canvas
	drawNext() {
		this.node.drawPart(this.x, this.oldPos, this.newPos);
		if (this.x >= 1 || this.node.value === null) {
			// here the animation
			this.x = 1;
			return true;
		}
		else {
			// move this.x closer to completion
			this.x += cSpeed;;
			return false;
		}
	}

	// make complete, independent copy fo the this
	copy() {
		let nodeFrame = new NodeFrame(this.node, this.oldPos);
		nodeFrame.start = this.start;
		nodeFrame.x = this.x;
		nodeFrame.oldPos = [this.oldPos[0], this.oldPos[1]];
		nodeFrame.newPos = [this.newPos[0], this.newPos[1]];
		return nodeFrame;
	}

	// returns static nodeFrame from last picture of this
	getEndFrame() {
		let nodeFrame = this.copy();
		nodeFrame.x = nodeFrame.start = 1;
		nodeFrame.oldPos = [this.newPos[0], this.newPos[1]];
		return nodeFrame;
	}

	// returns identical nodeFrame, except with a new destination
	setDest(newPos) {
		let nodeFrame = this.copy();
		nodeFrame.x = 0;
		nodeFrame.start = 0;
		nodeFrame.newPos = [newPos[0], newPos[1]];
		return nodeFrame;
	}
}

// a "second" constructor for highlighting single nodes
// displays a static picture onto the canvas
function newHighlightFrame(baseNode, pos, color, node) {
	let nodeFrame = new NodeFrame(baseNode, pos, color);
	nodeFrame.x = nodeFrame.start = 0;
	nodeFrame.node.setColor("black", true);
	let x = nodeFrame.node.find(node.value);
	x.color = color;
	return nodeFrame;
}

// container for all Node Frames
class Frames {
	// this.frames: array of arrays of nodeFrames
	// this.play: bool for animation currently playing
	// this.current: index of the nodeFrame currently animating
	// this.cardinality: lenght of the array this.frames

	// empty
	constructor() {
		this.frames = [];
		this.play = false;
		this.current = 0;
		this.cardinality = 0;
	}

	// stopping animation
	stop() {
		this.play = false;
	}

	// play/continue animation
	async go() {
		if (this.play === false) {
			this.play = true;
			while (this.current < this.cardinality) {
				await this.draw(this.current);
				if (this.play === true) {
					this.current += 1;
				}
				else {
					break;
				}
			}
			this.play = false;
		}
	}

	// add new array of nodeFrames to queue
	add(frame) {
		this.frames.push(frame);
		this.cardinality += 1;
	}

	// draw only the i-th element of this.frames
	draw(i) {
		// because drawing onto the canvas happens asynchronously return Promise
		// this is necessary, otherwise different nodeFrames try to paint the canvas at the same thime 
		return new Promise((resolve, reject) => {
			let loop = () => {
				let finished = true;
				if (this.play === true) {
					ctx.clearRect(0, 0, width, height);

					for (let j = 0; j < this.frames[i].length; j++) {
						let r = this.frames[i][j].drawNext();
						finished = finished && r;
					}
				}
				else {
					resolve();
					return;
				}
				if (!finished) {
					// draw next picture onto the canvas
					requestAnimationFrame(loop);
				}
				else {
					setTimeout(() => { resolve(); }, 400);
				}
			};
			loop();
		})
	}
}

// frames stores the animation
let frames = new Frames();
// root stores the tree
let root = new Node(null);

const insertField = document.getElementById("inputField");
const insertButton = document.getElementById("insertButton");
const randomField = document.getElementById("randomField");
const randomButton = document.getElementById("randomButton");
const clearButton = document.getElementById("clearButton");
const toggleBox = document.getElementById("toggleAnimation");

// starting configuration
insertField.value = "";
insertButton.disabled = true;
randomField.value = "";
randomButton.disabled = true;
toggleBox.checked = true;

insertButton.addEventListener('click', handleInsert);
randomButton.addEventListener('click', handleRandom);
clearButton.addEventListener('click', handleClear);
toggleBox.addEventListener('click', handleToggle);
insertField.addEventListener('input', verifyInsertField);
randomField.addEventListener('input', verifyRandomField);

// regular expressions for text input
const reInsert = /^\s*(\d|\d\d|\d\d\d)(\s+(\d|\d\d|\d\d\d))*\s*$/;
const reRandom = /^\s*([1-9]|(1|2)\d|30)\s*$/;

// verifying input against regular expressions
function verifyInsertField(){
	if(reInsert.test(insertField.value)){
		insertField.style.color = "green";
		insertButton.disabled = false;
	}
	else{
		insertField.style.color = "red";
		insertButton.disabled = true;
	}
}

// verifying input against regular expressions
function verifyRandomField(){
	if(reRandom.test(randomField.value)){
		randomField.style.color = "green";
		randomButton.disabled = false;
	}
	else{
		randomField.style.color = "red";
		randomButton.disabled = true;
	}
}

// setting animations accoring to checkbox 
function animate(){
	if (toggleBox.checked === true) {
		frames.go();
	}
	else {
		skipAnimation();
	}
}

// inserting values from input into tree and play animation
function handleInsert() {
	let arr = insertField.value.split(/\s+/);
	for (let x of arr){
		root.insert(parseInt(x));
	}
	animate();
	insertField.value = "";
	insertField.focus();
	insertButton.disabled = true;	
}

// delete whole tree
function handleClear() {
	root = new Node(null);
	frames.stop();
	frames.frames = [];
	frames.current = 0;
	frames.cardinality = 0;
	ctx.clearRect(0, 0, width, height);
}

// inserting random numbers into tree
function handleRandom() {
	let x = parseInt(randomField.value);
	for (let i = 0; i < x; i++) {
		let r = randInt(0, 999);
		root.insert(r);
	}
	animate();
}

// go directly to end of animation
function skipAnimation() {
	if (frames.cardinality !== 0) {
		frames.stop();
		frames.current = frames.cardinality - 1;
		setTimeout(() => { frames.go(); }, 100);
	}
}

// switch animation accoring to checkbox
function handleToggle() {
	if (toggleBox.checked === false) {
		skipAnimation();
	}
}

