<template>
    <div>
        <div v-if="errorFlag" style="color: blue;">
            {{ error }}
        </div>


        <div class="wrapper">

            <nav id="sidebar" style="background-color: #343a40!important;">
                <!-- Sidebar Header -->
                <div class="sidebar-header">
                    <h3>Auctions</h3>
                    <h5>{{ searchCriteria }}</h5>
                </div>

                <!-- Sidebar Links -->
                <ul class="list-unstyled components">
                    <li><a href="#" v-on:click="getAuctions()">All Auctions</a></li>
                    <br/>

                    <div v-if="loggedInUserId">
                        <li><!-- Link with dropdown items -->
                        <a href="#buyingSubmenu" data-toggle="collapse" aria-expanded="false">Buying</a>
                        <ul class="collapse list-unstyled" id="buyingSubmenu">
                            <li><a class="download" href="#" v-on:click="searchWonAuctions()">→ Won</a></li>
                            <br/>
                            <li><a href="#" v-on:click="searchAuctions(auctionsIHaveBidOn, 'Bid On')">→ Bid On</a></li>
                        </ul></li>

                        <br/>

                        <li><!-- Link with dropdown items -->
                        <a href="#sellingSubmenu" data-toggle="collapse" aria-expanded="false">Selling</a>
                        <ul class="collapse list-unstyled" id="sellingSubmenu">
                            <li><a href="#" v-on:click="searchAuctions(myAuctionsYetToComplete, 'Upcoming')">→ Upcoming</a></li>
                            <br/>
                            <li><a href="#" v-on:click="searchAuctions(myActiveAuctions, 'Active')">→ Active</a></li>
                            <br/>
                            <li><a href="#" v-on:click="searchAuctions(myFinishedWonAuctions, 'Sold')">→ Sold</a></li>
                            <br/>
                            <li><a href="#" v-on:click="searchAuctions(myFinishedNonWonAuctions, 'Not Sold')">→ Not Sold</a></li>
                        </ul></li>
                    </div>

                </ul>

                <ul class="list-unstyled CTAs">
                    <li><!-- Link with dropdown items -->
                    <a href="#filterSubmenu" data-toggle="collapse" aria-expanded="false">Filter</a>
                    <ul class="collapse list-unstyled" id="filterSubmenu">
                        <li><a href="#" v-on:click="filterAuctionsByCategory(1)">→ Apparel</a></li>
                        <br/>
                        <li><a href="#" v-on:click="filterAuctionsByCategory(2)">→ Equipment</a></li>
                        <br/>
                        <li><a href="#" v-on:click="filterAuctionsByCategory(3)">→ Vehicles</a></li>
                        <br/>
                        <li><a href="#" v-on:click="filterAuctionsByCategory(4)">→ Property</a></li>
                        <br/>
                        <li><a href="#" v-on:click="filterAuctionsByCategory(5)">→ Other</a></li>
                    </ul></li>
                </ul>
            </nav>

            <div id="content">
                <nav class="navbar navbar-default" style="background-color: #343a40!important; border-color: white;">
                    <div class="container">


                        <div v-if="loggedInUserId">
                            <ul class="nav navbar-nav navbar-left">
                            <form class="form-inline">
                                <button class="btn btn-outline-light" type="button" data-toggle="modal" data-target="#createAuctionModal">Create New Auction</button>
                            </form>
                            </ul>
                        </div>

                        
                            <ul class="pagination justify-content-center">
                                <button class="btn btn-outline-light" type="button" v-on:click="getPreviousAuctions()">Previous</button>
                                <button class="btn btn-outline-light" type="button" v-on:click="getNextAuctions()">Next</button>
                            </ul>
                            
                          <form class="form-inline">
                                <input class="form-control mr-sm-2" v-model="searchedTitle" type="search" placeholder="Search" aria-label="Search">
                                <button class="btn btn-outline-light my-2 my-sm-0" type="button" v-on:click="searchAuctionsOnTitle()">Search</button>
                            </form>


                    </div>
                </nav>

                <br/>
            
                <div v-if="auctions.length != 0">
                        <div class="container">
                            <div class="card-columns">
                                <div v-for="auction in auctions">
                                    <div class="card border-secondary">
                                        <div class="col-md-14">
                                        <div class="card header">
                                            <h5 class="card-header">{{ auction.title }}</h5>
                                        </div>
                                        <img class="card-img-top" :src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'" alt="">
                                        
                                        <div class="card-body">
                                            <div v-if="auction.startDateTime > Date.now()">
                                                <h5 class="card-title"><font color="blue">Upcoming</font></h5>
                                            </div>
                                            <div v-else-if="auction.endDateTime < Date.now()">
                                                <h5 class="card-title"><font color="red">Expired</font></h5>
                                            </div>
                                            <div v-else>
                                                <h5 class="card-title"><font color="green">Active</font></h5>
                                            </div>
                                            <p class="card-text">Highest Bid: ${{ auction.currentBid }}</p>
                                            <p class="card-text">{{ auction.categoryTitle }}</p>
                                            
              
                                        </div>
                                        <div class="card-footer">
                                            <router-link :to="{ name: 'auction', params: { auctionId: auction.id}}">
                                                <button class="btn btn-outline-secondary">View</button>
                                            </router-link>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                </div>
                <div width=100% v-else style="padding-left: 20px">
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
                            <form id="createAuctionForm" v-on:submit.prevent="createAuction()">

                            <h2>Details</h2>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Title</span>
                            </div>
                            <input class="form-control" v-model="title" placeholder="" type="text" required/>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Description</span>
                            </div>
                            <input class="form-control" v-model="description" placeholder="" type="text" required/>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Category</span>
                            </div>
                                <select class="form-control" id="newAuctionCategorySelect">
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
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Start Date Time</span>
                            </div>
                            <input class="form-control" id="startDateTimePicker" value="startDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                            <span class="validity"></span>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>End Date Time</span>
                                
                            </div>
                            <input class="form-control" id="endDateTimePicker" value="endDateTime" type="datetime-local" min="1970-06-01T08:30" max="2025-06-30T16:30" required/>
                            <span class="validity"></span>
                            </div>
                                
                            <h2>Bidding Information</h2>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Reserve Price $</span>
                            </div>
                            <input class="form-control" v-model.number="reservePrice" placeholder="0" type="number" required/>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Starting Bid $</span>
                            </div>
                            
                            <input class="form-control" v-model.number="startingBid" placeholder="0" type="number" required/>
                            </div>

                            <h2>Photo</h2>
                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Upload a Photo</span>
                            </div>
                            <input class="form-control" id="photoUploadFile" name="photoUploadFile" type="file" style="float:right" accept=".jpg, .jpeg, .png">
                            </div>
                            <div id="uploadAuctionPhotoDiv"></div>
                            </form>
                            <div class="alert alert-danger" role="alert" v-if="invalidCreationInput">
                                <font color="red">* {{ this.invalidCreationString }}</font>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-outline-secondary" form="createAuctionForm" >
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
                startIndex: 0,
                searchCriteria: ""


                
            }
        },
        mounted: function() {
            
            this.getAuctions();
            this.auctionsIHaveBidOn = "bidder=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
            this.myAuctionsYetToComplete = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=upcoming";
            this.myActiveAuctions = "seller=" + parseInt(localStorage.getItem("user_id")) + "&status=active";
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
                if(this.auctions.length == 9) {
                    this.startIndex += 9;
                    this.getAuctions();
                }
               

            },

            getPreviousAuctions: function() {
                this.startIndex -= 9;
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
                img.height = 300;
                img.width = 466;
                img.src = window.URL.createObjectURL(files[0]);
                photoDiv.appendChild(img);

            },

            getAuctions: function() {
                this.searchCriteria = "";
                this.$http.get('http://localhost:4941/api/v1/auctions?startIndex=' + this.startIndex +'&count=9')
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

            searchAuctions: function(searchQuery, type) {
                

                switch(type) {
                    case 'Bid On':
                        this.searchCriteria = "→ Buying: Bid On";
                        break;
                    case 'Active':
                        this.searchCriteria = "→ Selling: Active";
                        break;
                    case 'Upcoming':
                        this.searchCriteria = "→ Selling: Upcoming";
                        break;
                    case 'Sold':
                        this.searchCriteria = "→ Selling: Sold";
                        break;
                    case 'Not Sold':
                        this.searchCriteria = "→ Selling: Not Sold";
                        break;

                }

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
                this.searchCriteria = "→ Buying: Won";
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
                this.searchCriteria = "→ Search: " + this.searchedTitle;
                this.$http.get('http://localhost:4941/api/v1/auctions?q=' + this.searchedTitle)
                .then(function(response) {
                     this.auctions = response.data;
                }, function(error) {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            filterAuctionsByCategory: function(categorySelected) {
                switch(categorySelected) {
                    case 1:
                        this.searchCriteria = "→ Filter: Apparel";
                        break;
                    case 2:
                        this.searchCriteria = "→ Filter: Equipment";
                        break;
                    case 3:
                        this.searchCriteria = "→ Filter: Vehicles";
                        break;
                    case 4:
                        this.searchCriteria = "→ Filter: Property";
                        break;
                    case 5:
                        this.searchCriteria = "→ Filter: Other";
                        break;
                }
                this.categorySelected = categorySelected;
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

.navbar
{
  min-width: 1200px;
  width: 1200px; 

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
    border-bottom: 1px solid #747474;
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

.card-footer{
    text-align: center;
}


</style>
