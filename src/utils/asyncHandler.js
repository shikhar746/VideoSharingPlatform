//a wrapper fuction we are making rightnow

//Method-1
const asyncHandler =(requestHandler)=> {
    (req, res, next) => {
        Promise.resolve(requestHandler(req,res,next)).
        catch((err) => next)
    }
}




//Method-2
//basically it is a function inside another function
// const asyncHandler =(fn)=> async(req,res,next) => {
//     try{

//     }catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }


export {asyncHandler}


















