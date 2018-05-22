<template>
    <div>
        <div id="auction">
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
                        <form id="updateAuctionForm">
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
                        <button type="button" class="btn btn-primary" form="updateAuctionForm" v-on:click="editAuction($route.params.auctionId)">
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

</template>

<script>
    export default {
        data() {
            return {
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

            }
        }, 
        mounted: function() {
            this.getSingleAuction(this.$route.params.auctionId);
            
        },

        methods: {
            updateAuctionImageDisplay: function() {
                console.log("TESTER");
                var updateFiles = document.getElementById("updatePhotoUploadFile").files;
                var updatePhotoDiv = document.getElementById("updateUploadAuctionPhotoDiv");

                while(updatePhotoDiv.firstChild) {
                    updatePhotoDiv.removeChild(updatePhotoDiv.firstChild);
                }

                var updateImg = document.createElement("img");
                updateImg.src = window.URL.createObjectURL(updateFiles[0]);
                updatePhotoDiv.appendChild(updateImg);

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

                    document.getElementById("updatePhotoUploadFile").addEventListener('change', this.updateAuctionImageDisplay);




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
                            var files = document.getElementById("updatePhotoUploadFile").files;
                            $('#editAuctionModal').modal('hide');
                            this.$http.post('http://localhost:4941/api/v1/auctions/' + id + '/photos', 
                            files[0], {headers: {
                                'X-Authorization': localStorage.getItem("token"),
                                'Content-Type': files[0].type,
                            }})
                            .then(function(response) {
                                this.getSingleAuction(id);
                                console.log("Hello");
                                

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

        