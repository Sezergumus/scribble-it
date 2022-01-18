const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60;
canvas.height = window.innerHeight / 1.6;

let ctx = canvas.getContext("2d");
let start_background_color = "white";
ctx.fillStyle = start_background_color;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "10";
let is_drawing = false;

let restore_array = [];
let index = -1;

function change_color(element) {
    draw_color = element.style.background;
}

function eraser() {
    draw_color = "white";
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function start(event) {
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function draw(event) {
    if ( is_drawing ) {
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.strokeStyle = draw_color;
        ctx.lineWidth = draw_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    } 
}

function stop(event) {
    if ( is_drawing ) {
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
    }
    event.preventDefault();

    if ( event.type != 'mouseout') {
        restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    index += 1;
    }
}

function clear_canvas() {
    ctx.fillStyle = start_background_color;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    restore_array = [];
    index = -1;
}

function undo_last() {
    if (index <= 0) {
        clear_canvas();
    } else {
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0)
    }
}

function save() {
    canvas.toBlob((blob) => {
        const timestamp = Date.now().toString();
        const a = document.createElement('a');
        document.body.append(a);
        a.download = `export-${timestamp}.png`;
        a.href = URL.createObjectURL(blob);
        a.click();
        a.remove();
    })
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 60;
    canvas.height = window.innerHeight / 1.6;
    ctx.fillStyle = start_background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
})
