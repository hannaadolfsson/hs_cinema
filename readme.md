ABOUT:
HS Cinema is a cinema booking web application developed as an individual assignment for the course Web Application with REST API.
Users can browse movies, select the number of tickets, add movies to a shopping cart and complete a booking by entering their contact information.

DATABASE hs_cinema containing three tables:
movies stores movie information, including title, genre, duration, price and showtime.
bookings stores customer information and the total booking price.
booking_items connects bookings to movies and stores the number of tickets ordered.

API ENDPOINTS:
GET /api/movies – retrieves all movies.
GET /api/movies/:id – retrieves a specific movie.
POST /api/bookings – creates a booking.

PROJECT STRUCTURE
client/ – HTML, CSS and JavaScript for the user interface.
server/ – Express server and database connection.
database/ – SQL files for the database schema and example data

PURPOSE
The purpose of this project is to practise building a web application that communicates with a REST API and stores data in a relational database