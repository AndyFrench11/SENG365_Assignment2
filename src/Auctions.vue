<template>
    <div>
        <div v-if="errorFlag" style="color: blue;">
            {{ error }}
        </div>


        <div class="wrapper">

            <nav id="sidebar" style="background-color: #00365e;">
                <!-- Sidebar Header -->
                <div class="sidebar-header">
                    <h3>Auctions</h3>
                </div>

                <!-- Sidebar Links -->
                <ul class="list-unstyled components">
                    <li class='active'><a href="#" v-on:click="getAuctions()">All Auctions</a></li>
                    <br/>

                    <li><!-- Link with dropdown items -->
                    <a href="#buyingSubmenu" data-toggle="collapse" aria-expanded="false">Buying</a>
                    <ul class="collapse list-unstyled" id="buyingSubmenu">
                        <li><a href="#" v-on:click="searchWonAuctions()">Won</a></li>
                        <li><a href="#" v-on:click="searchAuctions(auctionsIHaveBidOn)">Bid On</a></li>
                    </ul></li>

                    <br/>

                    <li><!-- Link with dropdown items -->
                    <a href="#sellingSubmenu" data-toggle="collapse" aria-expanded="false">Selling</a>
                    <ul class="collapse list-unstyled" id="sellingSubmenu">
                        <li><a href="#" v-on:click="searchAuctions(myAuctionsYetToComplete)">Yet To Complete</a></li>
                        <li><a href="#" v-on:click="searchAuctions(myFinishedWonAuctions)">Won</a></li>
                        <li><a href="#" v-on:click="searchAuctions(myFinishedNonWonAuctions)">Not Sold</a></li>
                    </ul></li>

                </ul>
            </nav>

            <div id="content">
                <nav class="navbar navbar-default" style="background-color: #00365e;">
                    <div class="container-fluid">


                        <div v-if="loggedInUserId">
                            <ul class="nav navbar-nav navbar-left">
                                <li><a href="#" data-toggle="modal" data-target="#createAuctionModal">Create New Auction</a></li>
                            </ul>
                        </div>

                        
                            <ul class="pagination justify-content-center">
                                <li class="page-item"><a class="page-link" href="#" v-on:click="getPreviousAuctions()">Previous</a></li>
                                <li class="page-item"><a class="page-link" href="#" v-on:click="getNextAuctions()">Next</a></li>
                            </ul>
                        
                       

                        <form class="nav navbar-nav navbar-right">
                            <input v-model="searchedTitle" placeholder="Title"/>
                            <input type="button" value="Go!" v-on:click="searchAuctionsOnTitle()">
                        </form>

                        Filter by category: <select class="nav navbar-nav navbar-right" id="filterCategorySelect">
                            <option value="1">Apparel</option>
                            <option value="2">Equipment</option>
                            <option value="3">Vehicles</option>
                            <option value="4">Property</option>
                            <option value="5">Other</option>
                        </select>
                        <button class="nav navbar-nav navbar-right" type="button" v-on:click="filterAuctionsByCategory()">Go!</button>


                    </div>
                </nav>
        


            <br/><br/>
            <br/>
            
                <div v-if="auctions.length != 0">
                        <div class="container">
                            <div class="card-columns">
                                <div v-for="auction in auctions">
                                    <div class="card border-primary">
                                        <div class="col-sm-3">
                                        <img class="card-img-top" :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'" alt="" height=200 width=200>
                                        
                                        <div class="card-body">
                                            <h5 class="card-title">{{ auction.title }}</h5>
                                            <p class="card-text">{{ auction.categoryTitle }}</p>
              
                                        </div>
                                        <div class="card-footer">
                                            <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}">
                                                <button class="btn btn-primary">View</button>
                                            </router-link>
                                        </div>
                                        <br/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                </div>
                <div v-else>
                    <b>There are no auctions which match the searched criteria.</b>
                </div>

         

            <br/>
            </div>
            
            <br/><br/>

            <div class="modal fade" id="createAuctionModal" tabindex="-1" role="dialog" aria-labelledby="createAuctionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="createAuctionModalLabel">Create New Auction</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="createAuctionForm" v-on:submit="createAuction()">
                                <h2>Details</h2>
                                <font color="red">*</font><b>Title:</b> <input v-model="title" placeholder="title" type="text" required/>
                                <br/>
                                <font color="red">*</font><b>Description:</b> <input v-model="description" placeholder="descripton" type="text" required/>
                                <br/>
                                <font color="red">*</font><b>Category: </b>
                                <select id="newAuctionCategorySelect">
                                    <option value=1>Apparel</option>
                                    <option value=2>Equipment</option>
                                    <option value=3>Vehicles</option>
                                    <option value=4>Property</option>
                                    <option value=5>Other</option>
                                </select>
                                <br/>
                                <h2>Time</h2>
                                <br/>
                                <font color="red">*</font><b>Start Date Time:</b> <input id="startDateTimePicker" value="startDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                                <span class="validity"></span>
                                <br/>
                                <font color="red">*</font><b>End Date Time:</b> <input id="endDateTimePicker" value="endDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                                <span class="validity"></span>
                                <br/>
                                <h2>Bidding Information</h2>
                                <font color="red">*</font><b>Reserve Price:</b> $<input v-model.number="reservePrice" placeholder="0" type="number" required/>
                                <br/>
                                <font color="red">*</font><b>Starting Bid:</b> $<input v-model.number="startingBid" placeholder="0" type="number" required/>
                                <h2>Photo</h2>
                                Choose photo to upload: 
                                <input id="photoUploadFile" name="photoUploadFile" type="file" style="float:right" accept=".jpg, .jpeg, .png">
                                <div id="uploadAuctionPhotoDiv">
                                    
                                </div>
                            </form>
                            <div v-if="invalidCreationInput">
                                <font color="red">* {{ this.invalidCreationString }}</font>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary" form="createAuctionForm" >
                                Create New Auction
                            </button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div>
    

</template>

<script>
    export default {
        data () {
            return {
                error: "",
                errorFlag: false,
                auctions: [],

                //Auction Search and Filter Fields
                searchedTitle: "",
                categorySelected: "",

                //Auction Creation Fields
                invalidCreationInput: "",
                invalidCreationString: "",
                title: "",
                description: "",
                createCategorySelected: "",
                startDateTime: "",
                endDateTime: "",
                reservePrice: "",
                startingBid: "",
                createdAuctionId: "",

                //Auction Search Query Fields
                auctionsIWon: "",
                auctionsIHaveBidOn: "",
                myAuctionsYetToComplete: "",
                myFinishedWonAuctions: "",
                myFinishedNonWonAuctions: "",

                loggedInUserId: parseInt(localStorage.getItem("user_id")),
                startIndex: 0


                
            }
        },
        mounted: function() {
            
            this.getAuctions();
            this.auctionsIHaveBidOn = "bidder=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
            this.myAuctionsYetToComplete = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
            this.myFinishedWonAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=won";
            this.myFinishedNonWonAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=expired";
            document.getElementById("photoUploadFile").addEventListener('change', this.updateImageDisplay);

            var startDate = new Date();
            document.getElementById("startDateTimePicker").value = startDate.toISOString().substring(0,16);
            var endDate = new Date();
            document.getElementById("endDateTimePicker").value = endDate.toISOString().substring(0,16);
                



        },
        methods: {

            getNextAuctions: function() {
                if(this.auctions.length == 8) {
                    this.startIndex += 8;
                    this.getAuctions();
                }
               

            },

            getPreviousAuctions: function() {
                this.startIndex -= 8;
                if(this.startIndex < 0) {
                    this.startIndex = 0;
                }
                this.getAuctions();

            },

            updateImageDisplay: function() {
                console.log("Hello");
                var files = document.getElementById("photoUploadFile").files;
                var photoDiv = document.getElementById("uploadAuctionPhotoDiv");

                while(photoDiv.firstChild) {
                    photoDiv.removeChild(photoDiv.firstChild);
                }

                var img = document.createElement("img");
                img.src = window.URL.createObjectURL(files[0]);
                photoDiv.appendChild(img);

            },

            getAuctions: function() {
                this.$http.get('http://localhost:4941/api/v1/auctions?startIndex=' + this.startIndex +'&count=8')
                .then(function(response) {
                    this.auctions = response.data;
                    
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                    

                });
            },

            createAuction: function() {
                var e = document.getElementById("newAuctionCategorySelect");
                this.createCategorySelected = e.options[e.selectedIndex].value;

                this.startDateTime = Date.parse(document.getElementById("startDateTimePicker").value);
                this.endDateTime = Date.parse(document.getElementById("endDateTimePicker").value);

                if(this.title === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a title!";
                } else if(this.description === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a description!";
                } else if(this.startDateTime === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a starting date!";
                } else if(this.endDateTime === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a ending date!";
                } else if(this.startingBid === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a starting bid!";
                } else if(this.reservePrice === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a reserve price!";
                } else if(this.reservePrice < 0){
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a reserve price that is valid!";
                } else if(this.startingBid < 0) {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a starting bid that is valid!";
                } else {
                    this.$http.post('http://localhost:4941/api/v1/auctions', 
                    JSON.stringify({
                        "categoryId": parseInt(this.createCategorySelected),
                        "title": this.title,
                        "description": this.description,
                        "startDateTime": this.startDateTime,
                        "endDateTime": this.endDateTime,
                        "reservePrice": parseInt(this.reservePrice),
                        "startingBid": parseInt(this.startingBid)
                    }), 
                    {headers: {'X-Authorization': localStorage.getItem("token")}})
                    .then(function(response) {
                        $('#createAuctionModal').modal('hide');
                        this.title = "";
                        this.description = "";
                        this.startDateTime = "";
                        this.endDateTime = "";
                        this.startingBid = "";
                        this.reservePrice = "";
                        this.createdAuctionId = response.body.id;
                    }, function(err) {
                        this.invalidCreationInput = true;
                        this.invalidCreationString = "Please enter a valid auction! (Not before today and the end date is after the start date)";
                    })
                    .then(function(response) {
                        if(!this.invalidCreationInput) {
                            var files = document.getElementById("photoUploadFile").files;
                            $('#createAuctionModal').modal('hide');
                            this.$http.post('http://localhost:4941/api/v1/auctions/' + this.createdAuctionId + '/photos', 
                            files[0], {headers: {
                                'X-Authorization': localStorage.getItem("token"),
                                'Content-Type': files[0].type
                            }})
                            .then(function(response) {
                                console.log(response);
                                this.getAuctions();
                        
                            });

                        }

                    });
                }


            },

            searchAuctions: function(searchQuery) {
                console.log(searchQuery);
                this.$http.get('http://localhost:4941/api/v1/auctions?' + searchQuery)
                .then(function(response) {
                    if(response.data.length > 0) {
                        this.auctions = response.data;
                    } else {
                        this.auctions = [];
                    }
                     
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            searchWonAuctions: function() {
                this.$http.get('http://localhost:4941/api/v1/my_won_auctions',
                {headers: {'X-Authorization': localStorage.getItem("token")}})
                .then(function(response) {
                    if(response.data.length > 0) {
                        this.auctions = response.data;
                    } else {
                        this.auctions = [];
                    }
                     
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            searchAuctionsOnTitle: function() {
                this.$http.get('http://localhost:4941/api/v1/auctions?q=' + this.searchedTitle)
                .then(function(response) {
                     this.auctions = response.data;
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            filterAuctionsByCategory: function() {
                var e = document.getElementById("filterCategorySelect");
                this.categorySelected = e.options[e.selectedIndex].value;
                if(this.searchedTitle !== "") {
                    this.$http.get('http://localhost:4941/api/v1/auctions?q=' + this.searchedTitle + '&category-id=' + this.categorySelected)
                    .then(function(response) {
                        
                        this.auctions = response.data;
                    }, function(error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
                } else {
                    this.$http.get('http://localhost:4941/api/v1/auctions?category-id=' + this.categorySelected)
                    .then(function(response) {
                       
                        this.auctions = response.data;
                    }, function(error) {
                        this.error = error;
                        this.errorFlag = true;
                    }); 
                }

            }

        }
    }
</script>

<style scoped>

.wrapper {
    display: flex;
    align-items: stretch;
}

#sidebar {
    min-width: 250px;
    max-width: 250px;
    min-height: 100vh;
}

#sidebar.active {
    margin-left: -250px;
}

a[data-toggle="collapse"] {
    position: relative;
}

a[aria-expanded="false"]::before, a[aria-expanded="true"]::before {
    /* content: '\e259'; */
    display: block;
    position: absolute;
    right: 20px;
    font-family: 'Glyphicons Halflings';
    font-size: 0.6em;
}

a[aria-expanded="true"]::before {
    /* content: '\e260'; */
}

@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
    }
    #sidebar.active {
        margin-left: 0;
    }
}

@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";


body {
    font-family: 'Poppins', sans-serif;
    background: #fafafa;
}

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

a, a:hover, a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}

#sidebar {
    /* don't forget to add all the previously mentioned styles here too */
    color: #fff;
    transition: all 0.3s;
}

#sidebar .sidebar-header {
    padding: 20px;
    background: #747474;
}

#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
}
#sidebar ul li a:hover {
    color: #747474;
    background: #fff;
}

#sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #747474;
}
ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #747474;
}


</style>
