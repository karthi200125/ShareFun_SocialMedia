import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { BiSolidRightArrowAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Authcontext';
import { API } from '../utils/index';
import Navbar from '../../components/Navbar/Navbar';
import { errorToast, successToast } from '../../toasts';
import './EditProfile.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';

const EditProfile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation((newpost) => {
    return API.put(`/users/${user._id}`, newpost);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
    },
  });

  const handleUploadProgress = (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  };

  const handleUploadError = (error) => {
    errorToast('Upload error');
    setIsLoading(false);
  };

  const handleUploadComplete = async (uploadTask) => {
    try {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await mutation.mutateAsync({
        email,
        username,
        userId: user._id,
        profilePic: downloadURL
      });
      dispatch({ type: "UPDATE_PROFILE", payload: { email, username, profilePic: downloadURL } });
      navigate(`/profile/${user._id}`);
      successToast("User Profile Updated");
    } catch (error) {
      errorToast("User Profile Update Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !file) return;

    setIsLoading(true);

    try {
      const imgUrl = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, imgUrl);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', handleUploadProgress, handleUploadError);
      uploadTask.then(() => handleUploadComplete(uploadTask));
    } catch (error) {
      errorToast("User Profile Update Failed");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='editcon'>
        <form onSubmit={handleSubmit}>
          <div className='edittop'>
            <h1>Edit Profile</h1>
            <p>Keep your personal details private. Information you add here is visible to anyone who can view your profile.</p>
          </div>

          <div className='imgcon'>
            <p>Photo</p>
            <div className='imgcon2'>
              {user.profilePic ?
                <img src={user.profilePic} alt={user.username} className='editproimg' />
                :
                <img src="https://images.getpng.net/uploads/preview/instagram-social-network-app-interface-icons-smartphone-frame-screen-template27-1151637511568djfdvfkdob.webp" alt="" className='editpropic' />
              }
              <label className='graybtn' htmlFor='imageInput'>
                Change
              </label>
              {file && (
                <div className="changeimgcon">
                  <BiSolidRightArrowAlt size={30} />
                  <img className="changeimg" alt="" src={URL.createObjectURL(file)} />
                </div>
              )}
              <input
                type='file'
                id='imageInput'
                accept='image/*'
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className='editinputbox'>
            <span>Name</span>
            <input type='text' placeholder='User Name' value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className='editinputbox'>
            <span>Email</span>
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='btns'>
            <button className='graybtn'>Reset</button>
            <button className='redbtn' type='submit' disabled={isLoading}>
              {isLoading ? "Please Wait..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
