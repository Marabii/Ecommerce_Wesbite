const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1300, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 890, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };


import shoes from "/shoes.png"
import chinos from "/chinos.png"
import polos from "/polos.png"
import suit from "/suit.png"
import sunglasses from "/sunglasses.png"

const shopTourImages = [{img : shoes, name : "shoes"}, {img : chinos, name : "chinos"},{img : polos, name : "polos"}, {img : suit, name : "suit"}, {img : sunglasses, name : "sunglasses"}]

export default {responsive, shopTourImages}