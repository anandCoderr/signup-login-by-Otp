import PostModel from '../Module/PostModel.js'

import  { errorHelper, successHelper,validatorHelper} from '../Helper/globalHelper.js';

import LikeModel from '../Module/likeAndDislikeModel.js'


const userPost=async(req,res)=>{

    const loggedUserId=req.userId;
    
    try{

    const {title,description}=req.body;
    console.log(`Files Data ==`,req.files);
    

    const rules={
        title:'required|string',
        description:'required|string',
        
       
    }


        
        const inputValidatorInstance= validatorHelper(req.body,rules);

    if(!inputValidatorInstance)
    {
        return errorHelper(res,{message:"All Fields are required",status:400});
    }

   


    const user=new PostModel({userId:loggedUserId,title,description,images:req.files});

    const userPostSaveInstance=await user.save();

    if(!userPostSaveInstance)
    {
        return errorHelper(res,{message:"Failed to save User",status:500});
    }

    return successHelper(res,"User Created Successfully",200,userPostSaveInstance);

}
catch(err){
    return errorHelper(res,err);

}


}


// ---------- All posts

// const getUserPosts=async(req,res)=>{

//     try{


//         const postsInstance=await PostModel.find({}).populate("userId");
//         if(!postsInstance)
//         {
//             return errorHelper(res,{message:"No Posts Found",status:404});
//         }

//         return successHelper(res,"Posts fetched successfully",200,postsInstance);


//     }
//     catch(err){
//         return errorHelper(res,err);

//     }


// } 



const getUserPosts=async(req,res)=>{

    const {search}=req.query;

    try{
   let condition = {}

   if (search) {
    condition = {
        $or: [
            { title: { $regex: search, $options: "i" } },       // Search in title
            { description: { $regex: search, $options: "i" } }, // Search in description
            { 'user.name': { $regex: search, $options: "i" } } // Search in description

        ]
    };
}

            const postsInstance=await PostModel.aggregate([
               
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                { $unwind : "$user" },
                {
                    $match:condition
                },
               
               
            ]);

            if(!postsInstance)
            {
                return errorHelper(res,{message:"No Posts Found",status:404});
            }


            
            return successHelper(res,"Posts fetched successfully",200,postsInstance);
            


    }
    catch(err){
        return errorHelper(res,err);

    }


} 



// liek a& dislike posts 


const likeAndDislike=async(req,res)=>{

    const loggedUserId=req.userId;

    const {postId}=req.body;

    const rules={
        postId:'required|string',
    }
    try{

        const validatorInstance=validatorHelper(req.body,rules);

        if(!validatorInstance){
            return errorHelper(res,{message:"All Fields are required",status:400});
        }

        const likeInstance=await LikeModel.findOne({$and:[{userId:loggedUserId},{postId:postId}]});

if(likeInstance)
{

   
    const delInstance=await LikeModel.findByIdAndDelete(likeInstance._id);

    if(!delInstance)
    {
        return errorHelper(res,{message:"Failed to delete liked post",status:500});
    }

    // -----------post dislike count
    const postDislikeInstance=await PostModel.findOneAndUpdate({ _id: postId },
        { $inc: { totalLike: -1 } }, // Increment totalLike by 1
        { new: true } // Return the updated document);
    );
    if(!postDislikeInstance)
        {
            return errorHelper(res,{message:"Failed to update post dislike count",status:500});
        }

    return successHelper(res,"Post Disliked Successfully",200);

}


        const likeSaveInstance=new LikeModel({userId:loggedUserId,postId:postId});

        const saveLikeInstance=await likeSaveInstance.save();

        if(!saveLikeInstance)
            {
                return errorHelper(res,{message:"Failed to save liked post",status:500});
            }

            const postLikeInstance = await PostModel.findOneAndUpdate(
                { _id: postId },
                { $inc: { totalLike: 1 } }, // Increment totalLike by 1
                { new: true } // Return the updated document
            );
            
            if(!postLikeInstance)
            {
                return errorHelper(res,{message:"Failed to update post like count",status:500});
            }
    

            return successHelper(res,"Post Liked Successfully",200);


    }
    catch(err){
        return errorHelper(res,err);

    }




}


export {userPost,getUserPosts,likeAndDislike}



  