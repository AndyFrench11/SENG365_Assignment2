<template>
    <div>
        <div v-if="errorFlag" style="color: blue;">
            {{ error }}
        </div>

        <div v-if="$route.params.auctionId">
            <div id="auction">
                <router-link :to="{ name: 'auctions'}">Back to Auctions</router-link>

                <br /><br />

                <h1>{{ currentAuction.title }}</h1>

                <div id="photo"></div>

                <h4>Description: </h4>{{ currentAuction.description }} 
                <br/>
                <b>Start Date Time: </b>{{ new Date(parseInt(currentAuction.startDateTime)).toLocaleString()  }}
                <br/>
                <b>End Date Time: </b>{{ new Date(parseInt(currentAuction.endDateTime)).toLocaleString() }}
                <br/>
                <h4>Current Bid: ${{ currentAuction.currentBid }}</h4>
                <h4><u>Bid History</u></h4>

                <table align="center">
                    <tr>
                        <td><b>Amount</b></td>
                        <td><b>Date and Time</b></td>
                        <td><b>Buyer Username</b></td>
                    </tr>
                    <tr v-for="bid in currentAuction.bids">
                        <td>{{ bid.amount }}</td>
                        <td>{{ new Date(parseInt(bid.datetime)).toLocaleString() }}</td>
                        <td>{{ bid.buyerUsername }}</td>
                    </tr>
                </table>
                
                <br/>
                <b>Seller Username: </b>{{ currentAuction.seller.username }}
                <br/>

                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editAuctionModal">Edit Auction</button>


            </div>

            <div class="modal fade" id="editAuctionModal" tabindex="-1" role="dialog" aria-labelledby="editAuctionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editAuctionModalLabel">Edit Auction</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <h2>Details</h2>
                                <b>Title:</b> <input v-model="title" placeholder="title" type="text"/>
                                <br/>
                                <b>Description:</b> <input v-model="description" placeholder="descripton" type="text"/>
                                <br/>
                                <b>Category: </b>
                                <select id="newAuctionCategorySelect">
                                    <option value="1">Apparel</option>
                                    <option value="2">Equipment</option>
                                    <option value="3">Vehicles</option>
                                    <option value="4">Property</option>
                                    <option value="5">Other</option>
                                </select>
                                <br/>
                                <h2>Time</h2>
                                <br/>
                                <b>Start Date Time:</b> <input id="startDateTimePicker" value="startDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                                <span class="validity"></span>
                                <br/>
                                <b>End Date Time:</b> <input id="endDateTimePicker" value="endDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                                <span class="validity"></span>
                                <br/>
                                <h2>Bidding Information</h2>
                                <b>Reserve Price:</b> <input v-model="reservePrice" placeholder="$0" type="text"/>
                                <br/>
                                <b>Starting Bid:</b> <input v-model="startingBid" placeholder="$0" type="text"/>
                            </form>
                            <div v-if="invalidCreationInput">
                                <font color="red">* {{ this.invalidCreationString }}</font>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="editAuction($route.params.auctionId)">
                                Edit Auction
                            </button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>


        <div v-else>
            <div id="photo"></div>
            <h1>Auctions</h1>
            <router-link :to="{ name: 'home'}">Back to Home</router-link>
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
            <div id="users">
                <table align="center">
                    <tr v-for="auction in auctions">
                        <td>{{ auction.title }}</td>
                        <td><router-link :to="{ name: 'auction', params: { auctionId: auction.id}}" @click.native="getSingleAuction($route.params.auctionId)" >View</router-link></td>
                    </tr>
                </table>
            </div>

            <br/>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createAuctionModal">Create New Auction</button>

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
                            <form>
                                <h2>Details</h2>
                                <font color="red">*</font><b>Title:</b> <input v-model="title" placeholder="title" type="text"/>
                                <br/>
                                <font color="red">*</font><b>Description:</b> <input v-model="description" placeholder="descripton" type="text"/>
                                <br/>
                                <font color="red">*</font><b>Category: </b>
                                <select id="newAuctionCategorySelect">
                                    <option value="1">Apparel</option>
                                    <option value="2">Equipment</option>
                                    <option value="3">Vehicles</option>
                                    <option value="4">Property</option>
                                    <option value="5">Other</option>
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
                                <font color="red">*</font><b>Reserve Price:</b> <input v-model="reservePrice" placeholder="$0" type="text"/>
                                <br/>
                                <font color="red">*</font><b>Starting Bid:</b> <input v-model="startingBid" placeholder="$0" type="text"/>
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
                            <button type="button" class="btn btn-primary" v-on:click="createAuction()">
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
                startDateTime: new Date(parseInt((new Date).getTime())),
                endDateTime: Date.now(),
                reservePrice: "",
                startingBid: "",

                //Get Single Auction Fields
                currentAuction: ""
                
            }
        },
        mounted: function() {
            this.getAuctions();
            if(this.$route.params.auctionId){
                this.getSingleAuction(this.$route.params.auctionId);
            }

            document.getElementById("photoUploadFile").addEventListener('change', this.updateImageDisplay);


        },
        methods: {
            updateImageDisplay: function() {
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
                this.reservePrice = Number(this.reservePrice);
                this.startingBid = parseInt(this.startingBid);
                this.createCategorySelected = parseInt(this.createCategorySelected);

                if(this.title === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a title!";
                } else if(this.description === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a description!";
                } else if(this.startDateTime === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a title!";
                } else if(this.endDateTime === "") {
                    this.invalidCreationInput = true;
                    this.invalidCreationString = "Please enter a title!";
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
                    this.invalidCreationString = "Please enter a reserve price that is valid!";
                } else {
                    $('#createAuctionModal').modal('hide');
                    this.$http.post('http://localhost:4941/api/v1/auctions', {
                        "categoryId": this.createCategorySelected,
                        "title": this.title,
                        "description": this.description,
                        "startDateTime": this.startDateTime,
                        "endDateTime": this.endDateTime,
                        "reservePrice": this.reservePrice,
                        "startingBid": this.startingBid
                    }, 
                    {headers: {'X-Authorization': localStorage.getItem("token")}})
                    .then(function(response) {
                        console.log(response);
                        this.getAuctions();
                        this.title = "";
                        this.description = "";
                        this.startDateTime = "";
                        this.endDateTime = "";
                        this.startingBid = "";
                        this.reservePrice = "";
                    });
                }


            },

            getSingleAuction: function(id) {
                this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
                .then(function(response) {
                    console.log(response);
                    this.currentAuction = response.data;
                    this.getAuctionPhoto(id);
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                });

            },

            getAuctionPhoto: function(id) {
                this.$http.get('http://localhost:4941/api/v1/auctions/' + id + '/photos')
                .then(function(response) {
                    console.log(response);
                    var photoDiv = document.getElementById("photo");
                    var img = document.createElement("img");
                    img.src = response.url;
                    photoDiv.appendChild(img);
                    //this.photoUrl = response.body;
                    //return response;
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
                        console.log(response);
                        this.auctions = response.data;
                    }, function(error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
                } else {
                    this.$http.get('http://localhost:4941/api/v1/auctions?category-id=' + this.categorySelected)
                    .then(function(response) {
                        console.log(response);
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
