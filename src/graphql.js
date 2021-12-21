export const GET_PRODUCTS = `query Products($filterProduct:String,$filterUser:String,$showUser:Boolean = false,$hideCode:Boolean = true){
     products(filterProduct:$filterProduct,filterUser:$filterUser){
         name,
         date,
         quantity,
         receivedBy @include(if: $showUser){
             name
             code @skip(if: $hideCode)
         }
     }
 }
 `

export const GET_AVAILABLE_PRODUCTS = `{
    availableProducts{
        name
    }
 }`