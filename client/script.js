const moviesElement = document.querySelector("#movies"); // #id = movies
const cart = [];
const cartElement = document.querySelector("#cart");

function displayCart() {
    cartElement.innerHTML = ""; 
    let cartTotal = 0; 

    cart.forEach(item => {
        const cartItemElement = document.createElement("article");

        const titleElement = document.createElement("h3");
        titleElement.textContent = item.title;

        const quantityElement = document.createElement("p");
        quantityElement.textContent = `Tickets: ${item.quantity}`;

        const summary = item.price * item.quantity;
        cartTotal += summary; //lägger till filmens kostnar= totala cart-summa
        const summaryElement = document.createElement("p");
        summaryElement.textContent = `Total: ${summary} kr`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            const index = cart.findIndex( //index/element position i array
                cartItem => cartItem.id === item.id
            );
            cart.splice(index, 1); //tar bort index/element
            displayCart();
        });


        cartItemElement.appendChild(titleElement);
        cartItemElement.appendChild(quantityElement);
        cartItemElement.appendChild(summaryElement);
        cartItemElement.appendChild(removeButton);

        cartElement.appendChild(cartItemElement);

    });

    // CART TOTAL AND PROCEED TO PAYMENT
    const cartTotalElement = document.createElement("h3");
    cartTotalElement.textContent = `Cart total: ${cartTotal} kr`;

    cartElement.appendChild(cartTotalElement);

    const paymentButton = document.createElement("button");
    paymentButton.textContent = "Continue to booking";

    //FORM + dom manipulation
    paymentButton.addEventListener("click", () => {
        const form = document.createElement("form");

        const formTitle = document.createElement("h2");
        formTitle.textContent = "Complete your booking";

        form.appendChild(formTitle);
        
        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Name";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.required = true;

        form.appendChild(nameLabel);
        form.appendChild(nameInput);

        const emailLabel = document.createElement("label");
        emailLabel.textContent = "Email";

        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.required = true;

        form.appendChild(emailLabel);
        form.appendChild(emailInput);

        const confirmButton = document.createElement("button");
        confirmButton.type = "submit";
        confirmButton.textContent = "Confirm Booking";

        form.appendChild(confirmButton);
        
        //submit
        form.addEventListener("submit", (event) =>{
            event.preventDefault();
            console.log(nameInput.value)
            console.log(emailInput.value)

            const booking = {
                customerName: nameInput.value,
                customerEmail: emailInput.value,
                items: cart
            };

            console.log(booking);

            //POST
            fetch("http://localhost:3000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking) // js objekt till json som kan skickas i request
            })

            //client error handling
           .then(response => {
                console.log("status:", response.status);
                
                if (!response.ok) {
                    throw new Error("Booking could not be completed");
                }
                return response.json();
            })

            //--> post succeded
            .then(data => {
                console.log("Server response:", data);
            
                const confirmation = document.createElement("div");

                const confirmationText = document.createElement("h2");
                confirmationText.textContent =
                    `Thank you ${nameInput.value}, your booking is confirmed!`;

                confirmation.appendChild(confirmationText);

                document.querySelector("main").appendChild(confirmation);

                //tömmer cart
                form.remove();
                cart.length = 0;
                displayCart();
        })

        .catch(error => {
            console.error("Booking error:", error);
            alert("Something went wrong, please try again (:");
        });
    });

    document.querySelector("main").appendChild(form);

}); cartElement.appendChild(paymentButton);
}


// console.log(moviesElement);

//frontend - REST API
fetch("http://localhost:3000/api/movies") 
    .then(response => response.json()) //make anwser to something js can work with
    .then(movies => {
        //console.log(movies); //data and save in movies
        
    movies.forEach(movie => {
        //console.log(movie.title);
        const movieElement = document.createElement("article"); //create new article element

        const titleElement = document.createElement("h3");
        titleElement.textContent = movie.title;

        const genreElement = document.createElement("p");
        genreElement.textContent = movie.genre;

        const descElement = document.createElement("p");
        descElement.textContent = movie.description;

        const durationElement = document.createElement("p");
        durationElement.textContent = `Duration: ${movie.duration} minutes`;

        const priceElement = document.createElement("p");
        priceElement.textContent = `Price: ${movie.price} kr`;

        const showTimeElement = document.createElement("p");
        showTimeElement.textContent = `Showtime: ${movie.show_time}`;

        const cartButton = document.createElement("button");
        cartButton.textContent = "Add to Cart";
        
        cartButton.addEventListener("click", () => {
            console.log(movie.title);
            
            const popup = document.createElement("div"); //popup för css style
                popup.classList.add("popup");
            
            const popupTitle = document.createElement("h3");   
                popupTitle.textContent = movie.title;

            const ticketText = document.createElement("p");
                ticketText.textContent = "How many tickets?";

            const ticketInput = document.createElement("input");
                ticketInput.type = "number";
                ticketInput.min = "1";
                ticketInput.max = "15";
                ticketInput.value = "1";
                    
            const addButton = document.createElement("button");
            addButton.textContent = "Add to Cart";

            addButton.addEventListener("click", () => {
                const cartItem = {
                    id: movie.id,
                    title: movie.title,
                    price: movie.price,
                    quantity: Number(ticketInput.value)
                };
                
                const existingItem = cart.find(item => item.id === movie.id);

                if (existingItem) {
                    existingItem.quantity += Number(ticketInput.value);
                } else {
                    cart.push(cartItem);
                }

                displayCart();
                popup.remove();
            });

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            
            cancelButton.addEventListener("click", () => {
                popup.remove();

});

            popup.appendChild(popupTitle);
            popup.appendChild(ticketText);
            popup.appendChild(ticketInput);
            popup.appendChild(addButton);
            popup.appendChild(cancelButton);

            document.body.appendChild(popup);
});


        movieElement.appendChild(titleElement);
        movieElement.appendChild(genreElement);
        movieElement.appendChild(descElement);
        movieElement.appendChild(durationElement);
        movieElement.appendChild(priceElement);
        movieElement.appendChild(showTimeElement);
        movieElement.appendChild(cartButton);
    

        moviesElement.appendChild(movieElement);
        
});
    });
