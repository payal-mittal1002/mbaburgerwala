 export const  errorMiddleWare=((err,req,res,next)=>{
    console.log(err);
    err.message=err.message||"Internal server error"
   
    err.statusCode=err.statusCode||500;
    res.status(err.statusCode).json({
        success:false,
        message:err.message,

    });
 });

 export const asyncError=(passedFunction)=>(req,res,next)=>{
    
Promise.resolve(passedFunction(req,res,next)).catch(next);
 }