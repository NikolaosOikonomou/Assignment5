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
    var moreFilters = [];
   


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
        var hotelNames = hotels.map(x => x.hotelName);
        autoCompleteNames = [... new Set(hotelNames)];
        autoCompleteNames.sort();

        //----- 4. Get Max Price
        maxPrice = hotels.reduce((max, hotel) => (max.price > hotel.price) ? max : hotel).price;

        //----- 5. Get Available Property Types
        var hotelTypes = hotels.map(x => x.rating);
        propertyTypes = [...new Set(hotelTypes)];
        propertyTypes.sort();


        //----- 6. Get Guest Ratings
        var hotelGuestRatings = hotels.map(x => x.ratings.text);
        guestRatings = [...new Set(hotelGuestRatings)];

        //----- 7. Get Hotels Location
        hotelLocation = hotels.map(x => x.city);
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
       
        moreFilters = [...new Set(allFilters)];
        moreFilters.sort();
        

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
            if (guestRating == "Okey") guestRatingDrop.append(`<option value="${guestRating}">Poor 0-2</option>`)
            if (guestRating == "Fair") guestRatingDrop.append(`<option value="${guestRating}">Fair 2-6</option>`)
            if (guestRating == "Good") guestRatingDrop.append(`<option value="${guestRating}">Okay 6-7</option>`)
            if (guestRating == "Very Good") guestRatingDrop.append(`<option value="${guestRating}">Very Good 7-8.5</option>`)
            if (guestRating == "Excellent") guestRatingDrop.append(`<option value="${guestRating}">Excellent 8.5-10</option>`)
        }

        //*A7 Populate Hotel Location
        hotelLocationDrop.prepend("<option value=''>All</option>");
        var locationsFilters = locations.map(x => `<option value="${x}">${x}</option>`)
        hotelLocationDrop.append(locationsFilters);

        //*A8 Populate Filters 
        moreFiltersDrop.prepend("<option value=''>All</option>");
        var MoreFilters = moreFilters.map(x => `<option value="${x}">${x}</option>`)
        moreFiltersDrop.append(MoreFilters);



        //================================= ADD Event Listeners ==================================

        searchField.on("input", function () {
            cityName = $(this).val();
            Controller();
        });

        priceRange.on("input", function () {
            price = $(this).val();
            Controller();
        });

        propertyTypeDrop.on("input", function () {
            propertyType = $(this).val();
            Controller();
        });

        guestRatingDrop.on("input", function () {
            guestRating = $(this).val();
            Controller();
        });

        hotelLocationDrop.on("input", function () {
            hotelLocation = $(this).val();
            console.log(hotelLocation);
            Controller();
        });

        moreFiltersDrop.on("input", function () {
            moreFilters = $(this).val();
            Controller();
        });

        sortByDrop.on("input", function () {
            sortBy = $(this).val();
            Controller();
        });

        submitBtn.on("input", function () {
            Controller();
        });

        //================================= Controller ====================================
        hotelLocation = hotelLocationDrop.val();
        moreFilters = moreFiltersDrop.val();

        Controller();
        function Controller() {
            filteredHotels = hotels;
            //Filtering..
            if (cityName) {
                filteredHotels = filteredHotels.filter(x => x.hotelName.toUpperCase().includes(cityName.toUpperCase()));
            }
            if (price) {
                filteredHotels = filteredHotels.filter(x => x.price <= price);
            }
            if (propertyType) {
                filteredHotels = filteredHotels.filter(x => x.rating == propertyType);
            }
            if (guestRating) {
                filteredHotels = filteredHotels.filter(x => x.ratings.text == guestRating);
            }
            if (hotelLocation) {
                filteredHotels = filteredHotels.filter(x => x.city == hotelLocation);
            }
            if (moreFilters) {
                filteredHotels = filteredHotels.filter(x => x.filters.some(y => y.name == moreFilters));
            } 

            //Sorting..
            if (sortBy) {
                switch (sortBy) {
                    case "nameAsc": filteredHotels.sort((a, b) => a.hotelName < b.hotelName ? -1 : 1); break;
                    case "nameDesc": filteredHotels.sort((a, b) => a.hotelName > b.hotelName ? -1 : 1); break;
                    case "cityAsc": filteredHotels.sort((a, b) => a.city < b.city ? -1 : 1); break;
                    case "cityDesc": filteredHotels.sort((a, b) => a.city > b.city ? -1 : 1); break;
                    case "priceAsc": filteredHotels.sort((a, b) => a.price - b.price); break;
                    case "priceDesc": filteredHotels.sort((a, b) => b.price - a.price); break;
                    default: filteredHotels.sort((a, b) => a.hotelName < b.hotelName ? -1 : 1); break;
                }
            }
          

            //View
            hotelsSection.empty();
            filteredHotels.forEach(ViewHotels);
        }

        //================================ View ========================================

        function ViewHotels(hotel) {
            var template = `
                                             
                              <div class="hotel-card" >
                              <div class="photo" style="background: url(${hotel.thumbnail}); background-position: center;">
                                  <i class="fa fa-heart"></i>
                                  <span>1/30</span>
                              </div>
                              <div class="details">
                                  <h3>${hotel.hotelName}</h3>
                                  <div class="rating" style="display:inline;">
                                      <div>
                                         ${RatingStars(hotel.rating)} 
                                          <i>Hotel</i>
                                      </div>
                       
                                  </div>
                                  <div class="location">
                                        ${hotel.city}, 0.2 Miles to Champs Elysees
                                  </div>
                                  <div class="reviews">
                                      <span class="total">${hotel.ratings.no.toFixed(1)}</span>
                                      <b>${hotel.ratings.text}</b>
                                      <small>(1736)</small>
                                  </div>
                       
                                  <div class="location-reviews">
                                      Excellent location <small>(9.2/10)</small>
                                  </div>
                       
                              </div>
                              <div class="third-party-prices">
                                  <div class="sites-and-prices">
                                      <div class="highlited">
                                          Hotel website
                                          <strong>$700</strong>
                                      </div>
                                      <div>
                                          Agoda
                                          <strong>$600</strong>
                                      </div>
                                      <div>
                                          Travelocity
                                          <strong>$500</strong>
                                      </div>
                                  </div>
                                  <div class="more-deals">
                                      <strong>More deals from</strong>
                                      <strong>$575</strong>
                                  </div>
                              </div>
                       
                              <div class="call-to-action">
                                  <div class="price">
                                      <div class="before-discount">
                                          HotelPower.com
                                          <strong><s>$${(hotel.price * 1.1).toFixed()}</s></strong>
                                      </div>
                                      <div class="after-discount">
                                          Travelocity
                                          <strong>$${hotel.price}</strong>
                                          <div class="total">
                                              3 nights for <strong>$${hotel.price*3}</strong>
                                          </div>
                                          <div class="usp">
                                             ${hotel.filters.map(x=>`<span>${x.name + " "}</span>`)}
                                             
                                          </div>                 
                                      </div>                    
                                      <div class="button">
                                          <a href="#">View Deal</a>
                                      </div>
                                  </div>       
                              </div>
                          </div>
                   
                           `

            hotelsSection.append(template)
        };

        function RatingStars(rating) {
            let eles = "";
            for (var i = 0; i < rating; i++) {
                eles += `<span class="fa fa-star"></span>` + " "       
            }
            return eles;
        }
    }

});