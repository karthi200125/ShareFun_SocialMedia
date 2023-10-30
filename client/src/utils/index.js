import axios from 'axios';
import { SetPosts } from '../redux/postSlice';

const API_URL = "https://soaiclmediaapi.onrender.com/";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method, userId }) => {  
  try {
    const result = await API({
      url,
      method: method || "GET",
      data: { ...data },
      userId:userId
    });
    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.status, message: err.message };
  }
};


export const fetchPosts = async (user, dispatch) => {  
  try {
    const res = await API.post("/posts", { userId: user?.user?._id });
    console.log(res.data);
    dispatch(SetPosts(res?.data));
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId) => {
  try {
    const res = await apiRequest({
      url: "/posts/" + postId,      
      method: "DELETE",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (user, id) => {  
  console.log("get user info", user , id )
  // try {
  //   const url = id === undefined ? "/users/getuser" : "/users/getuser/" + id;
  //   const res = await apiRequest({
  //     url: url,
  //     userId: user?.user?._id,
  //     method: "GET",
  //   });

  //   if (res.message === "Authentication failed") {
  //     localStorage.removeItem("user");
  //     window.alert("User session expired. Login again.");
  //     window.location.replace("/login");
  //   }
  //   return res;
  // } catch (error) {
  //   console.log(error);
  // }
};

export const sendFriendRequest = async (user, id) => {
  try {
    const res = await apiRequest({
      url: "/users/friendrequest",      
      method: "POST",
      data: { requestTo: id , userId:user?.user?._id},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const viewUserProfile = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/profileview",
      token: token,
      method: "POST",
      data: { id },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
