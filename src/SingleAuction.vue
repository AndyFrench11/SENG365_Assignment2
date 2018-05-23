<template>
    <div>
        <br/>
        <div class="container">
            <div class="card-group">
                <div class="card border-secondary">
                    <div class="col-md-14">
                    <div class="card header">
                        <h5 class="card-header">{{ currentAuction.title }}</h5>
                    </div>
                    <img class="card-img-top" :src="'http://localhost:4941/api/v1/auctions/' + $route.params.auctionId + '/photos'" alt="">
                    <div class="card-footer">
                        Auction Photo
                    </div>
                    </div>
                </div>


                <div class="card border-secondary">
                <div class="col-md-14">
                <div class="card header">
                    <h5 class="card-header">Description</h5>
                </div>
                <div class="card-body">
                    <p class="lead">{{ currentAuction.description }}</p>
                    <hr class="my-4">
                    <div v-if="currentAuction.startDateTime > Date.now()">
                        <h3 class="lead"><font color="blue">Upcoming</font></h3>
                    </div>
                    <div v-else-if="currentAuction.endDateTime < Date.now()">
                        <h3 class="lead"><font color="red">Expired</font></h3>
                    </div>
                    <div v-else>
                        <h3 class="lead"><font color="green">Active</font></h3>
                    </div>
                    <p class="lead"><b>Start Date Time: </b>{{ new Date(parseInt(currentAuction.startDateTime)).toLocaleString()  }}</p>
                    <p class="lead"><b>End Date Time: </b>{{ new Date(parseInt(currentAuction.endDateTime)).toLocaleString() }}</p>
                    <hr class="my-4">
                    <p class="lead"><b>Starting Price: $</b>{{ currentAuction.startingBid }}</p>
                    <p class="lead"><b>Reserve Price: $</b>{{ currentAuction.reservePrice }}</p>
                    <p class="lead"><b>Current Bid: $</b>{{ currentAuction.currentBid }}</p>
                    <hr class="my-4">
                    <p class="lead"><b>Bid History</b></p>

                        <div v-if="currentAuction.bids.length > 0">

                            <div class="collapse" id="collapseExample">
                            <div class="card card-body">
                                <div v-for="bid in currentAuction.bids.reverse()">
                                    <p class="lead">${{ bid.amount }}</p>
                                    <p class="lead">{{ new Date(parseInt(bid.datetime)).toLocaleString() }}</p>
                                    <p class="lead">{{ bid.buyerUsername }}</p>
                                    <hr class="my-4">
                                </div>
                            </div>
                            </div>
                            <br/>
                            <button class="btn btn-outline-secondary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                Show
                            </button>
                            
                        </div>
                        <div v-else>
                            <p class="lead"><b>There are currently no bids for this auction.</b></p>
                        </div>
                    <hr class="my-4">
                    <div v-if="loggedInUserId != currentAuction.seller.id && currentAuction.startDateTime < Date.now() && currentAuction.endDateTime > Date.now()">
                        <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#makeBidModal"> Make a Bid</button>
                        <hr class="my-4">
                    </div>
                    
                    <p class="lead"><b>Seller</b></p>
                    <p class="lead">Username: {{ seller.username }}</p>
                    <p class="lead">Given Name: {{ seller.givenName }}</p>
                    <p class="lead">Family Name: {{ seller.familyName }}</p>    
                    <hr class="my-4">
                    <div v-if="(loggedInUserId == currentAuction.seller.id) && (currentAuction.bids.length == 0)">
                        <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#editAuctionModal">Edit Auction</button>
                    </div>
                </div>
                </div>
                
            </div>
            </div>
            <br/>
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
                        <form id="addBidForm" v-on:submit.prevent="addBid($route.params.auctionId, loggedInUserId)">

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Amount $</span>
                        </div>
                        <input class="form-control" v-model="bidAmount" placeholder="0" type="number" required/>
                        </div>

                        </form>
                        <div class="alert alert-danger" role="alert" v-if="invalidBidCreationInput">
                            <font color="red">* {{ this.invalidBidCreationString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-secondary" form="addBidForm">
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
                        <form id="updateAuctionForm" v-on:submit.prevent="editAuction($route.params.auctionId)">

                            <h2>Details</h2>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Title</span>
                            </div>
                            <input class="form-control" v-model="updateTitle" placeholder="" type="text"/>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Description</span>
                            </div>
                            <input class="form-control" v-model="updateDescription" placeholder="" type="text"/>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Category</span>
                            </div>
                                <select class="form-control" id="updateAuctionCategorySelect">
                                    <option value=1>Apparel</option>
                                    <option value=2>Equipment</option>
                                    <option value=3>Vehicles</option>
                                    <option value=4>Property</option>
                                    <option value=5>Other</option>
                                </select>
                            </div>

                            <h2>Time</h2>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Start Date Time</span>
                            </div>
                            <input class="form-control" id="updateStartDateTimePicker" value="updateStartDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30"/>
                            <span class="validity"></span>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">End Date Time</span>
                                
                            </div>
                            <input class="form-control" id="updateEndDateTimePicker" value="updateEndDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30"/>
                            <span class="validity"></span>
                            </div>

                            <h2>Bidding Information</h2>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Reserve Price $</span>
                            </div>
                            <input class="form-control" v-model.number="updateReservePrice" placeholder="0" type="number"/>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Starting Bid $</span>
                            </div>
                            
                            <input class="form-control" v-model.number="updateStartingBid" placeholder="0" type="number"/>
                            </div>

                            <h2>Photo</h2>
                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Upload a Photo</span>
                            </div>
                            <input class="form-control" id="updatePhotoUploadFile" name="updatePhotoUploadFile" type="file" style="float:right" accept=".jpg, .jpeg, .png">
                            </div>
                            <div id="updateUploadAuctionPhotoDiv"></div>
                            <br/>
                            <button type="button" class="btn btn-outline-danger" v-on:click="deleteAuctionPhoto()">
                            Delete Photo
                            </button>
                        </form>
                        <div class="alert alert-danger" role="alert" v-if="invalidUpdateInput">
                            <font color="red">* {{ this.invalidUpdateString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-secondary" form="updateAuctionForm">
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
            deleteAuctionPhoto: function() {
                
                this.$http.delete('http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/photos', 
                {headers: {'X-Authorization': localStorage.getItem("token")}})
                .then(function(response) {
                    console.log(response)
                    var updatePhotoDiv = document.getElementById("updateUploadAuctionPhotoDiv");
                    updatePhotoDiv.removeChild(updatePhotoDiv.firstChild);
                }, function(err) {
                    console.log(err);
                });




            },

            updateAuctionImageDisplay: function() {
                console.log("TESTER");
                var updateFiles = document.getElementById("updatePhotoUploadFile").files;
                var updatePhotoDiv = document.getElementById("updateUploadAuctionPhotoDiv");
            
                while(updatePhotoDiv.firstChild) {
                    updatePhotoDiv.removeChild(updatePhotoDiv.firstChild);
                }

                var updateImg = document.createElement("img");
                updateImg.height = 300;
                updateImg.width = 466;
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
                    img.height = 300;
                    img.width = 466;
                    img.src = 'http://localhost:4941/api/v1/auctions/' + id + '/photos';
                    photoDiv.appendChild(img);
                }).then(function(response) {
                    document.getElementById("updatePhotoUploadFile").addEventListener('change', this.updateAuctionImageDisplay);
                });

            },

            getAuctionPhoto: function(id) {
                this.$http.get('http://localhost:4941/api/v1/auctions/' + id + '/photos')
                .then(function(response) {
                    
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
                        console.log(err);
                        this.invalidUpdateInput = true;
                        this.invalidUpdateString = "Please enter a valid auction! (Not before today and the end date is after the start date)";
                    })
                    .then(function(response) {
                        if(!this.invalidUpdateInput) {
                            var files = document.getElementById("updatePhotoUploadFile").files;
                            if(files[0]) {
                                this.$http.post('http://localhost:4941/api/v1/auctions/' + id + '/photos', 
                                files[0], {headers: {
                                    'X-Authorization': localStorage.getItem("token"),
                                    'Content-Type': files[0].type,
                                }}
                                ).then(function(response) {
                                    console.log(response);
                                });
                            }
                        }
                    })
                    .then(function(response) {
                        if(!this.invalidUpdateInput){
                            this.getSingleAuction(id);
                            $('#editAuctionModal').modal('hide');
                            window.location.reload();
                        }
                        
                    });

                        
                 }
            }



        }

    }

                

</script>

<style scoped>

html,body {
    padding:0;
    margin:0;
    height:100%;
}

body {
    width:1600px;
}

.row {
    width:100%;
    height:50%;
}
.row div {
    width:50%;
    height:100%;
    float:left;
}

</style>

        