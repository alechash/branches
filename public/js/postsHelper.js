var skip = 1
var end = false
var postContext = ''

// infinite scroll
window.addEventListener('scroll', () => {
    const {
        scrollHeight,
        scrollTop,
        clientHeight
    } = document.documentElement;
    if (scrollTop + clientHeight > scrollHeight - 5) {
        loadMorePosts()
    }
});

// load more posts, either manually or throught infinite scroll as seen above
async function loadMorePosts() {
    if (end == true) {
        return
    }

    const posts = await fetch('/api/latest/load/morePosts?skip=' + skip + '&context=' + postContext + '&userid=' + userid);
    skip = skip + 1

    const json = await posts.json()

    if (json.length == 0) {
        document.getElementById('bottomWarning').innerHTML = 'Sorry, no more posts<span class="text-blue-600">.</span>'

        return end = true
    }

    var html = ''

    for (i = 0; i < json.length; i++) {
        html = html + createPost(json[i])
    }

    var html = htmlToElems(html)

    document.getElementById('postsContainer').appendChild(html)
}

// dates
function convertToDate(element, previous) {
    var current = Date.now()

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - new Date(previous);

    if (elapsed < msPerMinute) {
        element.innerText = Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        element.innerText = Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        element.innerText = Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        element.innerText = 'about ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        element.innerText = 'about ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        element.innerText = 'about ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function returnConvertToDate(previous) {
    var current = Date.now()

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - new Date(previous);

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return 'about ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return 'about ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return 'about ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function createPost(post) {
    if (post.likes.includes(userid)) {
        return `
<div class="flex flex-row bg-white shadow-sm rounded p-4 bg-gray-900 mb-3">
<div class="max-w-15 min-h-44 max-h-96 overflow-scroll no-scrollbar">
<img class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-black mb-2"
src="https://avatars4.githubusercontent.com/u/${post.ownersGithubId}?v4" id="profile_picture"
title="Profile Picture">
<span title="Like Post"
class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 bg-red-500 text-red-500 mb-2"
id="like_button_${post._id}" onclick="removelike('${post._id}')">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
<path fill-rule="evenodd" class="text-red-500 text-red-900 fill-current" id="like_svg_path_${post._id}"
d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z">
</path>
</svg>
</span>
<span title="Bookmark Post" class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100
text-blue-500 mb-2" id="bookmark_button">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
<path fill-rule="evenodd" class="text-blue-500 fill-current" fill="blue"
d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
</path>
</svg>
</span>
<span title="Report Post" class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-yellow-100
text-yellow-500 mb-2" id="like_button"><i class="lni lni-flag"></i></span>
</div>
<div class="flex flex-col flex-grow ml-4">
<div class="text-sm text-gray-500"><a href="/u/mr-winson"
class="text-gray-400 hover:text-gray-600"><span class="font-bold"
id="at_symbol">@</span><span class="font-bold" id="username">mr-winson</span></a>
<span id="time"> • ${returnConvertToDate(post.creationDate)}</span>
</div>
<div class="font-bold text-lg">
<pre class="max-h-96 min-h-44 overflow-scroll text-gray-200 font-sans scroll-blur mt-3">
${he.encode(post.body)}
</pre>
</div>
</div>
</div>
    `
    } else {
        return `
<div class="flex flex-row bg-white shadow-sm rounded p-4 bg-gray-900 mb-3">
<div class="max-w-15 min-h-44 max-h-96 overflow-scroll no-scrollbar">
<img class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-black mb-2"
src="https://avatars4.githubusercontent.com/u/${post.ownersGithubId}?v4" id="profile_picture"
title="Profile Picture">
<span title="Like Post"
class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500 mb-2"
id="like_button_${post._id}" onclick="like('${post._id}')">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
<path fill-rule="evenodd" class="text-red-500 fill-current" id="like_svg_path_${post._id}"
d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z">
</path>
</svg>
</span>
<span title="Bookmark Post" class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100
text-blue-500 mb-2" id="bookmark_button">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
<path fill-rule="evenodd" class="text-blue-500 fill-current" fill="blue"
d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
</path>
</svg>
</span>
<span title="Report Post" class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-yellow-100
text-yellow-500 mb-2" id="like_button"><i class="lni lni-flag"></i></span>
</div>
<div class="flex flex-col flex-grow ml-4">
<div class="text-sm text-gray-500"><a href="/u/mr-winson"
class="text-gray-400 hover:text-gray-600"><span class="font-bold"
id="at_symbol">@</span><span class="font-bold" id="username">mr-winson</span></a>
<span id="time"> • ${returnConvertToDate(post.creationDate)}</span>
</div>
<div class="font-bold text-lg">
<pre class="max-h-96 min-h-44 overflow-scroll text-gray-200 font-sans scroll-blur mt-3">
${he.encode(post.body)}
</pre>
</div>
</div>
</div>
    `
    }
}

function htmlToElems(html) {
    let temp = document.createElement('span');
    temp.innerHTML = html;
    return temp;
}

async function loadTrending() {
    const posts = await fetch('/trending');
    const json = await posts.json()

    var html = ''

    for (i = 0; i < json.length; i++) {
        html = html + `
<div class="flex flex-row bg-gray-900 shadow-sm rounded p-4 mt-2 max-h-44">
    <div class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-blue-500">
        ${i + 1}
    </div>
    <div class="flex flex-col flex-grow ml-4">
        <div class="text-sm text-gray-200 my-auto break-all overflow-scroll">${he.encode(json[i].body)}</div>
    </div>
</div>
`
    }

    document.getElementById('trendingContainer').innerHTML = html
}

loadTrending()

async function loadLatest() {
    const posts = await fetch('/api/latest');
    const json = await posts.json()

    var html = ''

    for (i = 0; i < json.length; i++) {
        html = html + `
<div class="flex flex-row bg-gray-900 shadow-sm rounded p-4 mt-2 max-h-44">
    <div class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500">
        ${i + 1}
    </div>
    <div class="flex flex-col flex-grow ml-4">
        <div class="text-sm text-gray-200 my-auto break-all overflow-scroll">${he.encode(json[i].body)}</div>
    </div>
</div>
`
    }

    document.getElementById('latestContainer').innerHTML = html
}

loadLatest()

function expandSmallTrending() {
    const container = document.getElementById('trendingContainer')
    const button = document.getElementById('trendingExpand')

    if (container.classList.contains('xs:hidden')) {
        container.style.transition = '1s'
        container.style.maxHeight = '1000000000px'
        container.classList.remove('xs:hidden')
        button.style.transition = '0.3s'
        button.style.transform = 'rotate(90deg)'
    } else {
        container.style.transition = '1s'
        container.style.maxHeight = '0px'
        container.classList.add('xs:hidden')
        button.style.transition = '0.3s'
        button.style.transform = 'rotate(0deg)'
    }
}

function expandSmallLatest() {
    const container = document.getElementById('latestContainer')
    const button = document.getElementById('latestExpand')

    if (container.classList.contains('xs:hidden')) {
        container.classList.remove('xs:hidden')
        button.style.transition = '0.3s'
        button.style.transform = 'rotate(90deg)'
    } else {
        container.classList.add('xs:hidden')
        button.style.transition = '0.3s'
        button.style.transform = 'rotate(0deg)'
    }
}