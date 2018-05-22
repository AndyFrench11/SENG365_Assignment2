<template>
    <div>

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

        <br/>

        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal">Edit User</button>

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

        
        <br/><br/>

    </div>
    
</template>

<script>
export default {
    data() {
        return {
            

            //Variables for the "logged in user" label
            loggedInUserId: "",
            loginString: "",
            loggedInUser: "",

            //Update User Variables
            updateGivenName: "",
            updateFamilyName: "",
            updateInvalidInput: false,
            updateInvalidString: ""
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

            
    },
    methods: {


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


            }

           
    }

    
}
</script>

<style scoped>

</style>


