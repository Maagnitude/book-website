const express = require('express');
const app = express();
const parser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('books.sqlite3');
6
app.use(express.static('public'));
app.use(parser.json());

app.get('/books',async function (req, res) {
	
	const sql = 'SELECT rowid, bookAuthor, bookTitle, bookGenre, bookPrice FROM books';
	try {
		const results = await query(sql, res);
		// console.log(`Response sent. Results: ${results}`);
	}catch (error) {
		console.error(`Response sent with a 500 error code. Error message: ${error.message}`);
	}	
});

app.get('/books/:keyword',async function (req, res) {
	const keyword = req.params.keyword;
	const sql = `SELECT rowid, bookAuthor, bookTitle, bookGenre, bookPrice FROM books WHERE bookAuthor LIKE "%${keyword}%" OR bookTitle LIKE "%${keyword}%" OR bookGenre LIKE "%${keyword}%"`;
	console.log(sql);
	try {
		const results = await query(sql, res);
		// console.log(`Response sent. Results: ${results}`);
	}catch (error) {
		console.error(`Response sent with a 500 error code. Error message: ${error.message}`);
	}
});

app.post('/books/', function(req, res){
	const book = req.body;
	console.log(book);
	var sql;
	if (book.bookAuthor != ""  && book.bookTitle != "" && book.bookGenre != "-Choose a genre-" && book.bookPrice > 0.0) {
		sql = `INSERT INTO books VALUES("${book.bookAuthor}", "${book.bookTitle}",  "${book.bookGenre}",  ${parseFloat(book.bookPrice)})`;
	} else {
		sql = `INSERT INTO books VALUES("${book.bookAuthor}", "${book.bookTitle}",  "${book.bookGenre}",  NULL)`;  // Doing this the book won't be registered, because bookPrice cannot be NULL. 
	}
	console.log(sql);
	db.run(sql, (error)=>{
		if(error) {
			res.status(500);
			res.send({'error':`Error registering the book: ${error.message}`});
		} else {
			res.json({'result':`"${book.bookTitle}" by "${book.bookAuthor}" has been successfully registered to the system!`});
		}
	});
});

app.listen(3000, function() {
	console.log('Book Server started.');
});

function query(sql,res) {
	const promise = new Promise(function(resolve, reject){
		db.all(sql,(error,results)=>{
	  		if(error){
	  			res.status(500);
	  			res.send({'error':`DB error ${error.message}`});
	  			reject(error);
	  		} else {
	  			if (results.length == 0) {
	  				res.status(404);
	  				res.send({'error':'Resource does not exist'});
	  				resolve(results);
	  			} else {
	  				res.json(results);
	  				resolve(results);
	  			} 			
	  		}
  		});
  	});
  	return promise;
}



