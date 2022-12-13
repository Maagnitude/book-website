const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
        target.classList.add('active')
    });
});

window.onload = function(event) {
    const baseUrl = `http://${location.host}/books/`;
    document.getElementById('searchBook').addEventListener('click', async function (event) {
        const keyword = document.getElementById('getBookByKeyword').value;
        const url = baseUrl+keyword;
        const response = await fetch(url);
        const body = await response.json();
        var bookrows = document.getElementById('bookTable');
        bookArea = "";
        for (var book of body){
            bookArea += `<tr><td>${book.rowid}</td><td>${book.bookAuthor}</td><td>${book.bookTitle}</td><td>${book.bookGenre}</td><td>${book.bookPrice} €</td></tr>`
        }
        bookrows.innerHTML = bookArea;
    });
    document.getElementById('registerBook').addEventListener('click',async function(event){
        const bookAuthor = document.getElementById('rb_bookAuthor').value;
        const bookTitle = document.getElementById('rb_bookTitle').value;
        const bookGenre = document.getElementById('rb_bookGenre').value;
        const bookPrice = document.getElementById('rb_bookPrice').value;
        const book = {bookAuthor, bookTitle, bookGenre, bookPrice};
        const response = await fetch(baseUrl,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        const body = await response.json();
        var feedback = document.getElementById('bookAreaReg');
        bookAreaReg="";
        if (response.status == 200) {
            bookAreaReg = body['result'];
            console.log(body['result']);
        } else {
            if (book.bookPrice <= 0) {
                bookAreaReg = "Registration Failed! Book's price must be greater than zero! Please try again!";
                console.log(body['error']);
            } else {
                bookAreaReg = "Registration Failed! You entered something wrong or left something blank! Please try again!";
                console.log(body['error']);
            }

            
            
        }
        feedback.innerHTML = bookAreaReg;
    });
}