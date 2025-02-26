const errHandler =(err, req,res,next)=>{
    
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500 //server error

    res.status(status);

    res.json({message: err.message})

    next();
}

module.exports = errHandler;
