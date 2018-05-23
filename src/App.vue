<template>
  <div id="app">
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-light">
        <a class="navbar-left"><img src="./assets/images.png" height="40" width="40"></a>
        <a class="navbar-brand" href="#">Auctions R' Us</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link :to="{ name: 'home'}">
                    <a class="nav-link" href="#">Home</a>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'auctions'}">
                    <a class="nav-link" href="#">Auctions</a>
                </router-link>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" style href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                My Account
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#addUserModal">Register as New User</a>
                <div v-if="loggedInUserId">
                    <router-link :to="{ name: 'user'}">
                        <a class="dropdown-item" href="#">View My Info</a>
                    </router-link>
                    <a class="dropdown-item" href="#" v-on:click="logoutUser()">Logout</a>
                </div>
                <div v-else>
                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#loginUserModal">Login</a>
                </div>
                </div>
            </li>
            </ul>
        </div>
    </nav>





    

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
                        <p class="lead"><b>You must enter either a username or email to login.</b></p>

                        <form id="loginUserForm" v-on:submit.prevent="loginUser()">

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Username</span>
                        </div>
                        <input class="form-control" v-model="loginUsername" placeholder="" type="text"/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Email</span>
                        </div>
                        <input class="form-control" v-model="loginEmail" placeholder="" type="email"/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Password</span>
                        </div>
                        <input class="form-control" v-model="loginPassword" placeholder="" type="password" required/>
                        </div>
                        </form>
                        <div class="alert alert-danger" role="alert" v-if="invalidLoginInput">
                            <font color="red">* {{ this.invalidLoginString }}</font>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-secondary" form="loginUserForm">
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
                        
                        <form id="addUserForm" v-on:submit.prevent="addNewUser()">

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Given Name</span>
                        </div>
                        <input class="form-control" v-model="givenName" placeholder="" type="text" required/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Family Name</span>
                        </div>
                        <input class="form-control" v-model="familyName" placeholder="" type="text" required/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Username</span>
                        </div>
                        <input class="form-control" v-model="username" placeholder="" type="text" required/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Email</span>
                        </div>
                        <input class="form-control" v-model="email" placeholder="" type="email" required/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Password</span>
                        </div>
                        <input class="form-control" v-model="password" placeholder="" type="password" required/>
                        </div>

                        <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1"><font color="red">*</font>Confirm Password</span>
                        </div>
                        <input class="form-control" v-model="confirmPassword" placeholder="" type="password" required/>
                        </div>
                        <div class="alert alert-danger" role="alert" v-if="invalidInput">
                            <font color="red">* {{ this.invalidString }}</font>
                        </div>

                        </form>

                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-outline-secondary" form="addUserForm">
                            Add New User
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    <router-view></router-view>
      <nav class="navbar navbar-dark bg-dark">
      <label class="navbar-bottom" style="color: white;">Auctions R' Us Enterprises T.M.</label>
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
            this.$http.post('http://localhost:4941/api/v1/users/login', loginJSON)
            .then(function(response) {
                console.log(response);

                $('#loginUserModal').modal('hide');
                 window.location.reload();

                this.loggedInUserId = response.body.id;
                localStorage.setItem("token", response.body.token);
                localStorage.setItem("user_id", response.body.id)
                this.loginUsername = "";
                this.loginPassword = "";
                this.loginEmail = "";
                this.invalidLoginString = "";
            }, function(err) {
                this.invalidLoginInput = true;
                this.invalidLoginString = "Invalid username or password! Please try again.";
            });


        }
        
    },

    logoutUser: function() {
        this.$http.post('http://localhost:4941/api/v1/users/logout', 
        {},
        {headers: {'X-Authorization': localStorage.getItem("token")}})
        .then(function(response) {
            this.loggedInUserId = "";
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            window.location.reload();
            this.$router.push('/');
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
                        $('#addUserModal').modal('hide');
                        this.loggedInUser = response.body;
                        window.location.reload();
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
}

a {
  color: #ffffff;
  padding: 12px 20px;
}

.navbar-brand
{
  font-size: 30px;
}

.nav-link.selected {
  color: #ffffff;
}

.nav-link {
    display: inline;
}

/* input[type=text], input[type=email], input[type=password] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
} */

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
  width: 200px;
}

.bg-primary {
    color: rgb(0, 0, 0);
}


</style>
