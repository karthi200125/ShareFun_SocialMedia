import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FriendsCard, Loading, PostCard, ProfileCard, TopBar } from "../components";
import { API, deletePost } from "../utils";

const Profile = () => {
  const { id } = useParams();  
  const { user } = useSelector((state) => state.user);  
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);
  const [posts, setposts] = useState([]);

  const getUser = async () => {
    const res = await API.get(`/users/getuser/${id}`)
    setUserInfo(res)
  }

  const getPosts = async () => {
    const res =await API.post("/posts" ,{profileId:id})
    setLoading(false)
    setposts(res.data)
  }

  const handleDelete = async (id) => {
    await deletePost({ id, userId: user?.user?._id })
    await getPosts()
  };

  const handleLikePost = (url) => {

  };


  useEffect(() => {
    setLoading(true)
    getUser();
    getPosts();
  }, [id])

  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={userInfo?.data} />

            <div className='block lg:hidden'>
              <FriendsCard friends={userInfo?.data?.user?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
            {loading ? (
              <Loading />
            ) : posts?.data?.length > 0 ? (
              posts?.data?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendsCard friends={userInfo?.data?.user?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
