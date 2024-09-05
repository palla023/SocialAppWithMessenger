import "./share.css";
import { useContext, useState } from 'react'
import { AuthContext } from "../../context/AuthContext";
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@material-ui/icons"
import axios from 'axios'

export default function Share() {
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  // console.log(username)
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const submiHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc
    }
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName; //img:"" backend name
      // console.log(newPost);

      try {
        const response = await axios.post("/upload", data);
        console.log(response.data); // Log the response to ensure it's successful
      } catch (err) {
        console.error(err); // Log the error if the upload fails
      }
    }


    try {
      await axios.post('/posts', newPost)
      setDesc('');
      setFile(null);
      window.location.reload();
    } catch (err) { }

  }
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" />
          <input
            placeholder={`What's in your mind ${user.username}?`}
            className="shareInput"
            type='text'
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImageContainer">
            {/* URL.createObjectURL(file) generates a URL that the browser can use to access the file, allowing it to be displayed as an image. */}
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" /> 
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submiHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
