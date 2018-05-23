<template>
    <div>
        <div class="container">
            <br/>

            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img class="d-block w-100" src="./assets/city.jpg" alt="First slide">
                    <div class="carousel-caption d-none d-md-block">
                        <h1><font color="white">Welcome to Auctions R' Us !</font></h1>
                        <h3>The trading website that will change your life.</h3>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img class="d-block w-100" src="./assets/bike.jpg" alt="Second slide">
                    <div class="carousel-caption d-none d-md-block">
                        <h1><font color="white">Visit the auctions page to view all auctions!</font></h1>
                        <h3>Buy and Choose items as you wish!</h3>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img class="d-block w-100" src="./assets/beach2.jpg" alt="Third slide">
                    <div class="carousel-caption d-none d-md-block">
                        <h1><font color="white">Personalise your account in the my account page!</font></h1>
                        <h3>View and edit all of your details.</h3>
                    </div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
                </div>


            
        </div>

        <br/><br/><br/>

        
    </div>

</template>

<script>
    export default {
        data () {
            return {
                error: "",
                errorFlag: false,

                slide: 0,
                sliding: null
                
            }
        },
        mounted: function() {


        },
        methods: {
            onSlideStart (slide) {
            this.sliding = true
            },

            onSlideEnd (slide) {
            this.sliding = false
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
