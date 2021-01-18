document.getElementById("hamburger").onclick = function toggleMenu() {
    const navToggle = document.getElementsByClassName("toggle");
    for (let i = 0; i < navToggle.length; i++) {
        navToggle.item(i).classList.toggle("hidden");
    }
};


// new post toggle
var openmodal = document.querySelectorAll('.modal-open')
for (var i = 0; i < openmodal.length; i++) {
    openmodal[i].addEventListener('click', function (event) {
        event.preventDefault()
        toggleModal()
    })
}

const overlay = document.querySelector('.modal-overlay')
overlay.addEventListener('click', toggleModal)

var closemodal = document.querySelectorAll('.modal-close')
for (var i = 0; i < closemodal.length; i++) {
    closemodal[i].addEventListener('click', toggleModal)
}

document.onkeydown = function (evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
        isEscape = (evt.keyCode === 27)
    }
    if (isEscape && document.body.classList.contains('modal-active')) {
        toggleModal()
    }
};


function toggleModal() {
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal')
    const input = document.querySelector('#log')
    input.focus()
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('modal-active')
}

// initiate tooltips
tippy('tooltip', {
    content: (reference) => reference.getAttribute('data-title'),
    onMount(instance) {
        instance.popperInstance.setOptions({
            placement: instance.reference.getAttribute('data-placement')
        });
    }
});

tippy('*.tooltip', {
    content: (reference) => reference.getAttribute('data-title'),
    onMount(instance) {
        instance.popperInstance.setOptions({
            placement: instance.reference.getAttribute('data-placement')
        });
    }
});

function like(id) {
    $.post("/api/like/new", {
        postid: id
    }, function (data) {
        if (data.message == 'login') {
            window.location = '/login'
        }
        const span = document.getElementById(`like_button_${id}`)
        const path = document.getElementById(`like_svg_path_${id}`)

        span.classList.add('bg-red-500')
        span.setAttribute('onclick', `removelike('${id}')`)
        path.classList.add('text-red-900')
    });
}

async function removelike(id) {
    $.post("/api/like/remove", {
        postid: id
    }, function (data) {
        if (data.message == 'login') {
            window.location = '/login'
        }
        const span = document.getElementById(`like_button_${id}`)
        const path = document.getElementById(`like_svg_path_${id}`)

        span.classList.remove('bg-red-500')
        span.setAttribute('onclick', `like('${id}')`)
        path.classList.remove('text-red-900')
    });
}

setInterval("changePeriodColor()", 300)

const period = document.getElementById('period')
const possibleColors = ["blue", "red", "indigo", "purple", "green", "gray", "pink", "yellow"]
const possibleHues = ["500", "600", "700", "800"]
var pickedClass = "text-blue-600"

function changePeriodColor() {
    period.classList.remove(pickedClass)

    const color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    const hue = possibleHues[Math.floor(Math.random() * possibleHues.length)];
    pickedClass = `text-${color}-${hue}`

    period.classList.add(pickedClass)
}