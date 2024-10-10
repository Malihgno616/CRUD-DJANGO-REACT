import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addBook = async () => {
    const bookData = {
      title: title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) =>
        prev.map((book,) => {
          if (book.id === pk) {
            return { ...book, title: newTitle, release_year };
          } else {
            return book;
          }
        })
      );
      setNewTitle(""); // Clear the newTitle state
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "DELETE",
      });

      try {
        await response.json();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
      }

      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      <h1>Book Website</h1>
      <div>
        <input
          type="text"
          placeholder="Book Title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release Date..."
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button onClick={addBook}> Add Book </button>
      </div>
      {books.map((book, index) => (
        <div key={book.id || index}>
          <h2>Title: {book.title}</h2>
          <p>Release Year: {book.release_year}</p>
          <input
            type="text"
            placeholder="New Title..."
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={() => updateTitle(book.id, book.release_year)}>
            Change Title
          </button>
          <button onClick={() => deleteBook(book.id)}>Delete Book</button>
        </div>
      ))}
    </>
  );
}

export default App;
