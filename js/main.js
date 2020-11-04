let brush;
let history = [];
let hist_nav_idx = -1;

function export_image() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.addEventListener("load", function () {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        var a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "canvas.png";
        a.click();
    });
    img.src = canvas.toDataURL("image/png");
}

function toggle_popup(show) {
    var popup = document.getElementById("popup");
    if (popup) {
        if (show) {
            popup.style.top = "4.5em";
            popup.style.opacity = 1;
        } else {
            popup.style.top = "-4.5em";
            popup.style.opacity = 0;
        }
    }
}

function create_canvas() {
    history = [];
    var canvas = document.getElementById("canvas");
    if (canvas) {
        var ctx = canvas.getContext("2d");
        canvas.height = document.getElementById("y_val").value;
        canvas.width = document.getElementById("x_val").value;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // disable undo button
        var undo_btn = document.getElementById("undo-btn");
        if (undo_btn) {
            undo_btn.classList.add("disabled");
            undo_btn.setAttribute("onclick", "");
        }
        // disable redo button
        var redo_btn = document.getElementById("redo-btn");
        if (redo_btn) {
            redo_btn.classList.add("disabled");
            redo_btn.setAttribute("onclick", "");
        }

        // enable save button
        var save_btn = document.getElementById("save-btn");
        if (save_btn && save_btn.classList.value.indexOf("disabled") > -1) {
            save_btn.classList.remove("disabled");
            save_btn.setAttribute("onclick", "export_image();");
        }
        document.getElementById("canvas-container")
            ? (document.getElementById("canvas-container").style.display =
                  "block")
            : undefined;
    }
}

function change_brush(ele) {
    brush = ele.id;
    var active_brush = document.getElementsByClassName("active-brush");
    if (active_brush && active_brush.length > 0) {
        active_brush[0].classList.remove("active-brush");
    }
    ele.classList.add("active-brush");
}

function undo() {
    var cvs = document.getElementById("canvas");
    var context = cvs.getContext("2d");
    if (
        history.length > 0 &&
        hist_nav_idx <= history.length &&
        hist_nav_idx > 0
    ) {
        var undo_img = new Image();
        undo_img.addEventListener("load", function () {
            context.clearRect(0, 0, cvs.width, cvs.height);
            context.drawImage(undo_img, 0, 0);
        });
        undo_img.src = history[--hist_nav_idx];

        // enable redo button after undo
        var redo_btn = document.getElementById("redo-btn");
        if (redo_btn && redo_btn.classList.value.indexOf("disabled") > -1) {
            redo_btn.classList.remove("disabled");
            redo_btn.setAttribute("onclick", "redo();");
        }
    } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        hist_nav_idx = -1;

        // disable undo button
        var undo_btn = document.getElementById("undo-btn");
        if (undo_btn) {
            undo_btn.classList.add("disabled");
            undo_btn.setAttribute("onclick", "");
        }
    }
}

function redo() {
    if (
        history.length > 0 &&
        hist_nav_idx < history.length - 1 &&
        hist_nav_idx >= -1
    ) {
        var cvs = document.getElementById("canvas");
        var context = cvs.getContext("2d");
        var undo_img = new Image();
        undo_img.addEventListener("load", function () {
            context.clearRect(0, 0, cvs.width, cvs.height);
            context.drawImage(undo_img, 0, 0);
        });
        undo_img.src = history[++hist_nav_idx];

        // enable undo button after redo
        var undo_btn = document.getElementById("undo-btn");
        if (undo_btn && undo_btn.classList.value.indexOf("disabled") > -1) {
            undo_btn.classList.remove("disabled");
            undo_btn.setAttribute("onclick", "undo();");
        }
    } else {
        // disable redo button
        var redo_btn = document.getElementById("redo-btn");
        if (redo_btn) {
            redo_btn.classList.add("disabled");
            redo_btn.setAttribute("onclick", "");
        }
    }
}

window.onload = function () {
    let drag, startX, startY;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    function save_action() {
        var img = canvas.toDataURL("image/png");
        history.push(img);
        hist_nav_idx++;

        var undo_btn = document.getElementById("undo-btn");
        if (undo_btn && undo_btn.classList.value.indexOf("disabled") > -1) {
            undo_btn.classList.remove("disabled");
            undo_btn.setAttribute("onclick", "undo();");
        }
    }

    ctx.fillStyle = "#000";
    canvas.addEventListener("mousedown", function (e) {
        if (e.button === 0) {
            drag = true;

            ctx.beginPath();
            if (brush === "pen") {
                ctx.moveTo(e.offsetX, e.offsetY);
            } else if (brush === "rect") {
                startX = e.offsetX;
                startY = e.offsetY;
                ctx.rect(startX, startY, 0, 0);
            } else if (brush === "line") {
                startX = e.offsetX;
                startY = e.offsetY;
                ctx.moveTo(startX, startY);
            } else {
            }
        }
    });
    canvas.addEventListener("mousemove", function (e) {
        if (drag) {
            if (brush === "pen") {
                ctx.lineTo(e.offsetX + 1, e.offsetY + 1);
                ctx.stroke();
            } else if (brush === "rect") {
                // to show intermediate boxes
            } else if (brush === "line") {
                // to show intermediate lines
            } else {
            }
        }
    });
    canvas.addEventListener("mouseup", function (e) {
        if (e.button === 0) {
            drag = false;
            if (brush === "pen") {
                ctx.lineTo(e.offsetX + 1, e.offsetY + 1);
            } else if (brush === "rect") {
                ctx.rect(
                    startX,
                    startY,
                    e.offsetX + 1 - startX,
                    e.offsetY + 1 - startY
                );
            } else if (brush === "line") {
                ctx.lineTo(e.offsetX + 1, e.offsetY + 1);
            } else {
            }
            ctx.stroke();
            ctx.closePath();

            save_action();
            startX = undefined;
            startY = undefined;
        }
    });
};
