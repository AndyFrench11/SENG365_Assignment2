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
              <router-link :to="{ name: 'auctions'}">My Account</router-link>
          </li>
          </ul>
      </div>
    </nav>
    <br/>
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
      msg: 'Welcome to Your Vue.js App'
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

</style>
