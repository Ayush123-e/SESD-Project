# Project Idea: Online Library Management System

## Overview
The Online Library Management System is a web-based application that helps libraries manage their books, members, and borrowing operations efficiently. Students and members can browse books, borrow them, and return them online. Librarians can manage the book inventory and track all transactions.

## Scope
This system will handle basic library operations including book management, member registration, book borrowing/returning, and tracking overdue books.

## Key Features

1.  **User Management & Authentication**:
    *   User registration and login (JWT-based authentication).
    *   Two roles: Librarian (Admin) and Member (Student).
    *   Profile management for users.

2.  **Book Management** (Librarian only):
    *   Add new books with details (title, author, ISBN, category, quantity).
    *   Update book information.
    *   Delete books from inventory.
    *   View all books with availability status.

3.  **Book Browsing & Search** (All users):
    *   Browse all available books.
    *   Search books by title, author, or category.
    *   Filter books by availability.
    *   View book details.

4.  **Borrowing System**:
    *   Members can borrow available books (max 3 books at a time).
    *   Automatic due date calculation (14 days from borrow date).
    *   Return books and update availability.
    *   View borrowing history.

5.  **Fine Management**:
    *   Automatic fine calculation for overdue books (₹10 per day).
    *   View pending fines.
    *   Mark fines as paid (Librarian).

6.  **Dashboard**:
    *   Librarian: View total books, borrowed books, overdue books, total members.
    *   Member: View currently borrowed books, due dates, and pending fines.

## Technology Stack
*   **Frontend**: React.js with Tailwind CSS.
*   **Backend**: Node.js with Express.js.
*   **Database**: MongoDB with Mongoose.
*   **Authentication**: JSON Web Tokens (JWT).

## Software Engineering Principles
This project follows:
*   **Layered Architecture**: Controller → Service → Repository pattern.
*   **OOP Principles**: Encapsulation, Abstraction, Inheritance.
*   **Design Patterns**: Singleton (Database connection), Factory (User creation), Repository pattern.
*   **Clean Code**: Proper naming, separation of concerns, error handling.
