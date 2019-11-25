export default function BenzeneParticles(canvas, options) {
	if (options === void 0) options = {};
	options = Object.assign(
		{
			edgeLightUpSpeed: 0.002,
			edgeFadeSpeed: 0.001,
			edgeLightUpBrightness: 0.2,
			edgeLightUpAlphaSpeed: 0.02,
			eraseAlpha: 0.5,
			trailSize: 25,
			pulseChance: 0.06,
			maxPulsesPerSpawn: 1,
			maxPulses: 10,
			minVertexRadius: 1,
			minPulseSpeed: 0.03 / 2.25,
			pulseSpeedVariation: 0.04 / 2.25,
			vertexRadiusVariation: 1,
			spacing: 80,
			bg: [71, 125, 194],
			fg: [128, 198, 255],
		},
		options,
	);

	const PI2 = Math.PI * 2;
	const dpi = window.devicePixelRatio;
	const ctx = canvas.getContext('2d');
	const bounds = canvas.getBoundingClientRect();
	const width = bounds.width * dpi;
	const height = bounds.height * dpi;
	let lastBliped = [];
	let clear = false;
	const repeat = function(times, callback) {
		for (let i = 0; i < times; i++) {
			callback(i);
		}
	};

	const last = function(arr) {
		return arr[arr.length - 1];
	};

	function drawCircle(ctx, x, y, r) {
		ctx.beginPath();
		ctx.arc(x * dpi, y * dpi, r * dpi, 0, PI2);
		ctx.closePath();
	}

	function fillCircle(ctx, x, y, r) {
		drawCircle(ctx, x, y, r);
		ctx.fill();
	}

	function strokeCircle(ctx, x, y, r) {
		drawCircle(ctx, x, y, r);
		ctx.stroke();
	}

	function Color(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	Color.prototype = {
		r: 0,
		g: 0,
		b: 0,
		interpolate: function interpolate(color, p) {
			const dr = color.r - this.r;
			const dg = color.g - this.g;
			const db = color.b - this.b;
			return new Color(this.r + dr * p, this.g + dg * p, this.b + db * p);
		},
		toString: function toString() {
			return (
				'rgb(' +
				Math.round(this.r) +
				',' +
				Math.round(this.g) +
				',' +
				Math.round(this.b) +
				')'
			);
		},
	};
	const color = {
		bg: new Color(options.bg[0], options.bg[1], options.bg[2]),
		fg: new Color(options.fg[0], options.fg[1], options.fg[2]),
	};
	const getColor = function(v) {
		return color.bg.interpolate(color.fg, v).toString();
	};

	function createGrid(width, height, spacing) {
		const margin = spacing / 2;
		const cols = Math.ceil(width / spacing) + 1;
		const rows = Math.ceil((3 * height) / spacing) + 1;
		const numParticles = cols * rows;
		const pointcnt = 4;

		const particles = [];
		const edges = [];
		for (let i = 0; i < rows; ++i) {
			for (let j = 0; j < cols; ++j) {
				particles.push({
					x:
						(i % 4 < 2 ? j * spacing : j * spacing + spacing / 2) -
						margin,
					y:
						Math.floor(i / 2) * spacing +
						((i % 2) * 3 * spacing) / 4 -
						margin,
				});
				if (i > 0) {
					edges.push({
						va: particles[i * cols + j],
						vb: particles[(i - 1) * cols + j],
					});
				}
				if (i > 0 && i % 4 == 0 && j > 0) {
					edges.push({
						va: particles[i * cols + j],
						vb: particles[(i - 1) * cols + j - 1],
					});
				}
				if (i % 4 == 2 && j < cols - 1) {
					edges.push({
						va: particles[i * cols + j],
						vb: particles[(i - 1) * cols + j + 1],
					});
				}
			}
		}

		return {
			vertices: particles,
			edges: edges,
		};
	}

	function getNeighbors(diagram, vertex, exclude) {
		if (exclude === void 0) exclude = null;
		const edges = diagram.edges.filter(function(edge) {
			return (
				(edge.va == vertex || edge.vb == vertex) &&
				(edge.va != exclude && edge.vb != exclude)
			);
		});
		return edges
			.reduce(function(arr, cur) {
				return arr.concat(cur.va, cur.vb);
			}, [])
			.filter(function(v) {
				return v != vertex;
			});
	}

	function initDiagram(diagram) {
		diagram.pulses = [];
		diagram.pulse = function(origin, dest) {
			const pulse = new Pulse(origin, dest);
			pulse.speed =
				options.minPulseSpeed +
				options.pulseSpeedVariation * Math.random();
			if (diagram.pulses.length < options.maxPulses) {
				origin.lightUp();
				diagram.pulses.push(pulse);
				const edge = origin.diagram.edges.find(function(edge) {
					return (
						(edge.va == origin && edge.vb == dest) ||
						(edge.vb == origin && edge.va == dest)
					);
				});
				edge.lightUp();
				return pulse;
			} else return null;
		};
		initVertices(diagram);
		initEdges(diagram);
		diagram.outerVertices = diagram.vertices.filter(function(vertex) {
			return (
				vertex.y <= 0 ||
				vertex.y >= diagram.height ||
				vertex.x <= 0 ||
				vertex.x >= diagram.width
			);
		});
	}

	function initEdges(diagram) {
		diagram.edges.forEach(function(edge) {
			edge.color = 0;
			edge.colorTo = 0;
			edge.alpha = 0;
			edge.alphaTo = 1;
			edge.lightUp = function() {
				edge.colorTo = options.edgeLightUpBrightness;
				edge.color = Math.max(edge.color, 1e-4);
				edge.alpha = 0;
				edge.alphaTo = 1;
			};
			edge.update = function() {
				if (edge.alpha < edge.alphaTo) {
					edge.alpha += options.edgeLightUpAlphaSpeed;
				}
				if (edge.alphaTo > 0) {
					edge.alphaTo -= options.edgeLightUpAlphaSpeed;
				} else {
					edge.alpha -= options.edgeLightUpAlphaSpeed;
				}
			};
		});
	}

	function initVertices(diagram) {
		const maxClockSpeed = 0.001;
		const maxClockIntensity = 0 * 0.1;
		diagram.vertices.forEach(function(vertex) {
			const depth = Math.random();
			vertex.diagram = diagram;
			vertex.clockSpeed =
				-maxClockSpeed + Math.random() * (maxClockSpeed * 2);
			vertex.clock = Math.random() * PI2;
			vertex.originX = vertex.x;
			vertex.originY = vertex.y;
			vertex.clockIntensity = 0 + maxClockIntensity * Math.pow(depth, 3);
			vertex.depth = depth;
			vertex.radius =
				options.minVertexRadius + depth * options.vertexRadiusVariation;
			vertex.color = 0;
			vertex.colorFadeSpeed = 0.01;
			vertex.blips = [];
			vertex.blipSpeed = 0.04;
			vertex.blipRadius =
				vertex.radius * 3.5 + Math.random() * vertex.radius * 1;
			vertex.forceStrength = 4;
			vertex.forces = [];
			vertex.neighbors = getNeighbors(diagram, vertex);
			vertex.getRandomNeighbor = function(exclude) {
				if (exclude === void 0) exclude = null;
				const neighbors = this.neighbors.filter(function(neighbor) {
					return neighbor != exclude;
				});
				if (neighbors.length == 0) return null;
				let neighbor =
					neighbors[
						Math.round(Math.random() * (neighbors.length - 1))
					];
				return neighbor;
			};
			vertex.lightUp = function() {
				this.color = 1;
			};
			vertex.blip = function() {
				this.blips.push(1);
			};
			vertex.applyForces = function() {
				const result = {
					x: 0,
					y: 0,
				};
				for (let i = vertex.forces.length - 1; i >= 0; i--) {
					const force = vertex.forces[i];
					const p = Math.pow(force.power, 3);
					result.x += force.cosAngle * p * force.strength;
					result.y += force.sinAngle * p * force.strength;
					force.update();
					if (force.dead) {
						vertex.forces.splice(i, 1);
					}
				}
				return result;
			};
			vertex.update = function() {
				const this$1 = this;
				if (this.color > 0) {
					this.color -= this.colorFadeSpeed;
					if (this.color < 0) this.color = 0;
				}
				this.blips = this.blips
					.map(function(blip) {
						return (blip -= this$1.blipSpeed);
					})
					.filter(function(blip) {
						return blip > 0;
					});
			};
		});
	}

	function Force(angle, strength) {
		this.angle = angle;
		this.power = 1;
		this.strength = strength;
		this.cosAngle = Math.cos(angle);
		this.sinAngle = Math.sin(angle);
	}

	Force.prototype = {
		angle: 0,
		power: 0,
		dead: false,
		cosAngle: 0,
		sinAngle: 0,
		update: function update() {
			this.power -= 0.03;
			if (this.power <= 0) this.dead = true;
		},
	};

	function Pulse(origin, dest) {
		this.origin = origin;
		this.dest = dest;
		this.lastPos = [];
	}

	Pulse.prototype = {
		origin: null,
		dest: null,
		v: 0,
		speed: 0.03 + Math.random() * 0.05,
		angle: 0,
		dying: false,
		dyingCounter: options.trailSize,
		dead: false,
		lastPos: null,
		sparkRandom: 0.2,
		update: function update$1(delta) {
			const this$1 = this;
			if (delta === void 0) delta = 1;
			if (this.dying) {
				this.dyingCounter--;
				if (this.dyingCounter <= 0) this.dead = true;
				return;
			}
			if (this.v >= 1) {
				this.dying = true;
				const p = this;
				let newPulses = Math.round(Math.random() * 2.45);
				let failedPulses = 0;
				const lastTargets = [];
				if (newPulses > 0) {
					repeat(newPulses, function(i) {
						const neighbor = this$1.dest.getRandomNeighbor(
							this$1.origin,
						);
						if (neighbor == null) {
							failedPulses++;
							return;
						}
						if (lastTargets.indexOf(neighbor) > -1) {
							failedPulses++;
							return;
						}
						const newPulse = this$1.dest.diagram.pulse(
							this$1.dest,
							neighbor,
						);
						if (newPulse == null) {
							failedPulses++;
							return;
						}
						lastTargets.push(neighbor);
						newPulse.speed = this$1.speed;
						newPulse.lastPos = this$1.lastPos.slice(
							this$1.lastPos.length - 4,
						);
					});
				}
				let forceStrength = 1 + Math.random() * 1;
				if (newPulses == 0 || failedPulses >= newPulses) {
					this.dest.blip();
					lastBliped = [this.dest].concat(lastBliped.slice(0, 20));
					this.dest.lightUp();
					forceStrength = 7.5 + this.dest.depth * 6;
				}
				const dx = this.dest.x - this.origin.x;
				const dy = this.dest.y - this.origin.y;
				const angle = Math.atan2(dy, dx);
				this.dest.forces.push(new Force(angle, forceStrength));
			}
			this.v += this.speed * delta;
			if (this.v > 1) this.v = 1;
		},
		getPos: function getPos() {
			let pos = {
				x: 0,
				y: 0,
			};
			if (this.dying) {
				pos = this.lastPos[this.lastPos.length - 1];
			} else {
				const dx = this.dest.x - this.origin.x;
				const dy = this.dest.y - this.origin.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const angle = Math.atan2(dy, dx);
				this.angle = angle;
				pos = {
					x: this.origin.x + Math.cos(angle) * (dist * this.v),
					y: this.origin.y + Math.sin(angle) * (dist * this.v),
				};
				const sparkRandom = this.sparkRandom;
				pos.x += -(sparkRandom / 2) + Math.random() * sparkRandom;
				pos.y += -(sparkRandom / 2) + Math.random() * sparkRandom;
			}
			this.lastPos = this.lastPos
				.slice(this.lastPos.length - options.trailSize)
				.concat(pos);
			return pos;
		},
	};

	function drawDiagram(diagram, ctx, width, height, delta) {
		if (Math.random() < options.pulseChance) {
			repeat(Math.random() * options.maxPulsesPerSpawn, function(i) {
				let origin =
					diagram.vertices[
						Math.round(
							Math.random() * (diagram.vertices.length - 1),
						)
					];
				let dest = origin.getRandomNeighbor();
				if (
					lastBliped.length > 0 &&
					(dest == null || Math.random() < 0.1)
				) {
					origin =
						lastBliped[
							Math.round(Math.random() * (lastBliped.length - 1))
						];
					dest = origin.getRandomNeighbor();
					if (dest == null) return;
				} else if (dest == null) return;
				const newPulse = diagram.pulse(origin, dest);
				if (newPulse != null) {
					const dx = dest.x - origin.x;
					const dy = dest.y - origin.y;
					let angle = Math.atan2(dy, dx);
					angle += Math.PI;
				}
			});
		}
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = getColor(0);
		ctx.globalAlpha = options.eraseAlpha;
		ctx.fillRect(0, 0, width, height);
		ctx.globalAlpha = 1;
		ctx.fillStyle = getColor(0.2);
		ctx.strokeStyle = getColor(0.15);
		ctx.lineCap = 'round';
		diagram.edges.forEach(function(edge) {
			if (edge.color <= 0) return;
			edge.update();
			if (edge.alpha <= 0) return;
			ctx.beginPath();
			ctx.moveTo(edge.va.x * dpi, edge.va.y * dpi);
			ctx.lineTo(edge.vb.x * dpi, edge.vb.y * dpi);
			ctx.strokeStyle = getColor(edge.color);
			ctx.globalAlpha = edge.alpha;
			ctx.lineWidth = 1 * dpi;
			ctx.stroke();
		});
		diagram.pulses.forEach(function(pulse) {
			const pos = pulse.getPos();
			pulse.update(delta);
			ctx.beginPath();
			ctx.moveTo(pulse.lastPos[0].x * dpi, pulse.lastPos[0].y * dpi);
			pulse.lastPos.slice(1).forEach(function(p) {
				ctx.lineTo(p.x * dpi, p.y * dpi);
			});
			ctx.strokeStyle = getColor(1);
			ctx.globalAlpha = 0.7;
			ctx.lineWidth = 1 * dpi;
			ctx.stroke();
			if (pulse.lastPos.length >= 2 && !pulse.dying) {
				ctx.lineWidth = 5 * dpi;
				ctx.globalAlpha = 0.7;
				ctx.beginPath();
				const lastPos2 = pulse.lastPos.length - 2;
				const lastPos1 = pulse.lastPos.length - 1;
				ctx.moveTo(
					pulse.lastPos[lastPos2].x * dpi,
					pulse.lastPos[lastPos2].y * dpi,
				);
				ctx.lineTo(
					pulse.lastPos[lastPos1].x * dpi,
					pulse.lastPos[lastPos1].y * dpi,
				);
				ctx.strokeStyle = getColor(1);
				ctx.stroke();
			}
		});
		diagram.vertices.forEach(function(vertex) {
			const forces = vertex.applyForces();
			vertex.x = vertex.originX + forces.x;
			vertex.y = vertex.originY + forces.y;
			if (vertex.color > 0) {
				const depth = vertex.depth;
				let minColor = 0.1 + depth * depth * 0.2;
				minColor = 0;
				let color = getColor(
					minColor + Math.min(1, vertex.color) * (1 - minColor),
				);
				ctx.fillStyle = color;
				ctx.globalAlpha = 1 - (1 - depth) * 0.35;
				fillCircle(ctx, vertex.x, vertex.y, vertex.radius);
			}
			vertex.blips.forEach(function(blip) {
				const iblip = 1 - blip;
				const blipRadius =
					vertex.radius + vertex.blipRadius * Math.pow(iblip, 1 / 2);
				const blipAlpha = blip * 1;
				ctx.globalAlpha = blipAlpha;
				ctx.lineWidth = 1 * dpi;
				ctx.strokeStyle = getColor(1);
				strokeCircle(ctx, vertex.x, vertex.y, blipRadius);
			});
			vertex.update();
		});
		diagram.pulses = diagram.pulses.filter(function(pulse) {
			return !pulse.dead;
		});
	}

	function init(ctx, width, height) {
		const diagram = createGrid(width / dpi, height / dpi, options.spacing);
		diagram.width = width / dpi;
		diagram.height = height / dpi;
		initDiagram(diagram);
		const last = 0;
		const fps = 60;
		const maxDelta = 1.5;
		(function draw(now) {
			if (clear) {
				return;
			}
			let delta = (now - last) / (fps / 1e3);
			if (delta > maxDelta) delta = maxDelta;
			drawDiagram(diagram, ctx, width, height, delta);
			requestAnimationFrame(draw);
		})();
	}

	function stop() {
		clear = true;
	}

	function reset() {
		window.removeEventListener('resize', reset);
		stop();
		BenzeneParticles(canvas, options);
	}

	window.addEventListener('resize', reset);
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
	init(ctx, width, height);
}
