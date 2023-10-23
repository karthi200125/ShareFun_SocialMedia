import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CustomButton, EditProfile, FriendsCard, Loading, PostCard, ProfileCard, TextInput, TopBar } from "../components";
import { apiRequest, deletePost, fetchPosts, getUserInfo, sendFriendRequest } from '../utils/index';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";
import { NoProfile } from "../assets";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector(state => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState(""); // Store the URL of the uploaded image

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg("");

    // Check if a file is selected
    if (file) {
      try {
        // Upload the image to Firebase Storage
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can update a progress bar here if needed
          },
          (error) => {
            setErrMsg("Image upload failed");
            setPosting(false);
          },
          () => {            
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {                
                setImageURL(downloadURL);                
                createPostWithImage(data, downloadURL);
              })
              .catch((error) => {
                setErrMsg("Failed to get image URL");
                setPosting(false);
              });
          }
        );
      } catch (error) {
        setErrMsg("Image upload failed");
        setPosting(false);
      }
    } else {      
      createPostWithImage(data, "");
    }
  };

  const createPostWithImage = async (data, imageUrl) => {
    try {
      const res = await apiRequest({
        url: "posts/create-post",
        data: { ...data, userId: user?.user?._id, image:imageUrl },
        method: "POST",
      });

      if (res?.data === "failed") {
        setErrMsg(res);
      } else {
        setFile(null);
        setErrMsg("");
        setImageURL(""); 
        await fetchPost();
      }
      setPosting(false);
    } catch (error) {
      setPosting(false);
    }
  };

  const fetchPost = async () => {
    await fetchPosts(user, dispatch)
    setLoading(false)
  };

  const handlePostLike = async (uri) => {
    try {
      const res = await axios.post(
        `http://localhost:8800${uri}`,
        { userId: user?.user?._id }
      );
      console.log(res.data);
      await fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId)
    await fetchPost()
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.post("http://localhost:8800/users/getfriendrequest", { userId: user?.user?._id })
      setFriendRequest(res?.data)
    } catch (error) {
      console.log(error)
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8800/users/sugestedfriends",
        { userId: user?.user?._id }
      );
      setSuggestedFriends(res?.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user, id)
      await fetchSuggestedFriends();
    } catch (error) {
      console.log(error)
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await axios.post("http://localhost:8800/users/acceptrequest", { userId: user?.user?._id, rid: id, status });
      setFriendRequest(res?.data)
    } catch (error) {
      console.log(error)
    }
  };

  const getUser = async () => {
    const res = await getUserInfo(user)
    // dispatch(login(res?.data))
  };


  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();    
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);



  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className='bg-primary px-4 rounded-lg'
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.user?.profileUrl ?? NoProfile}
                  alt='User Image'
                  className='w-14 h-14 rounded-full object-cover'
                />
                <TextInput
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind...."
                  name='description'
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role='alert'
                  className={`text-sm ${errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                    } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className='flex items-center justify-between py-4'>
                <label
                  htmlFor='imgUpload'
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input
                    type='file'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='imgUpload'
                    data-max-size='5120'
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='videoUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='videoUpload'
                    accept='.mp4, .wav'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='vgifUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='vgifUpload'
                    accept='.gif'
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type='submit'
                      title='Post'
                      containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
                    />
                  )}
                </div>
              </div>
            </form>

            {loading ? (
              <Loading />
            ) : posts?.data?.length > 0 ? (
              posts?.data?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDeletePost}
                  likePost={handlePostLike}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGJT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.data?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.data?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <Link
                      to={"/profile/" + from._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        onClick={() => acceptFriendRequest(_id, "Accepted")}
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                      <CustomButton
                        title='Deny'
                        onClick={() => acceptFriendRequest(_id, "Denied")}
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.data?.map((friend) => (
                  <div
                    className='flex items-center justify-between'
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => handleFriendRequest(friend?._id)}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
