﻿$(document).ready(function () {
    //Find Ids
    const searchField = $("#search-TextField");
    const submitBtn = $("#submit-reset");
    const checkInDate = $("#checkInDate");
    const checkOutDate = $("#checkOutDate");
    const roomsDrop = $("#rooms-DropDown");
    const maxPriceText = $("#maxPrice");
    const priceRange = $("#price-Range");
    const propertyTypeDrop = $("#Property-Type-DropDown");
    const guestRatingDrop = $("#Guest-Rating-DropDown");
    const hotelLocationDrop = $("#Hotel-Location-DropDown");
    const moreFiltersDrop = $("#More-Filters-DropDown");
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
        //========================== *Initialize Data =============================
        
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
        

        //========================= *Construct DOM ==============================

        //*A1 - Populate Data for Search Autocomplete

        var autoCompleteElements = autoCompleteNames.map(x => `<option value="${x}">`);
        hotelsAuto.append(autoCompleteElements);


        //*A2 - Populate data for RoomTypes Dropdown
        var roomTypesElements = roomTypes.map(x => `<option value="${x}">${x}</option>`);
        roomsDrop.append(roomTypesElements);

        //*A3 - Populate max Price Field
        maxPriceText.append(maxPrice);

        //*A4 - Setting Max Price and Display values in Input Range on change
        priceRange.attr("max", maxPrice);
        priceRange.val(maxPrice);
        priceRange.on("input", function () {
            maxPriceText.text("max.$"+$(this).val());
        })


        //*A5 - Populate Property Types
        propertyTypeDrop.prepend("<option value=''>All</option>");
        for (var i = 0; i < propertyTypes.length; i++) {
            switch (propertyTypes[i]) {
                case 5: propertyTypeDrop.append(`<option value="${propertyTypes[i]}">⭐⭐⭐⭐⭐</option>`); break;
                case 4: propertyTypeDrop.append(`<option value="${propertyTypes[i]}">⭐⭐⭐⭐</option>`); break;
                case 4: propertyTypeDrop.append(`<option value="${propertyTypes[i]}">⭐⭐⭐</option>`); break;
                case 2: propertyTypeDrop.append(`<option value="${propertyTypes[i]}">⭐⭐</option>`); break;
                case 1: propertyTypeDrop.append(`<option value="${propertyTypes[i]}">⭐</option>`); break;
                default: break;
            }
        }

        //*A5 - Populate Guest Ratings
        guestRatingDrop.prepend("<option value=''>All</option>");
        for (let guestRating of guestRatings) {
            if (guestRating == "Okey") guestRatingDrop.append(`<option value"${guestRating}">Okay 0-2</option>`)
            if (guestRating == "Fair") guestRatingDrop.append(`<option value"${guestRating}">Fair 2-6</option>`)
            if (guestRating == "Good") guestRatingDrop.append(`<option value"${guestRating}">Okay 6-7</option>`)
            if (guestRating == "Very Good") guestRatingDrop.append(`<option value"${guestRating}">Okay 7-8.5</option>`)
            if (guestRating == "Excellent") guestRatingDrop.append(`<option value"${guestRating}">Okay 8.5-10</option>`)
        }

        //*A7 Populate Hotel Location
        hotelLocationDrop.prepend("<option value=''>All</option>");
        var locationsFilters = locations.map(x => `<option value="${x}">${x}</option>`)
        hotelLocationDrop.append(locationsFilters);

        //*A8 Populate Filters 
        moreFiltersDrop.prepend("<option value=''>All</option>");
        var MoreFilters = filters.map(x => `<option value="${x}">${x}</option>`)
        moreFiltersDrop.append(MoreFilters);
    }

});