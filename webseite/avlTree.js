const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function updateCanvasDim() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	skipAnimation();
}

window.addEventListener("resize", updateCanvasDim);

const size = 20;
const cPercent = 0.6;
const cSpeed = 0.04;

let testStore = [];

function updateHeight(x) {
	x.height = 1 + Math.max(x.l.height, x.r.height);
}

function longestChild(x) {
	if (x.r.height > x.l.height) {
		return x.r;
	}
	else {
		return x.l;
	}
}

function randInt(min, max) {
	return min + Math.floor((max - min + 1) * Math.random());
}

function nodeRotate(x) {
	let y = longestChild(x);
	let z = longestChild(y);
	let posX = getPos(x);
	let posY = getPos(y);
	let posZ = getPos(z);
	let newNode = new Node(x.value);
	let top = [];
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
	if (x.value > y.value && y.value > z.value) {

		x.l = new Node(null);
		yR = y.r;
		y.r = new Node(null);

		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameYR = new NodeFrame(yR, posRight(posY), "#FCDB23");


		frameX = frameX.setDest(posRight(posX));
		frameY = frameY.copy();
		frameYR = frameYR.copy();
		let all = top.concat([frameX, frameY, frameYR])
		frames.add(all);

		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameYR = frameYR.setDest(posLeft(posRight(posX)));
		all = top.concat([frameX, frameY, frameYR])
		frames.add(all);

		frameX = frameX.copy();
		frameY = frameY.setDest(posX);
		frameYR = frameYR.getEndFrame();
		all = top.concat([frameX, frameY, frameYR])
		frames.add(all);

		newNode.l = yR;
		newNode.l.p = newNode;

		newNode.r = x.r;
		newNode.r.p = newNode;

		x.value = y.value;
		x.l = z;
		x.l.p = x;

		x.r = newNode;
		x.r.p = x;

		frames.add([new NodeFrame(root, [0, 0])]);
	}
	else if (x.value > y.value && y.value < z.value) {
		let posZL = getPos(z.l);
		let posZR = getPos(z.r);
		x.l = new Node(null);
		y.r = new Node(null);
		zL = z.l;
		z.l = new Node(null);
		zR = z.r;
		z.r = new Node(null);

		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameZ = new NodeFrame(z, posZ, "#FCDB23");
		let frameZL = new NodeFrame(zL, posZL, "#FC23B5");
		let frameZR = new NodeFrame(zR, posZR, "#3622F2");

		frameX = frameX.setDest(posRight(posX));
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		let all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameZ = frameZ.setDest(posX);
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.getEndFrame();
		frameZL = frameZL.copy();
		frameZR = frameZR.setDest(posLeft(posRight(posX)));
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.setDest(posZ);
		frameZR = frameZR.getEndFrame();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);


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

		frames.add([new NodeFrame(root, [0, 0])]);
	}
	else if (x.value < y.value && y.value < z.value) {
		x.r = new Node(null);
		yL = y.l;
		y.l = new Node(null);

		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameYL = new NodeFrame(yL, posLeft(posY), "#FCDB23");

		frameX = frameX.setDest(posLeft(posX));
		frameY = frameY.copy();
		frameYL = frameYL.copy();
		let all = top.concat([frameX, frameY, frameYL])
		frames.add(all);

		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameYL = frameYL.setDest(posRight(posLeft(posX)));
		all = top.concat([frameX, frameY, frameYL])
		frames.add(all);

		frameX = frameX.copy();
		frameY = frameY.setDest(posX);
		frameYL = frameYL.getEndFrame();
		all = top.concat([frameX, frameY, frameYL])
		frames.add(all);


		newNode.l = x.l;
		newNode.r = yL;

		x.value = y.value;
		x.l = newNode;
		x.r = y.r;

		newNode.p = x;
		newNode.l.p = newNode;
		newNode.r.p = newNode;
		z.p = x;

		frames.add([new NodeFrame(root, [0, 0])]);
	}
	else if (x.value < y.value && y.value > z.value) {
		let posZL = getPos(z.l);
		let posZR = getPos(z.r);
		x.r = new Node(null);
		y.l = new Node(null);
		zL = z.l;
		z.l = new Node(null);
		zR = z.r;
		z.r = new Node(null);

		let frameX = new NodeFrame(x, posX, "#E6732C");
		let frameY = new NodeFrame(y, posY, "#36A922");
		let frameZ = new NodeFrame(z, posZ, "#FCDB23");
		let frameZL = new NodeFrame(zL, posZL, "#FC23B5");
		let frameZR = new NodeFrame(zR, posZR, "#3622F2");

		frameX = frameX.setDest(posLeft(posX));
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		let all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		frameX = frameX.getEndFrame();
		frameY = frameY.copy();
		frameZ = frameZ.setDest(posX);
		frameZL = frameZL.copy();
		frameZR = frameZR.copy();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.getEndFrame();
		frameZL = frameZL.setDest(posRight(posLeft(posX)));
		frameZR = frameZR.copy();
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);

		frameX = frameX.copy();
		frameY = frameY.copy();
		frameZ = frameZ.copy();
		frameZL = frameZL.getEndFrame();
		frameZR = frameZR.setDest(posZ);
		all = top.concat([frameX, frameY, frameZ, frameZL, frameZR]);
		frames.add(all);


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

		frames.add([new NodeFrame(root, [0, 0])]);
	}
	updateHeight(newNode);
	updateHeight(y);
	updateHeight(z);
	updateHeight(x);
}

function cordinates(pos) {
	let x = width * (pos[1] + 0.5) / Math.pow(2, pos[0]);
	let y = 40 + 60 * pos[0];
	return [x, y];
}

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


function posLeft(pos) {
	return [pos[0] + 1, 2 * pos[1]];
}

function posRight(pos) {
	return [pos[0] + 1, 2 * pos[1] + 1];
}

function posUp(pos) {
	if (pos[0] === 0) {
		return null;
	}
	else {
		return [pos[0] - 1, Math.floor(0.5 * pos[1])]
	}
}

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

class Node {

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

	next(value) {
		if (value < this.value) {
			return this.l;
		}
		else {
			return this.r;
		}
	}

	insert(newValue) {
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
			frames.add([newHighlightFrame(root, [0, 0], "red", this)]);

		}
		else if (this.value !== newValue) {
			frames.add([newHighlightFrame(root, [0, 0], "red", this)]);
			this.next(newValue).insert(newValue);
			updateHeight(this);
			frames.add([new NodeFrame(root, [0, 0])]);
			if (1 < Math.abs(this.r.height - this.l.height)) {
				nodeRotate(this);
			}
		}
		else if (this.value === newValue) {
			frames.add([newHighlightFrame(root, [0, 0], "red", this)]);
		}
	}

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

	getSmallest() {
		if (this.value === null) {
			return this.p;
		}
		else {
			return this.l.getSmallest();
		}
	}

	getBiggest() {
		if (this.value === null) {
			return this.p;
		}
		else {
			return this.r.getBiggest();
		}
	}

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

function testCorrect(place, node) {
	let sample = node.copy();
	testStore.push(sample);
	if (!node.correct()) {
		console.log(place, testStore.length - 1, sample);
		return false;
	}
	return true;
}

class NodeFrame {
	constructor(node, oldPos, color) {
		this.node = node.copy();
		this.start = 1;
		this.oldPos = [oldPos[0], oldPos[1]];
		this.newPos = [oldPos[0], oldPos[1]];
		this.x = 1;
		if (color !== undefined) this.node.setColor(color, true);
	}

	drawNext() {
		this.node.drawPart(this.x, this.oldPos, this.newPos);
		if (this.x >= 1 || this.node.value === null) {
			this.x = 1;
			return true;
		}
		else {
			this.x += cSpeed;;
			return false;
		}
	}

	copy() {
		let nodeFrame = new NodeFrame(this.node, this.oldPos);
		nodeFrame.start = this.start;
		nodeFrame.x = this.x;
		nodeFrame.oldPos = [this.oldPos[0], this.oldPos[1]];
		nodeFrame.newPos = [this.newPos[0], this.newPos[1]];
		return nodeFrame;
	}

	getEndFrame() {
		let nodeFrame = this.copy();
		nodeFrame.x = nodeFrame.start = 1;
		nodeFrame.oldPos = [this.newPos[0], this.newPos[1]];
		return nodeFrame;
	}

	setDest(newPos) {
		let nodeFrame = this.copy();
		nodeFrame.x = 0;
		nodeFrame.start = 0;
		nodeFrame.newPos = [newPos[0], newPos[1]];
		return nodeFrame;
	}
}

function newHighlightFrame(baseNode, pos, color, node) {
	let nodeFrame = new NodeFrame(baseNode, pos, color);
	nodeFrame.x = nodeFrame.start = 0;
	nodeFrame.node.setColor("black", true);
	let x = nodeFrame.node.find(node.value);
	x.color = color;
	return nodeFrame;
}

class Frames {
	constructor() {
		this.frames = [];
		this.play = false;
		this.current = 0;
		this.cardinality = 0;
	}

	stop() {
		this.play = false;
	}

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

	add(frame) {
		this.frames.push(frame);
		this.cardinality += 1;
	}

	draw(i) {
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

let frames = new Frames();
let root = new Node(null);

const insertField = document.getElementById("inputField");
insertField.value = "";

const insertButton = document.getElementById("insertButton");
insertButton.disabled = true;

const randomField = document.getElementById("randomField");
randomField.value = "";
const randomButton = document.getElementById("randomButton");
randomButton.disabled = true;

const clearButton = document.getElementById("clearButton");

const toggleBox = document.getElementById("toggleAnimation");
toggleBox.checked = true;

insertButton.addEventListener('click', handleInsert);
randomButton.addEventListener('click', handleRandom);
clearButton.addEventListener('click', handleClear);
toggleBox.addEventListener('click', handleToggle);
insertField.addEventListener('input', verifyInsertField);
randomField.addEventListener('input', verifyRandomField);

const reInsert = /^\s*(\d|\d\d|\d\d\d)(\s+(\d|\d\d|\d\d\d))*\s*$/;
const reRandom = /^\s*([1-9]|(1|2)\d|30)\s*$/;

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

function animate(){
	if (toggleBox.checked === true) {
		frames.go();
	}
	else {
		skipAnimation();
	}
}

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

function handleClear() {
	root = new Node(null);
	frames.stop();
	frames.frames = [];
	frames.current = 0;
	frames.cardinality = 0;
	ctx.clearRect(0, 0, width, height);
}

function handleRandom() {
	let x = parseInt(randomField.value);
	for (let i = 0; i < x; i++) {
		let r = randInt(0, 999);
		root.insert(r);
	}
	animate();
}

function handleToggle() {
	if (toggleBox.checked === false) {
		skipAnimation();
	}
}

function skipAnimation() {
	if (frames.cardinality !== 0) {
		frames.stop();
		frames.current = frames.cardinality - 1;
		setTimeout(() => { frames.go(); }, 100);
	}
}