<template>
    <div>
        <img src="./assets/andyA.jpg">
        <h1>Andy's Auction App!</h1>
        <h2>Navigation</h2>
        <br/>
        <router-link :to="{ name: 'auctions'}">Auctions</router-link>
        <br/><br/>
        <div v-if="loggedInUserId === ''">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginUserModal">Login</button>
        </div>
        <div v-if="loggedInUserId !== ''">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal">Edit Current User</button>
            <button type="button" class="btn btn-primary" v-on:click="logoutUser()">Logout</button>
        </div>
        <br/>
        {{ loginString }}
        <br/><br/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addUserModal">Register as New User</button>

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
                            <b>Given Name</b>: <input v-model="updateGivenName" placeholder="givenName" type="text"/>
                            <br/>
                            <b>Family Name</b>: <input v-model="updateFamilyName" placeholder="family name" type="text"/>
                            <br/>
                            <b>Username</b>: <input v-model="updateUsername" placeholder="username" type="text"/>
                            <br/>
                            <b>Email</b>: <input v-model="updateEmail" placeholder="email" type="email"/>
                            <br/>
                            <b>Password</b>: <input v-model="updatePassword" placeholder="password" type="password"/>
                            <br/>
                            <b>Confirm Password</b>: <input v-model="updateConfirmPassword" placeholder="confirm password" type="password"/>
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
                        <form>
                            Username: <input v-model="loginUsername" placeholder="username" type="text"/>
                            <br/>
                            Email: <input v-model="loginEmail" placeholder="email" type="text"/>
                            <br/>
                            <font color="red">*</font><b>Password</b>: <input v-model="loginPassword" placeholder="password" type="password"/>
                        </form>
                        <div v-if="invalidLoginInput">
                            <font color="red">* {{ this.invalidLoginString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="loginUser()">
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
                        <form>
                            <font color="red">*</font><b>Given Name:</b> <input v-model="givenName" placeholder="given name" type="text"/>
                            <br/>
                            <font color="red">*</font><b>Family Name:</b> <input v-model="familyName" placeholder="family name" type="text"/>
                            <br/>
                            <font color="red">*</font><b>Username:</b> <input v-model="username" placeholder="username" type="text"/>
                            <br/>
                            <font color="red">*</font><b>Email:</b> <input v-model="email" placeholder="email" type="email"/>
                            <br/>
                            <font color="red">*</font><b>Password:</b> <input v-model="password" placeholder="password" type="password"/>
                            <br/>
                            <font color="red">*</font><b>Confirm Password:</b> <input v-model="confirmPassword" placeholder="confirm password" type="password"/>
                        </form>
                        <div v-if="invalidInput">
                            <font color="red">* {{ this.invalidString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="addUserButton" type="button" class="btn btn-primary" v-on:click="addNewUser()">
                            Add New User
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <br /> <br />

        <h2>Essential Links</h2>
        <ul>
        <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
        <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
        <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
        <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
        </ul>
        <h2>Ecosystem</h2>
        <ul>
        <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
        <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
        <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
        <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
        </ul>
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

                loggedInUserId: "",
                loginString: "",

                //Update User Variables
                updateUsername: "",
                updatePassword: "",
                updateConfirmPassword: "",
                updateEmail: "",
                updateGivenName: "",
                updateFamilyName: "",
                updateInvalidInput: false,
                updateInvalidString: "",

            }
        },
        mounted: function() {
            this.loginString = "No user is currently logged in."
            if(localStorage.getItem("token") !== "") {
                //UNSURE HOW TO DO THIS
            }

        },
        methods: {
            getLoggedInUser: function() {


            },

            updateUser: function() {
                //ADD in checks
                if(1) {

                } else {
                    $('#updateUserModal').modal('hide');
                    this.$http.patch('http://localhost:4941/api/v1/users/' + loggedInUserId, {

                    })
                    .then(function(result) {

                    });
                }


            },

            loginUser: function() {
                if(this.loginPassword === "") {
                    this.invalidLoginInput = true;
                    this.invalidLoginString = "You must enter a password to log in!";
                } else if((this.loginUsername === "") && (this.loginPassword === "")) {
                    this.invalidLoginInput = true;
                    this.invalidLoginString = "Please enter either a username or email to log in!";
                } else {
                    $('#loginUserModal').modal('hide');
                    var loginJSON = {};
                    if(this.loginUsername !== "") {
                        loginJSON["username"] = this.loginUsername;
                    }
                    if(this.loginEmail !== "") {
                        loginJSON["email"] = this.loginEmail;
                    }
                    loginJSON["password"] = this.loginPassword;
                    this.$http.post('http://localhost:4941/api/v1/users/login', loginJSON)
                    .then(function(response) {
                        this.loggedInUserId = response.body.id;
                        localStorage.setItem("token", response.body.token)
                        this.loginString = "Currently logged in as username: " + this.loginUsername + " with id: " + this.loggedInUserId;
                        this.loginUsername = "";
                        this.loginPassword = "";
                        this.loginEmail = "";
                        this.invalidLoginString = "";

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
                });
            },

            loginUserAfterCreated: function() {

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
                    $('#addUserModal').modal('hide');
                    this.$http.post('http://localhost:4941/api/v1/users', {
                            "username": this.username,
                            "givenName": this.givenName,
                            "familyName": this.familyName,
                            "email": this.email,
                            "password": this.password
                    })
                    .then(function(response) {
                        console.log(response);
                        this.givenName = "";
                        this.familyName = "";
                        this.confirmPassword = "";
                        this.invalidString = "";
                        this.loginUserAfterCreated();
                    })
                    .then(function(response) {
                        this.$http.post('http://localhost:4941/api/v1/users/login', {
                            "username": this.username,
                            "email": this.email,
                            "password": this.password
                    })
                    .then(function(response) {
                        console.log(response);
                        localStorage.setItem("token", response.body.token);
                        this.loggedInUserId = response.body.id;
                        this.loginString = "Currently logged in as username: " + this.username + " with id: " + this.loggedInUserId;
                        this.username = "";
                        this.email = "";
                        this.password = "";

                    });
                    });
                }
            }

        }
    }
</script>

<style scoped>

</style>
