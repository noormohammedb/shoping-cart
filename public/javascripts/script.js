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
            window.location = `${window.location.protocol}//${window.location.host}/account/login/`;
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

var ele;

/* change product quantity in /cart */
function changeProduct(userId, productId, oper) {
   if (!($(`#${productId}`).val() <= 1 && oper < 0)) {
      $.ajax({
         method: 'POST',
         url: '/cart/edit-product-quantity',
         data: { userId, productId, oper }
      }).always((response) => {
         if (response.success)
            $(`#${productId}`).val(response.updatedQuantity);
         if (ele?.hasAttribute('disabled'))
            ele.removeAttribute('disabled');
      })
   } else {
      ele = $(`#${productId}`)[0].previousElementSibling;
      ele.setAttribute('disabled', null)
   }
}
