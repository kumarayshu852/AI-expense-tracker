class APiResponse{
    static success(res,data ={}, message ='Success',statusCode=200){
        return res.status(statusCode).json({
            success:true,
            message,
            data,
        });
    }

    static error(res,message ="Something went wrong",statusCode =500){
        return res.status(statusCode).json({
            successs:false,
            message,
        });
    }
}
module.exports =APiResponse;