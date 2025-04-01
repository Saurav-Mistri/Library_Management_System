import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./auth/auth.js";
import Register from "./auth/register.js";
import Main from "./main/Main.js";
import Users from "./admin/users/Users.js";
import UserCreate from "./admin/users/UserCreate.js";
import UserEdit from "./admin/users/UserEdit.js";
import Books from "./admin/books/Books.js";
import BookCreate from "./admin/books/BookCreate.js";
import BookEdit from "./admin/books/BookEdit.js";
import FrontBooks from "./front/books/Books.js";
import FrontBookCreate from "./front/books/BookCreate.js";
import FrontBookEdit from "./front/books/BookEdit.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Main/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/register" exact element={<Register/>} />
          <Route path="/admin/users" exact element={<Users/>} />
          <Route path="/admin/users/create" exact element={<UserCreate/>} />
          <Route path="/admin/users/:id/edit" exact element={<UserEdit/>} />
          <Route path="/admin/books" exact element={<Books/>} />
          <Route path="/admin/books/create" exact element={<BookCreate/>} />
          <Route path="/admin/books/:id/edit" exact element={<BookEdit/>} />
          <Route path="/books" exact element={<FrontBooks/>} />
          <Route path="/books/create" exact element={<FrontBookCreate/>} />
          <Route path="/books/:id/edit" exact element={<FrontBookEdit/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
