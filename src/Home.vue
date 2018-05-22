<template>

    <div>
        <div class="container">
            <div id="myCarousel" class="carousel slide" data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators">
                    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                    <li data-target="#myCarousel" data-slide-to="1"></li>
                    <li data-target="#myCarousel" data-slide-to="2"></li>
                </ol>

                <!-- Wrapper for slides -->
                <div class="carousel-inner">
                    <div class="item active">
                    <img src="./assets/city.jpg" alt="First Slide">
                      <div class="carousel-caption d-none d-md-block">
                        <h1><font color="white">Welcome to Andy's Auction Area!</font></h1>
                        <h3>The trading website that will change your life.</h3>
                    </div>
                    </div>

                    <div class="item">
                    <img src="./assets/bike.jpg" alt="Second Slide">
                        <div class="carousel-caption d-none d-md-block">
                        <h1><font color="white">Visit the auctions page to view all auctions!</font></h1>
                        <h3>Buy and Choose items as you wish!</h3>
                    </div>
                    </div>

                    <div class="item">
                    <img src="./assets/beach2.jpg" alt="Third Slide">
                    <div class="carousel-caption d-none d-md-block">
                        <h1><font color="white">Personalise your account in the my account page!</font></h1>
                        <h3>View and edit all of your details.</h3>
                    </div>
                    </div>
                </div>

                <!-- Left and right controls -->
                <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#myCarousel" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>

       

        
        <br/><br/>
        <div v-if="loggedInUserId === ''">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginUserModal">Login</button>
        </div>
        <div v-if="loggedInUserId !== ''">
            <button type="button" class="btn btn-primary" v-on:click="logoutUser()">Logout</button>
            <br/><br/>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#viewUserModal">View User Info</button>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal">Edit Current User</button>
        </div>
        <br/>
        {{ loginString }}
        <br/><br/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addUserModal">Register as New User</button>

        <div class="modal fade" id="viewUserModal" tabindex="-1" role="dialog" aria-labelledby="viewUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="viewUserModalLabel">View Current User</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h4>Details</h4>
                        <b>Username:</b> {{ this.loggedInUser.username }}
                        <br/>
                        <b>Given Name:</b> {{ this.loggedInUser.givenName }}
                        <br/>
                        <b>Family Name:</b> {{ this.loggedInUser.familyName }}
                        <br/>
                        <b>Email:</b> {{ this.loggedInUser.email }}
                        <br/>
                        <b>Account Balance:</b> ${{ this.loggedInUser.accountBalance }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog" aria-labelledby="editUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="editUserModalLabel">Edit Current User</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <b>Given Name</b>: <input id="updateGivenNameInput" v-model="updateGivenName" type="text"/>
                            <br/>
                            <b>Family Name</b>: <input id="updateFamilyNameInput" v-model="updateFamilyName"  type="text"/>
                        </form>
                        <div v-if="updateInvalidInput">
                            <font color="red">* {{ this.updateInvalidString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="updateUser()">
                            Edit User
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="loginUserModal" tabindex="-1" role="dialog" aria-labelledby="loginUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="loginUserModalLabel">Login Existing User</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <b>You must enter either a username or email to login.</b>
                        <form id="loginUserForm" v-on:submit="loginUser()">
                            Username: <input v-model="loginUsername" placeholder="username" type="text"/>
                            <br/>
                            Email: <input v-model="loginEmail" placeholder="email" type="text"/>
                            <br/>
                            <font color="red">*</font><b>Password</b>: <input v-model="loginPassword" placeholder="password" type="password" required/>
                        </form>
                        <div v-if="invalidLoginInput">
                            <font color="red">* {{ this.invalidLoginString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" form="loginUserForm">
                            Login
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="addUserModal" tabindex="-1" role="dialog" aria-labelledby="addUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="addUserModalLabel">Register as New User</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addUserForm" v-on:submit="addNewUser()">
                            <font color="red">*</font><b>Given Name:</b> <input v-model="givenName" placeholder="given name" type="text" required/>
                            <br/>
                            <font color="red">*</font><b>Family Name:</b> <input v-model="familyName" placeholder="family name" type="text" required/>
                            <br/>
                            <font color="red">*</font><b>Username:</b> <input v-model="username" placeholder="username" type="text" required/>
                            <br/>
                            <font color="red">*</font><b>Email:</b> <input v-model="email" placeholder="email" type="email" required/>
                            <br/>
                            <font color="red">*</font><b>Password:</b> <input v-model="password" placeholder="password" type="password" required/>
                            <br/>
                            <font color="red">*</font><b>Confirm Password:</b> <input v-model="confirmPassword" placeholder="confirm password" type="password" required/>
                        </form>
                        <div v-if="invalidInput">
                            <font color="red">* {{ this.invalidString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" form="addUserForm">
                            Add New User
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

                //Add User Variables
                username: "",
                password: "",
                confirmPassword: "",
                email: "",
                givenName: "",
                familyName: "",
                invalidInput: false,
                invalidString: "",

                //Login Variables
                loginUsername: "",
                loginPassword: "",
                loginEmail: "",
                invalidLoginInput: false,
                invalidLoginString: "",

                //Variables for the "logged in user" label
                loggedInUserId: "",
                loginString: "",
                loggedInUser: "",

                //Update User Variables
                updateGivenName: "",
                updateFamilyName: "",
                updateInvalidInput: false,
                updateInvalidString: "",

                slide: 0,
                sliding: null
                
            }
        },
        mounted: function() {
            this.loginString = "No user is currently logged in."
            if(localStorage.getItem("user_id") != null) {
                console.log("Hello");
                this.$http.get('http://localhost:4941/api/v1/users/' + localStorage.getItem("user_id"), 
                {headers: {'X-Authorization': localStorage.getItem("token")}})
                .then(function(response) {
                    this.loggedInUser = response.body;
                    this.loggedInUserId = localStorage.getItem("user_id");
                    this.loginString = "Currently logged in as username: " + response.body.username + " with id: " + localStorage.getItem("user_id");
                });
            }

            //Ensure user forms dont refresh when clicked.
            // $('#loginUserForm').submit(function(e) {
            var loginUser = document.getElementById("loginUserForm");
            loginUser.addEventListener('submit', this.handleForm);

            var createUser = document.getElementById("addUserForm");
            createUser.addEventListener('submit', this.handleForm);



        },
        methods: {
            onSlideStart (slide) {
            this.sliding = true
            },

            onSlideEnd (slide) {
            this.sliding = false
            },

            handleForm: function(event) { 
                event.preventDefault(); 
            }, 

            updateUser: function() {
                if(this.updateGivenName === "" && this.updateFamilyName === "") {
                    this.updateInvalidInput = true;
                    this.updateInvalidString = "No information entered to update!";
                } else {
                    var updateJSON = {};
                    if(this.updateGivenName !== "") {
                    updateJSON["givenName"] = this.updateGivenName;
                    }
                    if(this.updateFamilyName !== "") {
                        updateJSON["familyName"] = this.updateFamilyName;
                    }
                    $('#editUserModal').modal('hide');
                    this.$http.patch('http://localhost:4941/api/v1/users/' + this.loggedInUserId, updateJSON, 
                    {headers: {'X-Authorization': localStorage.getItem("token")}})
                    .then(function(response) {
                        console.log(response);
                        this.loggedInUser.givenName = this.updateGivenName;
                        this.loggedInUser.familyName = this.updateFamilyName; 
                        document.getElementById("updateGivenNameInput").placeholder = this.loggedInUser.givenName;
                        document.getElementById("updateFamilyNameInput").placeholder = this.loggedInUser.familyName;
                        this.updateGivenName = "";
                        this.updateFamilyName = "";


                    });
                }


            },

            loginUser: function() {
                if((this.loginUsername === "") && (this.loginPassword === "")) {
                    this.invalidLoginInput = true;
                    this.invalidLoginString = "Please enter either a username or email to log in!";
                } else {
                    
                    var loginJSON = {};
                    if(this.loginUsername !== "") {
                        loginJSON["username"] = this.loginUsername;
                    }
                    if(this.loginEmail !== "") {
                        loginJSON["email"] = this.loginEmail;
                    }
                    loginJSON["password"] = this.loginPassword;
                    console.log("Hello");
                    this.$http.post('http://localhost:4941/api/v1/users/login', loginJSON)
                    .then(function(response) {
                        $('#loginUserModal').modal('hide');
                        console.log(response);
                        console.log("GDAY");
                        this.loggedInUserId = response.body.id;
                        localStorage.setItem("token", response.body.token);
                        localStorage.setItem("user_id", response.body.id)
                        this.loginString = "Currently logged in as username: " + this.loginUsername + " with id: " + this.loggedInUserId;
                        this.loginUsername = "";
                        this.loginPassword = "";
                        this.loginEmail = "";
                        this.invalidLoginString = "";
                    }, function(err) {
                        this.invalidLoginInput = true;
                        this.invalidLoginString = "Please enter either a username or email to log in!";
                    }).then(function(response) {
                        if(!this.invalidLoginInput) {
                            this.$http.get('http://localhost:4941/api/v1/users/' + this.loggedInUserId, 
                            {headers: {'X-Authorization': localStorage.getItem("token")}})
                            .then(function(response) {
                                this.loggedInUser = response.body;
                                document.getElementById("updateGivenNameInput").placeholder = this.loggedInUser.givenName;
                                document.getElementById("updateFamilyNameInput").placeholder = this.loggedInUser.familyName;
                            });
                        }

                    });


                }
                
            },

            logoutUser: function() {
                this.$http.post('http://localhost:4941/api/v1/users/logout', 
                {},
                {headers: {'X-Authorization': localStorage.getItem("token")}})
                .then(function(response) {
                    this.loggedInUserId = "";
                    this.loginString = "No user is currently logged in.";
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_id");
                });
            },

            addNewUser: function() {
                if(this.username === "") {
                    this.invalidInput = true;
                    this.invalidString = "Please enter a username!";
                } else if(this.password === "") {
                    this.invalidInput = true;
                    this.invalidString = "Please enter a password!";
                } else if(this.confirmPassword === "") {
                    this.invalidInput = true;
                    this.invalidString = "Please confirm your password!";
                } else if(this.email === "") {
                    this.invalidInput = true;
                    this.invalidString = "Please enter an email!";
                } else if(this.familyName === "") {
                    this.invalidInput = true;
                    this.invalidString = "Please enter a family name!";
                } else if(this.givenName === "") {
                    this.invalidInput = true;
                    this.invalidString = "Please enter a given name!";
                 } else if(this.password !== this.confirmPassword) {
                    this.invalidInput = true;
                    this.invalidString = "Password fields do not match!";
                 } else if(!this.email.includes("@")) {
                     this.invalidInput = true;
                     this.invalidString = "Please enter a valid email!";
                 } else {
                    
                    this.$http.post('http://localhost:4941/api/v1/users', {
                            "username": this.username,
                            "givenName": this.givenName,
                            "familyName": this.familyName,
                            "email": this.email,
                            "password": this.password
                    })
                    .then(function(response) {
                        //Check for error returned by the server for duplicates
                            this.givenName = "";
                            this.familyName = "";
                            this.confirmPassword = "";
                            this.invalidString = "";
                        
                    }, function(err) {
                        console.log(err);
                        this.invalidInput = true;
                        this.invalidString = "The username-email combination you have entered is already taken!";
                    })
                    .then(function(response) {
                        if(!this.invalidInput) {
                            $('#addUserModal').modal('hide');
                            this.$http.post('http://localhost:4941/api/v1/users/login', {
                            "username": this.username,
                            "email": this.email,
                            "password": this.password
                        })
                        .then(function(response) {
                            console.log(response);
                            localStorage.setItem("token", response.body.token);
                            localStorage.setItem("user_id", response.body.id)
                            this.loggedInUserId = response.body.id;
                            this.loginString = "Currently logged in as username: " + this.username + " with id: " + this.loggedInUserId;
                            this.username = "";
                            this.email = "";
                            this.password = "";
                            this.$http.get('http://localhost:4941/api/v1/users/' + response.body.id, 
                            {headers: {'X-Authorization': localStorage.getItem("token")}})
                            .then(function(response) {
                                this.loggedInUser = response.body;
                            })

                        });
                        }

                    });
                }
            }

        }
    }
</script>

<style scoped>

.carousel {
  width:1200px;
  height:500px;
}

</style>
