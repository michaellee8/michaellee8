(function () {
  const canvas = document.getElementById("system-map");
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const labels = JSON.parse(canvas.dataset.nodes || "[]");
  const colors = ["#255f85", "#26745a", "#b56c1f", "#a84839"];
  const connections = [
    [0, 4],
    [1, 4],
    [2, 5],
    [3, 6],
    [4, 5],
    [4, 8],
    [5, 9],
    [6, 5],
    [7, 5],
    [8, 9],
  ];

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let pointer = { x: -1000, y: -1000 };
  let animationFrame = null;

  const nodes = labels.map((label, index) => ({
    label,
    color: colors[index % colors.length],
    radius: index < 4 ? 34 : 28,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  }));

  function layoutNodes() {
    const centerX = width * 0.55;
    const centerY = height * 0.55;
    const radiusX = width * 0.31;
    const radiusY = height * 0.29;

    nodes.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2;
      node.x = centerX + Math.cos(angle) * radiusX;
      node.y = centerY + Math.sin(angle) * radiusY;
      node.homeX = node.x;
      node.homeY = node.y;
    });

    if (nodes[4]) {
      nodes[4].x = centerX;
      nodes[4].y = centerY;
      nodes[4].homeX = centerX;
      nodes[4].homeY = centerY;
      nodes[4].radius = 44;
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(320, rect.width);
    height = Math.max(320, rect.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    layoutNodes();
    draw(0);
  }

  function drawConnection(from, to, time) {
    const source = nodes[from];
    const target = nodes[to];
    if (!source || !target) {
      return;
    }

    const phase = (Math.sin(time / 700 + from) + 1) / 2;
    context.beginPath();
    context.moveTo(source.x, source.y);
    context.lineTo(target.x, target.y);
    context.strokeStyle = "rgba(24, 32, 34, 0.18)";
    context.lineWidth = 1.2;
    context.stroke();

    const pulseX = source.x + (target.x - source.x) * phase;
    const pulseY = source.y + (target.y - source.y) * phase;
    context.beginPath();
    context.arc(pulseX, pulseY, 3.2, 0, Math.PI * 2);
    context.fillStyle = source.color;
    context.fill();
  }

  function drawNode(node, index, time) {
    const hoverDistance = Math.hypot(pointer.x - node.x, pointer.y - node.y);
    const isHovering = hoverDistance < node.radius + 24;
    const lift = isHovering ? 5 : Math.sin(time / 900 + index) * 1.6;
    const radius = node.radius + (isHovering ? 5 : 0);

    context.save();
    context.shadowColor = "rgba(24, 32, 34, 0.16)";
    context.shadowBlur = 18;
    context.shadowOffsetY = 10;
    context.beginPath();
    context.arc(node.x, node.y - lift, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 255, 255, 0.94)";
    context.fill();
    context.restore();

    context.beginPath();
    context.arc(node.x, node.y - lift, radius, 0, Math.PI * 2);
    context.strokeStyle = node.color;
    context.lineWidth = 2;
    context.stroke();

    context.beginPath();
    context.arc(node.x, node.y - lift, 5, 0, Math.PI * 2);
    context.fillStyle = node.color;
    context.fill();

    context.fillStyle = "#182022";
    context.font = "700 12px Inter, system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "top";
    wrapLabel(node.label, node.x, node.y - lift + radius + 9, radius * 2 + 34);
  }

  function wrapLabel(label, x, y, maxWidth) {
    const words = label.split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (context.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });

    lines.push(line);
    lines.forEach((text, index) => {
      context.fillText(text, x, y + index * 15);
    });
  }

  function updateNodes() {
    nodes.forEach((node) => {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);

      if (distance < 130) {
        const force = (130 - distance) / 130;
        node.vx -= (dx / distance) * force * 0.42;
        node.vy -= (dy / distance) * force * 0.42;
      }

      node.vx += (node.homeX - node.x) * 0.012;
      node.vy += (node.homeY - node.y) * 0.012;
      node.vx *= 0.88;
      node.vy *= 0.88;
      node.x += node.vx;
      node.y += node.vy;
    });
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(24, 32, 34, 0.045)";

    for (let x = 28; x < width; x += 56) {
      for (let y = 28; y < height; y += 56) {
        context.fillRect(x, y, 2, 2);
      }
    }

    connections.forEach(([from, to]) => drawConnection(from, to, time));
    nodes.forEach((node, index) => drawNode(node, index, time));
  }

  function tick(time) {
    if (!prefersReducedMotion) {
      updateNodes();
    }

    draw(time);

    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(tick);
    }
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  });

  canvas.addEventListener("pointerleave", () => {
    pointer = { x: -1000, y: -1000 };
  });

  window.addEventListener("resize", resize);

  resize();

  if (!prefersReducedMotion) {
    animationFrame = window.requestAnimationFrame(tick);
  }

  window.addEventListener("pagehide", () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
})();
