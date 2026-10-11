CREATE DATABASE IF NOT EXISTS hs_cinema;
USE hs_cinema;

CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    genre VARCHAR(50),
    description TEXT,
    duration INT,
    price DECIMAL(6,2),
    show_time TIME
);

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    customer_email VARCHAR(255),
    total DECIMAL(8,2),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    movie_id INT,
    quantity INT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);