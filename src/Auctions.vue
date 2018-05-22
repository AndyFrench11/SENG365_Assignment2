<template>
    <div>
        <div v-if="errorFlag" style="color: blue;">
            {{ error }}
        </div>

            <div id="photo"></div>
            <h1>Auctions</h1>
            
            <br/><br/>
            Search Auctions<form>
                <input v-model="searchedTitle" placeholder="Title"/>
                <input type="button" value="Go!" v-on:click="searchAuctionsOnTitle()">
            </form>
            Filter by category: <select id="filterCategorySelect">
                <option value="1">Apparel</option>
                <option value="2">Equipment</option>
                <option value="3">Vehicles</option>
                <option value="4">Property</option>
                <option value="5">Other</option>
            </select>
            <button type="button" v-on:click="filterAuctionsByCategory()">Go!</button>
            <br/><br/>
            <form>
                <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-primary" v-on:click="searchWonAuctions()">Auctions I Won</button>
                        <button type="button" class="btn btn-primary" v-on:click="searchAuctions(auctionsIHaveBidOn)">Auctions I Have Bid On</button>
                        <button type="button" class="btn btn-primary" v-on:click="searchAuctions(myAuctionsYetToComplete)">My Auctions Yet To Complete</button>
                        <button type="button" class="btn btn-primary" v-on:click="searchAuctions(myFinishedWonAuctions)">My Finished Won Auctions</button>
                        <button type="button" class="btn btn-primary" v-on:click="searchAuctions(myFinishedNonWonAuctions)">My Finished Non-Won Auctions</button>
                </div>
            </form>
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
            <div v-if="loggedInUserId">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createAuctionModal">Create New Auction</button>
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


                
            }
        },
        mounted: function() {
            
            this.getAuctions();
            this.auctionsIHaveBidOn = "bidder=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
            this.myAuctionsYetToComplete = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
            this.myFinishedWonAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=won";
            this.myFinishedNonWonAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=expired";
            document.getElementById("photoUploadFile").addEventListener('change', this.updateImageDisplay);
                
            



        },
        methods: {

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
                this.$http.get('http://localhost:4941/api/v1/auctions')
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


</style>
