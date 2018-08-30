var eventBus = new Vue()

Vue.component('other-details-tab',{
	props: {
		shipping:{
			required: true
		},
		details:{
			type: Array,
			required: true
		}
	},
	template: `
	<div>
		<span v-for="(tab,index) in tabs" class="tab" 
		:class="{activeTab : selectedTab === tab}"
		@click="selectedTab = tab">
			{{tab}}
		</span>

		<p v-show="selectedTab === 'Shipping'">User is premium {{shipping}}</p>
		<product-details v-show="selectedTab === 'Details'" :details="details"></product-details>
		
	</div>
	`,
	data(){
		return{
			tabs: ['Shipping','Details'],
			selectedTab: 'Shipping'
		}
	}
})

Vue.component('product-tabs',{
	props: {
		reviews:{
			type: Array,
			required: true
		}
	},
	template: `
<div>
	<span v-for="(tab,index) in tabs" class="tab"
	:class="{ activeTab : selectedTab === tab}"
	 @click="selectedTab = tab">
		{{tab}}
	</span>


	   <div v-show="selectedTab === 'Reviews'">
			<h2>Reviews</h2>
			<p v-if="!reviews.length">There are no reviews yet</p>
			<ul>
				<li v-for="review in reviews">
					<p>{{review.name}}</p>
					<p>{{review.review}}</p>
					<p>{{review.rating}}</p>
					<p>{{review.recommendation}}</p>
				</li>
			</ul>
		</div>

          <product-review v-show="selectedTab==='Make a Review'"></product-review>
</div>

	`,
	data(){
		return {
			tabs: ["Reviews","Make a Review"],
			selectedTab: 'Reviews'
		}
	}
})

Vue.component('product-review',{
	template: `
<form class="submit-form" @submit.prevent="onSubmit">
	<p v-if="errors.length">
		<b>Please correct the following errors</b>
		<ul>
			<li v-for="error in errors">
				{{error}}
			</li>			
		</ul>
	</p>

	<p>
		<label for="name">Name:</label>
		<input id="name" v-model="name">
	</p>

	<p>
		<label for="review">Review:</label>
		<textarea id="review" v-model="review"></textarea>
	</p>

	<p>
		<label for="rating">Rating:</label>
		<select id="rating" v-model="rating">
			<option>5</option>
			<option>4</option>
			<option>3</option>
			<option>2</option>
			<option>1</option>
		</select>
	</p>

	<p>
		<span>Would you recommend this product: </span>
  		<input type="radio" v-model="recommendation" value="yes" checked> Yes<br>
  		<input type="radio" v-model="recommendation" value="no"> No<br>
	</p>

	<p>
		<input type="submit" value="Submit">
	</p>
</form>
	`,
	data(){
		return {
			name:null,
			review: null,
			rating: null,
			recommendation: null,
			errors: []
		}
	},
	methods:{
		onSubmit(){

			if (this.name && this.review && this.rating) {
				let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating,
				recommendation: this.recommendation
			}
			eventBus.$emit('review-submitted',productReview)

			this.name = null
			this.review = null
			this.rating = null
			this.recommendation = null
			}
			else {
				if (!this.name) {this.errors.push("Name required")}
				if (!this.review) {this.errors.push("Review required")}
				if (!this.rating) {this.errors.push("Rating required")}
				if (!this.recommendation) {this.errors.push("Recommendation required")}
			}
		}
	}
})

Vue.component('product-details',{
	props: {
		details:{
			type: Array,
			required: true
		}
	},
	template: `
          <ul>
            <li v-for="detail in details" :key="detail.desc1">{{detail}}</li>
          </ul>
	`
})

Vue.component('product',{
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
		<div class="product">

        <div class="product-image">
          <a :href="product.href">
            <img :src="image">
          </a>
        </div>

        <div class="product-info">
          <h1>{{title}}</h1>
          <h2>{{product.desc}}</h1>
          <h3 v-if="product.inventory > 10">In Stock !</h3>
          <h3 v-else-if="product.inventory < 10 && product.inventory >=1">Almost sold out !</h3>

          <!-- shown below are 3 ways of binding classes -->
<!--           <h3 :class="{outOfStock : !product.inStock}" v-else>Out of Stock !</h3> -->
          <!-- <h3 :class="outOfStockClassObject" v-else>Out of Stock !</h3> -->
          <h3 :class="[inStock ? '' : 'outOfStock']" v-else>Out of Stock !</h3>
          
          <p>{{onSale}}</p>

        <product-tabs :reviews="product.reviews"></product-tabs>
        <other-details-tab :shipping="shipping" :details="product.details"></other-details-tab>

          <div v-for="(variant, index) in product.variants"
           :key="variant.color"
           class="color-box"
           :style="variant.styleObject" 
           @mouseover="showVariant(index)">
          </div>

          <button :disabled="!inStock" 
                  :class="{disabledButton: !inStock} "
                  @click="addToCart">Add to Cart</button>

          <button @click="removeFromCart">Remove</button>
      </div>
	`,
	data() {
		return {
		product: {
			brand: 'Vue',
			name: 'Socks',
			desc: 'Warm socks that would keep your feet cozy in winters',
			selectedVariant: 0,
			// img: './stihl.gif',
			href: 'http://publish.stihl-aem-demo.rg02.diconium.cloud/',
			inStock: false,
			inventory: 10,
			onSale: false,
			details: [{
				desc1: "80 % metal",
				desc2: "20 % aluminium",
				desc3: " used to cut trees"
			},
			{
				desc1: "50 % metal",
				desc2: "20 % aluminium",
				desc3: " used to cut trees"
			}],
			variants: [{
				id: "GJKK123",
				color: "Orange",
				img: "./stihl1.gif",
				styleObject:{
					backgroundColor: "Orange"
				},
				quantity: 10,
				onSale: true
			},
			{
				id: "OOU45",
				color: "Green",
				img: "./stihl2.gif",
				styleObject:{
					backgroundColor: "Green"
				},
				quantity: 1,
				onSale: false
			}],
			cart: 0,
			reviews: []
		}
	}
	},
	methods: {
		addToCart(){
			this.$emit('add-to-cart',this.product.variants[this.product.selectedVariant].id)
		},
		showVariant(index){
			this.product.selectedVariant = index;
			console.log(index);
		},
		removeFromCart(){
			this.$emit('remove-from-cart',this.product.variants[this.product.selectedVariant].id)
		}
	},
	computed: {
		  	outOfStockClassObject() {
   			 return {
    			  outOfStock: !this.product.inStock
    			}
  			},
  			title(){
  				return this.product.brand + "..." + this.product.name;
  			},
  			image(){
  				return this.product.variants[this.product.selectedVariant].img;
  			},
  			inStock(){
  				return this.product.variants[this.product.selectedVariant].quantity;
  			},
  			onSale(){
  				if (this.product.variants[this.product.selectedVariant].onSale) {
  					return this.product.brand + "..." + this.product.name + " are on sale"
  				}
  					return this.product.brand + "..." + this.product.name + " are not on sale"
  			},
  			shipping(){
  				if (this.premium) {
  					return "Free"
  				}
  				return 2.99
  			}
  			// onSale(){
  			// 	return this.product.variants[this.product.selectedVariant].onSale;
  			// }
	},
	mounted(){
		eventBus.$on('review-submitted', productReview => {
			this.product.reviews.push(productReview)
		})
	}

})

var app= new Vue({
	el: '#app',
	data: {
		premium: false,
		cart: []
	},
	methods:{
		updateCart(id){
			this.cart.push(id)
		},
		removeFromCart(id){
			this.cart.pop(id,1)
		}
	}
})