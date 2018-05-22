<template>
    <div>
        <div class="container">
            <br/>
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
