const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const bookmarkNameEl = document.getElementById('website-name');
const bookmarkUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

//show modal and focus on first input
function showModal() {
    modal.classList.add('show-modal');
    bookmarkNameEl.focus();
}

//Show modal event listener
modalShow.addEventListener('click', showModal);
//event listener for closing modal by click on closing button
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
//event listener for closing modal on click outside modal 
window.addEventListener('click', e => {e.target === modal ? modal.classList.remove('show-modal') : false });

//Validate form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address!!!');
        return false;
    }
    //valid
    return true;
}

//build bookmarks DOM
function buildBookmarks() {
    //Remove bookmark elements every time function is run (to prevent multiple rendering of the same elements)
    bookmarksContainer.textContent = '';
    //Build bookmark item
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-trash-alt');
        closeIcon.setAttribute('title', 'Delete bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //favicon / div container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `http://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //append to bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    })
}

//Fetch data from local storage
function fetchBookmarks() {
    //get bookmarks from local storage if aveable
    if(localStorage.getItem('bookmarks')) {//get and check
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));//get and parse
    } else {
        //create bookmarks array in local storage
        bookmarks = [
            {
                name: 'Vlada\'s github',
                url: 'https://github.com/VladaMitic',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//Delete bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    //uppdate bookmark array in localStorage with changes
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //re-render DOM
    fetchBookmarks();
}

//Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = bookmarkNameEl.value;
    let urlValue = bookmarkUrlEl.value;
    if(!urlValue.includes("http://", "https://")) {
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    bookmarkNameEl.focus();
}

//event listener to save bookmark on form submit
bookmarkForm.addEventListener('submit', storeBookmark);

//on load fetch bookmarks
fetchBookmarks();