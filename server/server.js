import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express(); 
app.use(cors()); 
app.use(express.json()); 



// Test av databasanslutning:
db.getConnection() 
    .then(connection => {
        console.log("Database connected!");
        connection.release(); 
    })
    .catch(error => { 
        console.error("Database connection failed:", error);
    });


//test av endpoint
app.get("/", (request, response) => {
    response.send("Welcome to HS Cinema!");
});


//endpoint för GET movies från db
app.get("/api/movies", async (req, res) => {  // get movies, async väntar på svar från mariadb
    let connection; // declare connection outside the try/catch
        
    try {
        connection = await db.getConnection(); //frågar om anslutning

        const movies = await connection.query( //kör sql fråga mot databas
            "select * from movies"
        ); 

        res.json(movies); // skickar tillbaka som JSON
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Could not fetch movies"
        });

    } finally { //goes through even if try is succeeded or not
        if (connection) {
            connection.release(); 
        }
    }
}); 


// endpoint för GET movies ID..
app.get("/api/movies/:id", async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();

         // console.log(req.params.id); request parameters from id, id comes from URL
        const id = req.params.id; // sparar id som requested parameter

        const movie = await connection.query(
            "select * from movies where id = ?",
            [id] 
        );

        if (movie.length === 0) {
            return res.status(404).json ({ //404 = Not found
                error: "Movie not found"
            });
        }
        res.json(movie[0]); //return first object in array

    } catch (error){
        console.error(error);
        res.status(500).json({
            error: "Could not fetch movie"
        })

    } finally {
        if (connection) {
        connection.release();
        }
    }

});

// endpoint för POST booking
app.post("/api/bookings", async (req, res) => {
    let connection;

    try{
        const { customerName, customerEmail, items } = req.body; //req.body har JSON-data från frontend

        //validering
        if (!customerName || !customerEmail || !items || items.length === 0) {
            return res.status(400).json({ //bad req
                error: "All fields must be filled (:"
            });
    }


        connection = await db.getConnection();


        // kontroll av varukorg
        let total = 0;

        for (const item of items) { //loop items
            if (!Number.isInteger(item.quantity) || item.quantity <=0) {
                return res.status(400).json({ //bad req
                    error:"Quantity must be a solid number"
                });
            }

            if (item.quantity > 15) {
                return res.status(400).json({
                    error: "Maximum 15 tickets allowed"
                });
            }


            const movie = await connection.query(
                "Select id, price From movies Where id = ?",
                [item.id]
            );
            if (movie.length === 0) {
                return res.status(404).json({
                    error: "Movie not found"
                }); 
            }

            //Räknar pris från db
            total += Number(movie[0].price) * item.quantity;
        }

        //starta transaktion
        await connection.beginTransaction();

        //Bokning
        const result = await connection.query(
            `Insert into bookings (customer_name, customer_email, total)
            values (?, ?, ?)`,
            [customerName, customerEmail, total]
        );
        //id från mariadb
        const bookingId = result.insertId

        //insert into booking_items
        for (const item of items) {
            await connection.query(
                `insert into booking_items (booking_id, movie_id, quantity)
                VALUES (?, ?, ?)`,
                [bookingId, item.id, item.quantity]
            );
        }

    //IF SUCCEEDED or catch error
        await connection.commit();
        
        console.log(bookingId)

        res.status(201).json({ //created
            message: "Booking created",
            bookingId: Number(bookingId) //number() kan hanteras av JSON
        });
       

    } catch (error) {
        console.error(error);

        if (connection) {
            await connection.rollback();
        }
 
        res.status(500).json({
            error: "Could not create booking"
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }

});

//Starta server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});