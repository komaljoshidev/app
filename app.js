(function() {
    const BASE_URL = 'http://data.fixer.io/api/latest?access_key=e3e1b5fbf7e0030a7f645e52fc97094b'; // Use your actual access key

    const dropdowns = document.querySelectorAll(".dropdown select");
    const btn = document.querySelector("form button");
    const fromCurr = document.querySelector(".from select");
    const toCurr = document.querySelector(".to select");
    const msg = document.querySelector(".msg");

    // Populate the dropdowns with currency codes
    for (let select of dropdowns) {
        for (let currCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;
            if (select.name === "from" && currCode === "USD") {
                newOption.selected = "selected";
            } else if (select.name === "to" && currCode === "INR") {
                newOption.selected = "selected";
            }
            select.append(newOption);
        }

        select.addEventListener("change", (evt) => {
            updateFlag(evt.target); // Trigger flag update when the selection changes
        });
    }

    // Function to update the exchange rate based on user input
    const updateExchangeRate = async () => {
        let amount = document.querySelector(".amount input");
        let amtVal = amount.value;
        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }

        // Log to check the selected currencies
        console.log(`From: ${fromCurr.value}, To: ${toCurr.value}`);

        // Construct the URL for the API request
        const URL = `${BASE_URL}&from=${fromCurr.value}&to=${toCurr.value}`;

        try {
            // Fetch exchange rate data from Fixer.io API
            let response = await fetch(URL);

            // Check if the request was successful
            if (!response.ok) {
                throw new Error("Failed to fetch exchange rates");
            }

            let data = await response.json();

            // Log the response to see what is returned
            console.log(data);

            if (data.error) {
                throw new Error(data.error.info); // Handle API error if present
            }

            let rate = data.rates[toCurr.value]; // Get the exchange rate for the selected "to" currency

            // If the rate doesn't exist, throw an error
            if (!rate) {
                throw new Error(`Exchange rate not available for ${toCurr.value}`);
            }

            // Calculate the final amount after conversion
            let finalAmount = amtVal * rate;

            // Display the result in the message area
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
        } catch (error) {
            // Handle any errors during the API request
            msg.innerText = `Error: ${error.message}`;
            console.error(error); // Log the error for debugging
        }
    };

    // Update the flag icon based on the selected currency
    const updateFlag = (element) => {
        let currCode = element.value;
        let countryCode = countryList[currCode];

        // Target the flag image specifically for the "from" or "to" dropdown
        let img;
        if (element.name === "from") {
            img = document.querySelector(".from .select-container img");
        } else if (element.name === "to") {
            img = document.querySelector(".to .select-container img");
        }

        if (img) {
            // Set the flag image using the country code (you can use flag CDN or local storage)
            img.src = `https://flagsapi.com/${countryCode}/flat/64.png`; // Example URL for flag images
            img.alt = `${currCode} Flag`; // Alt text for accessibility
        }
    };

    // Call updateExchangeRate when the button is clicked
    btn.addEventListener("click", (evt) => {
        evt.preventDefault(); // Prevent form submission
        updateExchangeRate();
    });

})();
