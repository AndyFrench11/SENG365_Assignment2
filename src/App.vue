<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary" style="background-color: #00365e;">
      <a class="navbar-left"><img src="./assets/images.png" height="40" width="40"></a>
      <label class="navbar-brand">Andy's Auction Area</label>
      
      <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="nav nav-pills">
          <li class="nav-item">
              <router-link :to="{ name: 'home'}">Home</router-link>
          </li>
          <li class="nav-item">
              <router-link :to="{ name: 'auctions'}">Auctions</router-link>
          </li>
          <li class="nav-item">
              
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              My Account
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#" data-toggle="modal" data-target="#addUserModal">Register as New User</a>
              <br/>
              <div v-if="loggedInUserId">
                <router-link class="dropdown-item" :to="{ name: 'user'}">View My Info</router-link>
                <br/>
                <a class="dropdown-item" href="#" v-on:click="logoutUser()">Logout</a>
              </div>
              <div v-else>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#loginUserModal">Login</a>
                <br/>

              </div>
              
            </div>
          </li>

          </ul>
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
                        <h4 class="modal-title" id="addUserModalLabel"><font color="black">Register as New User</font></h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addUserForm" v-on:submit="addNewUser()">
                            <font color="red">*</font><font color="black"><b>Given Name:</b></font> <input v-model="givenName" placeholder="given name" type="text" required/>
                            <br/>
                            <font color="red">*</font><font color="black"><b>Family Name:</b></font> <input v-model="familyName" placeholder="family name" type="text" required/>
                            <br/>
                            <font color="red">*</font><font color="black"><b>Username:</b></font> <input v-model="username" placeholder="username" type="text" required/>
                            <br/>
                            <font color="red">*</font><font color="black"><b>Email:</b></font> <input v-model="email" placeholder="email" type="email" required/>
                            <br/>
                            <font color="red">*</font><font color="black"><b>Password:</b></font> <input v-model="password" placeholder="password" type="password" required/>
                            <br/>
                            <font color="red">*</font><font color="black"><b>Confirm Password:</b></font> <input v-model="confirmPassword" placeholder="confirm password" type="password" required/>
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


    </nav>
    <router-view></router-view>
      <nav class="navbar navbar-dark bg-primary" style="background-color: #00365e;">
      <label class="navbar-bottom">Andy French Enterprises T.M.</label>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      loggedInUserId: "",

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
      invalidLoginString: ""

    }
  },
  mounted: function() {
    this.loggedInUserId = parseInt(localStorage.getItem("user_id"));

  },
  methods: {

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

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: rgb(204, 204, 204);
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #ffffff;
  padding: 12px 20px;
}

.navbar-brand
{
  font-size: 30px;
}

.navbar {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    margin-bottom: 0;
}

.nav.nav-pills li a {
 line-height: 30px;
}

.nav-link.selected {
  color: #ffffff;
}




input[type=text], input[type=email], input[type=password] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
}

input:invalid+span:after {
    content: '✖';
    padding-left: 5px;
}

input:valid+span:after {
    content: '✓';
    padding-left: 5px;
}

table {
  text-align: center;
}

th, td {
    border-bottom: 1px solid #ddd;
}

td
{
    padding:0 15px 0 15px;
}

tr:hover {background-color: #f5f5f5;}

.dropdown-menu{
  background-color: #00365e;
  width: 180px;
}


</style>
