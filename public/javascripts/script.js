$(document).ready(() => {
   console.log('script loaded');

   /* Add to cart button in index page */
   $(".addToCartButton").click((e) => {
      console.log(e);
      let id = e.target.value;
      console.log(id);
      $.ajax(`/cart/add-to-cart/${id}`).always((a, b, resData) => {
         console.log(resData.responseJSON);
         if (!resData.responseJSON.loginStatus) {
            window.location = `/account/login/`;
         } else if (resData.responseJSON.success) {
            if (!$("sup").html())
               $("sup").html(0)
            $("sup").html(parseInt($("sup").html()) + 1)
            console.log("json sucess");
         } else {
            // console.log("error in api");
         }
      })
   })
})


/* change product quantity in /cart */
function changeProduct(userId, productId, oper) {
   let ele = $(`#${productId}`)[0].previousElementSibling;
   if (!($(`#${productId}`).val() <= 1 && oper < 0)) {
      let data = { userId, productId, oper }
      $.ajax({
         method: 'POST',
         url: '/cart/edit-product-quantity',
         data
      }).always((response) => {
         if (response.success)
            $(`#${productId}`).val(response.updatedQuantity);
         if (ele?.hasAttribute('disabled'))
            ele.removeAttribute('disabled');
         loadTotal();
      })
   } else {
      ele.setAttribute('disabled', null)
   }
}

/* get total amount from backend */
function loadTotal() {
   $.ajax('/cart/get-totla-price').always((res) => {
      if (res.success) {
         $('#total').html(res.payloadTotal);
      }
   })
}