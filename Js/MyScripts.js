$(document).ready(function () {
    //Find Ids
    const searchField = $("#search-TextField");
    const submitBtn = $("#submit-reset");
    const checkInDate = $("#checkInDate");
    const checkOutDate = $("#checkOutDate");
    const roomsDrop = $("#rooms-DropDown");
    const maxPriceText = $("#maxPrice");
    const priceRange = $("#price-Range");
    const propertyTypeDrop = $("#Property-Type-DropDown");
    const guestRatingDrop = $("#Guest-Rating-DropDOwn");
    const hotelLocationDrop = $("#Hotel-Location-DropDown");
    const moreFiltersDrop = $("#More-Filters-Dropdown");
    const sortByDrop = $("#Sort-By-DropDown");
    const hotelsSection = $("#listing-hotels-section");
    const hotelsAuto = $("#hotelsAuto");

    //Variables for populating Data
    var roomTypes = [];
    var hotels = [];
    var filteredHotels = [];
    var autoCompleteNames = [];
    var maxPrice;
    var propertyTypes = [];
    var guestRatings = [];
    var locations = [];
    var filters = [];
   


    //Variables for searching and Sorting
    var cityName;
    var price;
    var propertyType;
    var guestRating;
    var hotelLocation;
    var filters;
    var sortBy;


    $.ajax({
        type: "GET",
        url: "Json/data.json",
        dataType: "json"

    }).done((data) => StartApplication(data));


    function StartApplication(data) {
        //============ *Initialize Data ===============
        console.log(data);
        //----- 1. Get Room Types 
        roomTypes = data[0].roomtypes.map(x => x.name);
        roomTypes.sort();

        //----- 2. Get All Hotels
        hotels = data[1].entries;

        //----- 3. Get Hotel Names For Autocomplete
        let hotelNames = hotels.map(x => x.hotelName);
        autoCompleteNames = [... new Set(hotelNames)];
        autoCompleteNames.sort();

        //----- 4. Get Max Price
        maxPrice = hotels.reduce((max, hotel) => (max.price > hotel.price) ? max : hotel).price;

        //----- 5. Get Available Property Types
        let hotelTypes = hotels.map(x => x.rating);
        propertyTypes = [...new Set(hotelTypes)];
        propertyTypes.sort();

        //----- 6. Get Guest Ratings
        var hotelGuestRatings = hotels.map(x => x.ratings.text);
        guestRatings = [...new Set(hotelGuestRatings)];

        //----- 7. Get Hotels Location
        var hotelLocation = hotels.map(x => x.city);
        locations = [...new Set(hotelLocation)];
        locations.sort();

        //----- 8. Get Hotels Filters
        var hotelFilters = hotels.map(x => x.filters);
        
        var allFilters =[];
        for (let hotel of hotelFilters) {
            for (let filter of hotel) {
                allFilters.push(filter.name);
            }
        }
       
        filters = [...new Set(allFilters)];
        filters.sort();
        console.log(filters);

        //============ *END Initialize Data ===============
        
    }

});