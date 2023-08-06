export const isAuthenticated=((req,res,next)=>{
          const token=req.cookies["connect.sid"];
         
          if(!token){
            return next(new Error("Not Logged In",401))
          }
          next();
});


export const authorizedAdmin=((req,res,next)=>{
  
  if((req.user.role)!=="admin"){
    return next(new Error("Only Admin Allowed",405))
  }
  next();
})