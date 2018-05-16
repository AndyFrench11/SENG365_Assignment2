<template>
    <div>
        <div v-if="errorFlag" style="color: blue;">
            {{ error }}
        </div>

        <div v-if="$route.params.auctionId">
            <div id="auction">
                <router-link :to="{ name: 'auctions', params: { userId: $route.params.userId }}">Back to Auctions</router-link>

                <br />

                <h1>{{ currentAuction.title }}</h1>

                <div id="photoDiv"></div>

                <h4>Description: </h4>{{ currentAuction.description }} 
                <br/>
                <b>Start Date Time: </b>{{ new Date(parseInt(currentAuction.startDateTime)).toLocaleString()  }}
                <br/>
                <b>End Date Time: </b>{{ new Date(parseInt(currentAuction.endDateTime)).toLocaleString() }}
                <h4>Starting Price: ${{ currentAuction.startingBid }}</h4>
                <h4>Reserve Price: ${{ currentAuction.reservePrice }}</h4>
                <h4>Current Bid: ${{ currentAuction.currentBid }}</h4>
                <h4><u>Bid History</u></h4>

                <table align="center">
                    <div v-if="currentAuction.bids.length > 0">
                        <tr>
                            <td><b>Amount</b></td>
                            <td><b>Date and Time</b></td>
                            <td><b>Buyer Username</b></td>
                        </tr>

                        <div v-if="showBids">
                            <tr v-for="bid in currentAuction.bids.reverse()">
                                <td>{{ bid.amount }}</td>
                                <td>{{ new Date(parseInt(bid.datetime)).toLocaleString() }}</td>
                                <td>{{ bid.buyerUsername }}</td>
                            </tr>
                            <br/>
                            <button type="button" class="btn btn-primary" v-on:click="toggleBidsVisible()">Hide</button> 
                        </div>
                        <div v-else>
                            <br/>
                            <button type="button" class="btn btn-primary" v-on:click="toggleBidsVisible()">Show</button> 
                        </div>
                    </div>
                    <div v-else>
                        There are currently no bids for this auction.
                    </div>
                </table>
                <br/>
                <div v-if="loggedInUserId != currentAuction.seller.id">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#makeBidModal"> Make a Bid</button>
                </div>
                
                <h4><u>Seller</u></h4>
                <b>Username: </b>{{ seller.username }}
                <br/>
                <b>Given Name: </b>{{ seller.givenName }}
                <br/>
                <b>Family Name: </b>{{ seller.familyName }}
                <br/><br/>

                <div v-if="(loggedInUserId == currentAuction.seller.id) && (currentAuction.bids.length == 0)">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editAuctionModal">Edit Auction</button>
                </div>
                <br/><br/>


            </div>

            <div class="modal fade" id="makeBidModal" tabindex="-1" role="dialog" aria-labelledby="makeBidModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="makeBidModalLabel">Make A Bid</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="addBidForm" v-on:submit="addBid($route.params.auctionId, $route.params.userId)">
                                <font color="red">*</font><b>Enter bid amount: $</b> <input v-model="bidAmount" placeholder="0" type="number" required/>
                                <br/>
                            </form>
                            <div v-if="invalidBidCreationInput">
                                <font color="red">* {{ this.invalidBidCreationString }}</font>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary" form="addBidForm">
                                Add Bid
                            </button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editAuctionModal" tabindex="-1" role="dialog" aria-labelledby="editAuctionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="editAuctionModalLabel">Edit Auction</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <h2>Details</h2>
                                <b>Title:</b> <input id="updateTitleInput" v-model="updateTitle" type="text"/>
                                <br/>
                                <b>Description:</b> <input id="updateDescriptionInput" v-model="updateDescription" type="text"/>
                                <br/>
                                <b>Category: </b>
                                <select id="updateAuctionCategorySelect">
                                    <option value="1">Apparel</option>
                                    <option value="2">Equipment</option>
                                    <option value="3">Vehicles</option>
                                    <option value="4">Property</option>
                                    <option value="5">Other</option>
                                </select>
                                <br/>
                                <h2>Time</h2>
                                <br/>
                                <b>Start Date Time:</b> <input id="updateStartDateTimePicker" value="updateStartDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                                <span class="validity"></span>
                                <br/>
                                <b>End Date Time:</b> <input id="updateEndDateTimePicker" value="updateEndDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                                <span class="validity"></span>
                                <br/>
                                <h2>Bidding Information</h2>
                                <b>Reserve Price:</b> $<input id="updateReservePriceInput" v-model.number="updateReservePrice" placeholder="0" type="number" required/>
                                <br/>
                                <b>Starting Bid:</b> $<input id="updateStartingBidInput" v-model.number="updateStartingBid" placeholder="0" type="number" required/>
                                <h2>Photo</h2>
                                Choose photo to upload: 
                                <input id="updatePhotoUploadFile" name="updatePhotoUploadFile" type="file" style="float:right" accept=".jpg, .jpeg, .png">
                                <div id="updateUploadAuctionPhotoDiv">
                                    
                                </div>
                            </form>
                            <div v-if="invalidUpdateInput">
                                <font color="red">* {{ this.invalidUpdateString }}</font>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" v-on:click="editAuction($route.params.auctionId)">
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
            <form>
                <table align = "center">
                    <tr>
                        <td><input type="button" value="Auctions I Won" v-on:click="searchAuctions(auctionsIWon)"></td>
                        <td><input type="button" value="Auctions I Have Bid On" v-on:click="searchAuctions(auctionsIHaveBidOn)"></td>
                        <td><input type="button" value="My Auctions Yet To Complete" v-on:click="searchAuctions(myAuctionsYetToComplete)"></td>
                        <td><input type="button" value="My Finished Won Auctions " v-on:click="searchAuctions(myFinishedWonAuctions)"></td>
                        <td><input type="button" value="My Finished Non-Won Auctions" v-on:click="searchAuctions(myFinishedNonWonAuctions)"></td>
                    </tr>
                </table>
            </form>
            <br/>
            <div id="users">
                <div v-if="auctions.length != 0">
                    <table align="center">
                        <tr v-for="auction in auctions">
                            <td><img :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'" alt="" border=3 height=250 width=300></td>
                            <td>{{ auction.title }}</td>
                            <td><router-link :to="{ name: 'auction', params: { auctionId: auction.id, userId: $route.params.userId}}" @click.native="getSingleAuction($route.params.auctionId)" >View</router-link></td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                    <b>There are no auctions which match the searched criteria.</b>
                </div>

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
                            <form id="createAuctionForm">
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
                            <button type="button" class="btn btn-primary" form="createAuctionForm" v-on:click="createAuction()" >
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

                //Update Auction Fields
                invalidUpdateInput: "",
                invalidUpdateString: "",
                updateTitle: "",
                updateDescription: "",
                updateCreateCategorySelected: "",
                updateStartDateTime: "",
                updateEndDateTime: "",
                updateReservePrice: "",
                updateStartingBid: "",

                //Get Single Auction Fields
                currentAuction: "",

                //Bids fields
                showBids: false,
                bidAmount: "",
                invalidBidCreationInput: "",
                invalidBidCreationString: "",

                //Auction Fields
                seller: "",
                loggedInUserId: parseInt(localStorage.getItem("user_id")),

                //Auction Search Query Fields
                auctionsIWon: "",
                auctionsIHaveBidOn: "",
                myAuctionsYetToComplete: "",
                myFinishedWonAuctions: "",
                myFinishedNonWonAuctions: ""

                
            }
        },
        mounted: function() {
            
            this.getAuctions();
            if(this.$route.params.auctionId){
                this.getSingleAuction(this.$route.params.auctionId);
                document.getElementById("updatePhotoUploadFile").addEventListener('change', this.updateAuctionEditImageDisplay);

            } else {
                this.auctionsIWon = "winner=" + parseInt(localStorage.getItem("user_id")) + "&status=won";
                this.auctionsIHaveBidOn = "bidder=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
                this.myAuctionsYetToComplete = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
                this.myFinishedWonAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=won";
                this.myFinishedNonWonAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=expired";
                document.getElementById("photoUploadFile").addEventListener('change', this.updateImageDisplay);
                
            }



        },
        methods: {
            handleForm: function(event) { 
                event.preventDefault(); 
            }, 

            addBid: function(auctionId, userId) {
                if(this.bidAmount === "") {
                    this.invalidBidCreationInput = true;
                    this.invalidBidCreationString = "Please enter a bid amount!";
                } else if(this.bidAmount == 0) {
                    this.invalidBidCreationInput = true;
                    this.invalidBidCreationString = "Please enter a valid bid amount!";
                } else if(this.bidAmount < 0) {
                    this.invalidBidCreationInput = true;
                    this.invalidBidCreationString = "Please enter a bid amount greater than zero!";
                } else {
                    this.$http.post('http://localhost:4941/api/v1/auctions/' + auctionId + '/bids?amount=' + this.bidAmount, 
                    {},
                    {headers: {'X-Authorization': localStorage.getItem("token")}})
                    .then(function(response) {
                        
                        this.getSingleAuction(this.$route.params.auctionId);
                        $('#makeBidModal').modal('hide');

                    }, function(err) {
                        this.invalidBidCreationInput = true;
                        this.invalidBidCreationString = "Please ensure your bid is higher than the current bid!";
                    });
                }
            },

            getAuctionPhotoURL: function(id) {
                this.$http.get('http://localhost:4941/api/v1/auctions/' + id + '/photos')
                .then(function(response) {
                    return response.url;
                });
            },

            getSeller: function(id) {
                this.$http.get('http://localhost:4941/api/v1/users/' + id, 
                {headers: {'X-Authorization': localStorage.getItem("token")}})
                .then(function(response) {
                    this.seller = response.body;
                })
            },
            
            toggleBidsVisible: function() {
                this.showBids = !this.showBids;
            },

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

            updateAuctionEditImageDisplay: function() {
                var files = document.getElementById("updatePhotoUploadFile").files;
                var photoDiv = document.getElementById("updateUploadAuctionPhotoDiv");

                // while(photoDiv.firstChild) {
                //     photoDiv.removeChild(photoDiv.firstChild);
                // }

                var img = document.createElement("img");
                img.id = "uploadedPhoto";
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
                            if(files[0] == undefined) {
                                $('#createAuctionModal').modal('hide');
                                this.$http.post('http://localhost:4941/api/v1/auctions/' + this.createdAuctionId + '/photos', 
                                {}, {headers: {
                                    'X-Authorization': localStorage.getItem("token"),
                                }})
                                .then(function(response) {
                                    console.log(response);
                                    this.getAuctions();
                            
                                });

                            } else {
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

                        }

                    });
                }


            },


            getSingleAuction: function(id) {
                this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
                .then(function(response) {
                    
                    this.currentAuction = response.data;
                    this.getAuctionPhoto(id);
                    this.getSeller(this.currentAuction.seller.id);
                    
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                })
                .then(function(response) {
                    //Put in all of the edit auction modal fields
                    this.updateTitle = this.currentAuction.title;
                    this.updateDescription = this.currentAuction.description;

                    document.getElementById("updateAuctionCategorySelect").selectedIndex = this.currentAuction.categoryId - 1;

                    var startDate = new Date(this.currentAuction.startDateTime);
                    document.getElementById("updateStartDateTimePicker").value = startDate.toISOString().substring(0,16);
                    var endDate = new Date(this.currentAuction.endDateTime);
                    document.getElementById("updateEndDateTimePicker").value = endDate.toISOString().substring(0,16);

                    this.updateReservePrice = this.currentAuction.reservePrice;
                    this.updateStartingBid = this.currentAuction.startingBid;

                    var photoDiv = document.getElementById("updateUploadAuctionPhotoDiv");
                    var img = document.createElement("img");
                    img.src = 'http://localhost:4941/api/v1/auctions/' + id + '/photos';
                    photoDiv.appendChild(img);




                });

            },

            getAuctionPhoto: function(id) {
                this.$http.get('http://localhost:4941/api/v1/auctions/' + id + '/photos')
                .then(function(response) {
                    
                    var photoDiv = document.getElementById("photoDiv");

                    while(photoDiv.firstChild) {
                        photoDiv.removeChild(photoDiv.firstChild);
                    }

                    var img = document.createElement("img");
                    img.height = 500;
                    img.width = 600;
                    img.src = response.url;
                    photoDiv.appendChild(img);
                });
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

            },

            editAuction: function(id) {

                var e = document.getElementById("updateAuctionCategorySelect");
                this.updateCreateCategorySelected = e.options[e.selectedIndex].value;

                this.updateStartDateTime = Date.parse(document.getElementById("updateStartDateTimePicker").value);
                this.updateEndDateTime = Date.parse(document.getElementById("updateEndDateTimePicker").value);

                if(this.updateTitle === "") {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a title!";
                } else if(this.updateDescription === "") {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a description!";
                } else if(this.updateStartDateTime === "") {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a starting date!";
                } else if(this.updateEndDateTime === "") {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a ending date!";
                } else if(this.updateStartingBid === "") {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a starting bid!";
                } else if(this.updateReservePrice === "") {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a reserve price!";
                } else if(this.updateReservePrice < 0){
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a reserve price that is valid!";
                } else if(this.updateStartingBid < 0) {
                    this.invalidUpdateInput = true;
                    this.invalidUpdateString = "Please enter a starting bid that is valid!";
                } else {
                    this.$http.patch('http://localhost:4941/api/v1/auctions/' + id, 
                    JSON.stringify({
                        "categoryId": parseInt(this.updateCreateCategorySelected),
                        "title": this.updateTitle,
                        "description": this.updateDescription,
                        "startDateTime": this.updateStartDateTime,
                        "endDateTime": this.updateEndDateTime,
                        "reservePrice": parseInt(this.updateReservePrice),
                        "startingBid": parseInt(this.updateStartingBid)
                    }), 
                    {headers: {'X-Authorization': localStorage.getItem("token")}})
                    .then(function(response) {
                        console.log("update");

                    }, function(err) {
                        this.invalidUpdateInput = true;
                        this.invalidUpdateString = "Please enter a valid auction! (Not before today and the end date is after the start date)";
                    })
                    .then(function(response) {
                        if(!this.invalidUpdateInput) {
                            var files = document.getElementById("updatePhotoUploadFile").value;
                            $('#editAuctionModal').modal('hide');
                            this.$http.post('http://localhost:4941/api/v1/auctions/' + id + '/photos', 
                            files[0], {headers: {
                                'Content-Type': files[0].type,
                                'X-Authorization': localStorage.getItem("token")
                            }})
                            .then(function(response) {
                                console.log("Hello");
                                this.getSingleAuction(id);
                                

                            });
                        }

                    });
                }

            }

        }
    }
</script>

<style scoped>

</style>
